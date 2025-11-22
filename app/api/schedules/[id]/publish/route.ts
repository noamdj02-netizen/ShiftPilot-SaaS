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
    const rateLimit = checkRateLimit(`schedules:publish:${clientId}`, 10, 60000)

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

    // Check if schedule can be published
    if (schedule.status === "published") {
      return createErrorResponse(
        new Error("Ce planning est déjà publié"),
        "Already published"
      )
    }

    if (schedule.status === "generating") {
      return createErrorResponse(
        new Error("Le planning est en cours de génération. Veuillez patienter."),
        "Still generating"
      )
    }

    if (!schedule.shifts || schedule.shifts.length === 0) {
      return createErrorResponse(
        new Error("Impossible de publier un planning vide. Ajoutez des shifts d'abord."),
        "Empty schedule"
      )
    }

    // Publish the schedule
    const updatedSchedule = await updateSchedule(id, {
      status: "published",
    })

    // Envoyer les notifications aux employés concernés
    try {
      const { notifySchedulePublished } = await import("@/lib/notifications")
      const notificationResult = await notifySchedulePublished(
        id,
        schedule.name,
        schedule.startDate,
        schedule.endDate,
        schedule.shifts || []
      )

      console.log("Notifications envoyées:", notificationResult)
    } catch (notificationError) {
      // Ne pas faire échouer la publication si les notifications échouent
      console.error("Erreur lors de l'envoi des notifications:", notificationError)
    }

    return createSuccessResponse({
      success: true,
      schedule: updatedSchedule,
      message: "Planning publié avec succès. Les employés ont été notifiés par email/SMS.",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la publication du planning")
  }
}

