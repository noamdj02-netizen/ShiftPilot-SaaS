/**
 * Service d'envoi de SMS
 * Utilise Twilio (recommandé) ou API SMS en fallback
 */

interface SMSOptions {
  to: string
  message: string
}

interface SMSTemplate {
  message: (data: Record<string, any>) => string
}

export const smsTemplates: Record<string, SMSTemplate> = {
  schedulePublished: {
    message: (data) => {
      const shiftsCount = data.shifts?.length || 0
      return `📅 Votre planning ShiftPilot est disponible !\n` +
        `Période: ${data.startDate} au ${data.endDate}\n` +
        `${shiftsCount} shift${shiftsCount > 1 ? 's' : ''} planifié${shiftsCount > 1 ? 's' : ''}.\n` +
        `Consultez: ${data.viewUrl?.replace('https://', '') || 'votre compte'}`
    },
  },

  scheduleUpdated: {
    message: (data) => 
      `⚠️ ShiftPilot: Votre planning a été modifié.\n` +
      `Planning: ${data.scheduleName}\n` +
      `Consultez les modifications: ${data.viewUrl?.replace('https://', '') || 'votre compte'}`
  },

  welcome: {
    message: (data) => 
      `🎉 Bienvenue sur ShiftPilot ${data.name} !\n` +
      `Vous recevrez vos plannings par SMS.`
  },
}

export async function sendSMS(options: SMSOptions): Promise<boolean> {
  try {
    // Utilise Twilio si disponible (meilleure solution)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      const twilio = await import("twilio")
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

      await client.messages.create({
        body: options.message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: options.to,
      })

      return true
    }

    // Fallback: API SMS alternative (ex: SMS API, etc.)
    if (process.env.SMS_API_KEY && process.env.SMS_API_URL) {
      const response = await fetch(process.env.SMS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SMS_API_KEY}`,
        },
        body: JSON.stringify({
          to: options.to,
          message: options.message,
        }),
      })

      return response.ok
    }

    // Mode développement: log seulement
    if (process.env.NODE_ENV === "development") {
      console.log("📱 SMS (DEV MODE):", {
        to: options.to,
        message: options.message,
      })
      return true
    }

    return false
  } catch (error) {
    console.error("Erreur envoi SMS:", error)
    return false
  }
}

export async function sendSMSTemplate(
  templateName: string,
  to: string,
  data: Record<string, any>
): Promise<boolean> {
  const template = smsTemplates[templateName]
  if (!template) {
    console.error(`Template SMS "${templateName}" introuvable`)
    return false
  }

  return sendSMS({
    to,
    message: template.message(data),
  })
}

