import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"

const notificationsSchema = z.object({
  emailReports: z.boolean().optional(),
  emailAlerts: z.boolean().optional(),
  emailScheduleChanges: z.boolean().optional(),
  emailMarketing: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const { getUserById } = await import("@/lib/db")
    const user = await getUserById(session.id)

    if (!user) {
      return createErrorResponse(new Error("Utilisateur non trouvé"), "User not found")
    }

    return createSuccessResponse({
      notifications: user.settings?.notifications || {
        emailReports: true,
        emailAlerts: true,
        emailScheduleChanges: true,
        emailMarketing: false,
        pushNotifications: true,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la récupération des paramètres")
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()

    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`settings:notifications:${clientId}`, 10, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const body = await request.json()

    const validationResult = notificationsSchema.safeParse(body)
    if (!validationResult.success) {
      return createErrorResponse(validationResult.error)
    }

    const session = await requireAuth()
    const { updateUser, getUserById } = await import("@/lib/db")

    const user = await getUserById(session.id)
    if (!user) {
      return createErrorResponse(new Error("Utilisateur non trouvé"), "User not found")
    }

    await updateUser(session.id, {
      settings: {
        ...user.settings,
        notifications: {
          emailReports: body.emailReports ?? true,
          emailAlerts: body.emailAlerts ?? true,
          emailScheduleChanges: body.emailScheduleChanges ?? true,
          emailMarketing: body.emailMarketing ?? false,
          pushNotifications: body.pushNotifications ?? true,
        },
      },
    })

    return createSuccessResponse({
      success: true,
      message: "Préférences de notifications mises à jour avec succès",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la mise à jour")
  }
}

