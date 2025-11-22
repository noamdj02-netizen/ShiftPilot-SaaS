import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getScheduleById, updateSchedule } from "@/lib/db"
import { z } from "zod"

const exchangeShiftSchema = z.object({
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

    const body = await exchangeShiftSchema.parseAsync(await request.json())
    const { scheduleId, shiftId, fromEmployeeId, toEmployeeId, message } = body

    const schedule = await getScheduleById(scheduleId)

    if (!schedule) {
      return createErrorResponse(new Error("Planning introuvable"), undefined, 404)
    }

    if (schedule.status === "published") {
      return createErrorResponse(
        new Error("Impossible d'échanger un shift dans un planning publié"),
        undefined,
        400
      )
    }

    // Find the shift
    const shiftIndex = schedule.shifts?.findIndex(
      (s: any) => s.id === shiftId && s.employeeId === fromEmployeeId
    )

    if (shiftIndex === -1 || !shiftIndex) {
      return createErrorResponse(new Error("Shift introuvable"), undefined, 404)
    }

    // Update the shift
    const updatedShifts = [...(schedule.shifts || [])]
    updatedShifts[shiftIndex] = {
      ...updatedShifts[shiftIndex],
      employeeId: toEmployeeId,
      exchangedAt: new Date().toISOString(),
      exchangeRequestedBy: fromEmployeeId,
      exchangeMessage: message,
    }

    // Update schedule
    const updatedSchedule = await updateSchedule(scheduleId, {
      shifts: updatedShifts,
    })

    // In production, send notifications to both employees
    // notifyShiftExchange(fromEmployeeId, toEmployeeId, shiftId, scheduleId, message)

    return createSuccessResponse({
      success: true,
      schedule: updatedSchedule,
      message: "Shift échangé avec succès",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(new Error("Données invalides"), error.errors, 400)
    }
    return createErrorResponse(error)
  }
}

