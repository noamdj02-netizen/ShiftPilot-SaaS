import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { getScheduleById, updateSchedule } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params

    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`schedules:unpublish:${clientId}`, 5, 60000)

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

    // Check if schedule is published
    if (schedule.status !== "published") {
      return createErrorResponse(
        new Error("Ce planning n'est pas publié"),
        "Not published"
      )
    }

    // Unpublish the schedule (change back to draft)
    const updatedSchedule = await updateSchedule(id, {
      status: "draft",
    })

    return createSuccessResponse({
      success: true,
      schedule: updatedSchedule,
      message: "Planning dépublié avec succès. Il peut maintenant être modifié.",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la dépublication du planning")
  }
}

