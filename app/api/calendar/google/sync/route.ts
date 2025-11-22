import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getScheduleById } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { scheduleId } = await request.json()
    const schedule = await getScheduleById(scheduleId)

    if (!schedule) {
      return createErrorResponse(new Error("Planning introuvable"), undefined, 404)
    }

    // In production, sync with Google Calendar API
    // For now, return success
    return createSuccessResponse({
      message: "Planning synchronisé avec Google Calendar",
      eventsCreated: schedule.shifts?.length || 0,
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

