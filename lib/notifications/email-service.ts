/**
 * Service d'envoi d'emails
 * Utilise Resend (recommandé) ou Nodemailer en fallback
 */

interface EmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

interface EmailTemplate {
  subject: string
  html: (data: Record<string, any>) => string
  text?: (data: Record<string, any>) => string
}

export const emailTemplates: Record<string, EmailTemplate> = {
  schedulePublished: {
    subject: "📅 Votre planning est disponible !",
    html: (data) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .shift-item { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Votre planning est prêt !</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.employeeName}</strong>,</p>
              <p>Votre planning pour la période du <strong>${data.startDate}</strong> au <strong>${data.endDate}</strong> est maintenant disponible.</p>
              
              <h3>Vos shifts :</h3>
              ${data.shifts.map((shift: any) => `
                <div class="shift-item">
                  <strong>${shift.date}</strong> - ${shift.startTime} à ${shift.endTime}<br>
                  <small>Rôle: ${shift.role} | Lieu: ${shift.location || 'Restaurant'}</small>
                </div>
              `).join('')}
              
              <p style="margin-top: 20px;">
                <a href="${data.viewUrl}" class="button">Voir mon planning complet</a>
              </p>
              
              <p><small>Vous recevez cet email car un planning vous concernant a été publié.</small></p>
            </div>
            <div class="footer">
              <p>ShiftPilot - Gestion de plannings intelligente</p>
              <p>Pour modifier vos préférences de notification, connectez-vous à votre compte.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: (data) => `
Bonjour ${data.employeeName},

Votre planning pour la période du ${data.startDate} au ${data.endDate} est maintenant disponible.

Vos shifts :
${data.shifts.map((shift: any) => `- ${shift.date}: ${shift.startTime} à ${shift.endTime} (${shift.role})`).join('\n')}

Voir votre planning: ${data.viewUrl}

ShiftPilot - Gestion de plannings intelligente
    `,
  },

  scheduleUpdated: {
    subject: "⚠️ Votre planning a été modifié",
    html: (data) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Planning modifié</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${data.employeeName}</strong>,</p>
              <div class="alert">
                <strong>Attention :</strong> Votre planning a été modifié. Veuillez consulter les nouveaux horaires.
              </div>
              <p>Planning: <strong>${data.scheduleName}</strong></p>
              <p>Période: ${data.startDate} au ${data.endDate}</p>
              <p><a href="${data.viewUrl}" style="color: #667eea;">Consulter les modifications</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  welcome: {
    subject: "Bienvenue sur ShiftPilot ! 🎉",
    html: (data) => `
      <!DOCTYPE html>
      <html>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1>Bienvenue ${data.name} !</h1>
            <p>Votre compte ShiftPilot a été créé avec succès.</p>
            <p>Vous recevrez vos plannings par email et/ou SMS selon vos préférences.</p>
          </div>
        </body>
      </html>
    `,
  },
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Utilise Resend si disponible (meilleure solution)
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY)

      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM || "ShiftPilot <noreply@shiftpilot.com>",
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      })

      return result.error === null
    }

    // Fallback: Nodemailer ou service email simple
    if (process.env.SMTP_HOST) {
      const nodemailer = await import("nodemailer")
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || "ShiftPilot <noreply@shiftpilot.com>",
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })

      return true
    }

    // Mode développement: log seulement
    if (process.env.NODE_ENV === "development") {
      console.log("📧 Email (DEV MODE):", {
        to: options.to,
        subject: options.subject,
      })
      return true
    }

    return false
  } catch (error) {
    console.error("Erreur envoi email:", error)
    return false
  }
}

export async function sendEmailTemplate(
  templateName: string,
  to: string | string[],
  data: Record<string, any>
): Promise<boolean> {
  const template = emailTemplates[templateName]
  if (!template) {
    console.error(`Template email "${templateName}" introuvable`)
    return false
  }

  return sendEmail({
    to,
    subject: template.subject,
    html: template.html(data),
    text: template.text?.(data),
  })
}

