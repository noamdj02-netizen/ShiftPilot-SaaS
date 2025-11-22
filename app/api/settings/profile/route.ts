import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"

const profileSchema = z.object({
  email: z.string().email("Email invalide").optional(),
  companyName: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères").optional(),
  phone: z.string().optional(),
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
      user: {
        email: user.settings?.profile?.email || user.email,
        companyName: user.settings?.profile?.companyName || user.companyName,
        phone: user.settings?.profile?.phone || user.phone,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la récupération du profil")
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()

    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`settings:profile:${clientId}`, 10, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const body = await request.json()

    const validationResult = profileSchema.safeParse(body)
    if (!validationResult.success) {
      return createErrorResponse(validationResult.error)
    }

    const session = await requireAuth()
    const { updateUser } = await import("@/lib/db")

    await updateUser(session.id, {
      email: body.email,
      companyName: body.companyName,
      phone: body.phone,
      settings: {
        profile: {
          email: body.email,
          companyName: body.companyName,
          phone: body.phone,
        },
      },
    })

    return createSuccessResponse({
      success: true,
      message: "Profil mis à jour avec succès",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la mise à jour du profil")
  }
}

