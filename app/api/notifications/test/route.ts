import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { sendEmailTemplate } from "@/lib/notifications/email-service"
import { sendSMSTemplate } from "@/lib/notifications/sms-service"

/**
 * POST - Test d'envoi de notification (email/SMS)
 * Utile pour tester la configuration
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`notifications:test:${clientId}`, 5, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const body = await request.json()
    const { type, to, template } = body

    if (!type || !to || !template) {
      return createErrorResponse(
        new Error("Type, destinataire et template requis"),
        "Missing required fields"
      )
    }

    const testData = {
      employeeName: "Test User",
      scheduleName: "Planning de test",
      startDate: new Date().toLocaleDateString("fr-FR"),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
      viewUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      shifts: [
        {
          date: new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
          startTime: "09:00",
          endTime: "17:00",
          role: "Serveur",
        },
      ],
    }

    let success = false

    if (type === "email") {
      success = await sendEmailTemplate(template, to, testData)
    } else if (type === "sms") {
      success = await sendSMSTemplate(template, to, testData)
    } else {
      return createErrorResponse(new Error("Type doit être 'email' ou 'sms'"), "Invalid type")
    }

    if (success) {
      return createSuccessResponse({
        success: true,
        message: `${type === "email" ? "Email" : "SMS"} envoyé avec succès`,
      })
    } else {
      return createErrorResponse(
        new Error(`Échec de l'envoi ${type === "email" ? "email" : "SMS"}. Vérifiez la configuration.`),
        "Send failed"
      )
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de l'envoi de test")
  }
}

