import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { getScheduleById, updateSchedule, getSchedules, writeData, SCHEDULES_FILE } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    await requireAuth()

    const { id } = await params

    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`schedules:get:${clientId}`, 30, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const schedule = await getScheduleById(id)

    if (!schedule) {
      return createErrorResponse(new Error("Planning non trouvé"), "Schedule not found")
    }

    return createSuccessResponse({
      schedule,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la récupération du planning")
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const body = await request.json()

    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`schedules:put:${clientId}`, 10, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const schedule = await getScheduleById(id)

    if (!schedule) {
      return createErrorResponse(new Error("Planning non trouvé"), "Schedule not found")
    }

    // Protect published schedules from modification
    if (schedule.status === "published") {
      return createErrorResponse(
        new Error("Ce planning est publié et ne peut pas être modifié. Vous devez le dépublier d'abord."),
        "Cannot modify published schedule"
      )
    }

    // Allow only certain fields to be updated
    const allowedUpdates: Partial<{
      name: string
      shifts: any[]
      status: "draft" | "generating" | "completed" | "published"
    }> = {}

    if (body.name) allowedUpdates.name = body.name
    if (body.shifts) allowedUpdates.shifts = body.shifts
    if (body.status && ["draft", "generating", "completed"].includes(body.status)) {
      allowedUpdates.status = body.status
    }

    const updatedSchedule = await updateSchedule(id, allowedUpdates)

    return createSuccessResponse({
      success: true,
      schedule: updatedSchedule,
      message: "Planning modifié avec succès",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la modification du planning")
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params

    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`schedules:delete:${clientId}`, 5, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const schedule = await getScheduleById(id)

    if (!schedule) {
      return createErrorResponse(new Error("Planning non trouvé"), "Schedule not found")
    }

    // Protect published schedules from deletion
    if (schedule.status === "published") {
      return createErrorResponse(
        new Error("Ce planning est publié et ne peut pas être supprimé. Vous devez le dépublier d'abord."),
        "Cannot delete published schedule"
      )
    }

    // Delete schedule
    const schedules = await getSchedules()
    const filtered = schedules.filter((s) => s.id !== id)
    await writeData(SCHEDULES_FILE, filtered)

    return createSuccessResponse({
      success: true,
      message: "Planning supprimé avec succès",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la suppression du planning")
  }
}
