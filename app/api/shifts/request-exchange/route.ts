import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getScheduleById } from "@/lib/db"
import { z } from "zod"
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

const requestExchangeSchema = z.object({
  scheduleId: z.string(),
  shiftId: z.string(),
  fromEmployeeId: z.string(),
  toEmployeeId: z.string(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const body = await requestExchangeSchema.parseAsync(await request.json())
    const { scheduleId, shiftId, fromEmployeeId, toEmployeeId, message } = body

    const schedule = await getScheduleById(scheduleId)

    if (!schedule) {
      return createErrorResponse(new Error("Planning introuvable"), undefined, 404)
    }

    // Find the shift
    const shift = schedule.shifts?.find((s: any) => s.id === shiftId && s.employeeId === fromEmployeeId)

    if (!shift) {
      return createErrorResponse(new Error("Shift introuvable"), undefined, 404)
    }

    // Check if request already exists
    const requests = await readExchangeRequests()
    const existingRequest = requests.find(
      (r) =>
        r.shiftId === shiftId &&
        r.fromEmployeeId === fromEmployeeId &&
        r.toEmployeeId === toEmployeeId &&
        r.status === "pending"
    )

    if (existingRequest) {
      return createErrorResponse(
        new Error("Une demande d'échange est déjà en attente pour ce shift"),
        undefined,
        400
      )
    }

    // Create exchange request
    const exchangeRequest: ExchangeRequest = {
      id: randomUUID(),
      scheduleId,
      shiftId,
      fromEmployeeId,
      toEmployeeId,
      message,
      status: "pending",
      requestedAt: new Date().toISOString(),
    }

    requests.push(exchangeRequest)
    await writeExchangeRequests(requests)

    // In production, send notification to target employee
    // notifyExchangeRequest(toEmployeeId, fromEmployeeId, shiftId, scheduleId)

    return createSuccessResponse({
      success: true,
      request: exchangeRequest,
      message: "Demande d'échange créée avec succès",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(new Error("Données invalides"), error.errors, 400)
    }
    return createErrorResponse(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")
    const status = searchParams.get("status") as ExchangeRequest["status"] | null

    const requests = await readExchangeRequests()

    let filteredRequests = requests

    if (employeeId) {
      filteredRequests = filteredRequests.filter(
        (r) => r.fromEmployeeId === employeeId || r.toEmployeeId === employeeId
      )
    }

    if (status) {
      filteredRequests = filteredRequests.filter((r) => r.status === status)
    }

    // Sort by most recent first
    filteredRequests.sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    )

    return createSuccessResponse({
      requests: filteredRequests,
      total: filteredRequests.length,
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

