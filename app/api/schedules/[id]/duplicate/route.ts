import { type NextRequest, NextResponse } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { getScheduleById, readData, writeData, SCHEDULES_FILE } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: scheduleId } = await params
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const schedule = await getScheduleById(scheduleId)

    if (!schedule) {
      return createErrorResponse(new Error("Planning introuvable"), undefined, 404)
    }

    // Create duplicate with new ID and name
    const schedules = await readData(SCHEDULES_FILE)
    const newSchedule = {
      ...schedule,
      id: `schedule-${Date.now()}`,
      name: `${schedule.name} (Copie)`,
      status: "draft" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    schedules.push(newSchedule)
    await writeData(SCHEDULES_FILE, schedules)

    return createSuccessResponse(
      {
        schedule: newSchedule,
      },
      201
    )
  } catch (error) {
    return createErrorResponse(error)
  }
}

