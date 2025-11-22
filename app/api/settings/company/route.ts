import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"

const companySchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
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
      company: user.settings?.company || {
        name: user.companyName,
        address: "",
        city: "",
        postalCode: "",
        country: "France",
        phone: "",
        email: user.email,
        website: "",
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la récupération des informations")
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()

    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`settings:company:${clientId}`, 10, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const body = await request.json()

    const validationResult = companySchema.safeParse(body)
    if (!validationResult.success) {
      return createErrorResponse(validationResult.error)
    }

    const session = await requireAuth()
    const { updateUser } = await import("@/lib/db")
    const { getUserById } = await import("@/lib/db")

    const user = await getUserById(session.id)
    if (!user) {
      return createErrorResponse(new Error("Utilisateur non trouvé"), "User not found")
    }

    await updateUser(session.id, {
      companyName: body.name,
      settings: {
        ...user.settings,
        company: {
          name: body.name || "",
          address: body.address || "",
          city: body.city || "",
          postalCode: body.postalCode || "",
          country: body.country || "France",
          phone: body.phone || "",
          email: body.email || "",
          website: body.website || "",
        },
      },
    })

    return createSuccessResponse({
      success: true,
      message: "Informations entreprise mises à jour avec succès",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la mise à jour")
  }
}

