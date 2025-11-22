import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"

const sendNotificationSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  icon: z.string().url().optional(),
  badge: z.string().url().optional(),
  image: z.string().url().optional(),
  url: z.string().url().optional(),
  tag: z.string().optional(),
  requireInteraction: z.boolean().optional(),
  vibrate: z.array(z.number()).optional(),
  actions: z
    .array(
      z.object({
        action: z.string(),
        title: z.string(),
        icon: z.string().url().optional(),
      })
    )
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const body = await sendNotificationSchema.parseAsync(await request.json())

    // En production, récupérer les subscriptions depuis la base de données
    // et envoyer via Web Push API avec VAPID keys
    // Pour l'instant, on simule juste l'envoi

    console.log("[Push] Sending notification:", {
      title: body.title,
      body: body.body,
      userId: user.id,
    })

    // Exemple d'envoi réel (nécessite web-push library et VAPID keys):
    /*
    const webpush = require('web-push')
    
    // Configuration VAPID (à mettre dans .env)
    webpush.setVapidDetails(
      'mailto:contact@shiftpilot.com',
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    )

    // Récupérer les subscriptions de l'utilisateur
    const subscriptions = await getPushSubscriptions(user.id)
    
    // Envoyer à toutes les subscriptions
    const promises = subscriptions.map(sub => 
      webpush.sendNotification(
        sub,
        JSON.stringify({
          title: body.title,
          body: body.body,
          icon: body.icon,
          badge: body.badge,
          image: body.image,
          data: {
            url: body.url || '/dashboard',
          },
          tag: body.tag,
          requireInteraction: body.requireInteraction,
          vibrate: body.vibrate,
          actions: body.actions,
        })
      )
    )
    
    await Promise.all(promises)
    */

    return createSuccessResponse({
      success: true,
      message: "Notification envoyée",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(new Error("Données invalides"), error.errors, 400)
    }
    return createErrorResponse(error)
  }
}

