import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getScheduleById, updateSchedule } from "@/lib/db"
import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

const exchangeRequestsFile = path.join(process.cwd(), "data", "exchange-requests.json")

interface ExchangeRequest {
  id: string
  scheduleId: string
  shiftId: string
  fromEmployeeId: string
  toEmployeeId: string
  message?: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  requestedAt: string
  respondedAt?: string
}

async function readExchangeRequests(): Promise<ExchangeRequest[]> {
  try {
    const data = await fs.readFile(exchangeRequestsFile, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeFile(exchangeRequestsFile, JSON.stringify([], null, 2), "utf-8")
      return []
    }
    throw error
  }
}

async function writeExchangeRequests(requests: ExchangeRequest[]): Promise<void> {
  await fs.writeFile(exchangeRequestsFile, JSON.stringify(requests, null, 2), "utf-8")
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { requestId } = await params
    const { action } = await request.json() // "accept" or "reject"

    if (action !== "accept" && action !== "reject") {
      return createErrorResponse(new Error("Action invalide"), undefined, 400)
    }

    const requests = await readExchangeRequests()
    const exchangeRequest = requests.find((r) => r.id === requestId)

    if (!exchangeRequest) {
      return createErrorResponse(new Error("Demande d'échange introuvable"), undefined, 404)
    }

    if (exchangeRequest.status !== "pending") {
      return createErrorResponse(
        new Error("Cette demande d'échange a déjà été traitée"),
        undefined,
        400
      )
    }

    if (action === "accept") {
      // Update the schedule
      const schedule = await getScheduleById(exchangeRequest.scheduleId)

      if (!schedule) {
        return createErrorResponse(new Error("Planning introuvable"), undefined, 404)
      }

      // Find and update the shift
      const shiftIndex = schedule.shifts?.findIndex(
        (s: any) => s.id === exchangeRequest.shiftId
      )

      if (shiftIndex === undefined || shiftIndex === -1) {
        return createErrorResponse(new Error("Shift introuvable"), undefined, 404)
      }

      const updatedShifts = [...(schedule.shifts || [])]
      updatedShifts[shiftIndex] = {
        ...updatedShifts[shiftIndex],
        employeeId: exchangeRequest.toEmployeeId,
        exchangedAt: new Date().toISOString(),
        exchangeRequestedBy: exchangeRequest.fromEmployeeId,
      }

      await updateSchedule(exchangeRequest.scheduleId, {
        shifts: updatedShifts,
      })

      // Update request status
      exchangeRequest.status = "accepted"
      exchangeRequest.respondedAt = new Date().toISOString()

      // In production, send notifications to both employees
      // notifyShiftExchangeAccepted(exchangeRequest)
    } else {
      // Reject request
      exchangeRequest.status = "rejected"
      exchangeRequest.respondedAt = new Date().toISOString()

      // In production, send notification
      // notifyShiftExchangeRejected(exchangeRequest)
    }

    // Update requests file
    const requestIndex = requests.findIndex((r) => r.id === requestId)
    if (requestIndex !== -1) {
      requests[requestIndex] = exchangeRequest
      await writeExchangeRequests(requests)
    }

    return createSuccessResponse({
      success: true,
      request: exchangeRequest,
      message: `Demande d'échange ${action === "accept" ? "acceptée" : "refusée"}`,
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

