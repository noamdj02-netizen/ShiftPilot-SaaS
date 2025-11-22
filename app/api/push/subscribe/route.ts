import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"

const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const body = await subscriptionSchema.parseAsync(await request.json())

    // En production, stocker la subscription dans la base de données
    // avec l'ID utilisateur pour envoyer des notifications ciblées
    // Pour l'instant, on simule juste le stockage

    console.log("[Push] Subscription saved for user:", user.id, {
      endpoint: body.endpoint,
    })

    return createSuccessResponse({
      success: true,
      message: "Abonnement aux notifications push activé",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(new Error("Données invalides"), error.errors, 400)
    }
    return createErrorResponse(error)
  }
}

