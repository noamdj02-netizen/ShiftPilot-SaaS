import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { promises as fs } from "fs"
import path from "path"
import { z } from "zod"
import { randomUUID } from "crypto"

const leaveRequestsFile = path.join(process.cwd(), "data", "leave-requests.json")

interface LeaveRequest {
  id: string
  employeeId: string
  startDate: string
  endDate: string
  type: "paid" | "unpaid" | "sick" | "other"
  reason?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

async function readLeaveRequests(): Promise<LeaveRequest[]> {
  try {
    const data = await fs.readFile(leaveRequestsFile, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.writeFile(leaveRequestsFile, JSON.stringify([], null, 2), "utf-8")
      return []
    }
    throw error
  }
}

async function writeLeaveRequests(requests: LeaveRequest[]): Promise<void> {
  await fs.writeFile(leaveRequestsFile, JSON.stringify(requests, null, 2), "utf-8")
}

const leaveRequestSchema = z.object({
  employeeId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  type: z.enum(["paid", "unpaid", "sick", "other"]),
  reason: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)

    const body = await leaveRequestSchema.parseAsync(await request.json())
    const { employeeId, startDate, endDate, type, reason } = body

    const requests = await readLeaveRequests()
    const now = new Date().toISOString()

    const newRequest: LeaveRequest = {
      id: randomUUID(),
      employeeId,
      startDate,
      endDate,
      type,
      reason,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    }

    requests.push(newRequest)
    await writeLeaveRequests(requests)

    // In production, send notification to managers

    return createSuccessResponse({
      success: true,
      request: newRequest,
      message: "Demande de congé créée avec succès",
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

    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")

    let requests = await readLeaveRequests()

    if (employeeId) {
      requests = requests.filter((r) => r.employeeId === employeeId)
    }

    // Sort by most recent first
    requests.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return createSuccessResponse({
      requests,
      total: requests.length,
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

