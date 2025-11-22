import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getEmployees } from "@/lib/db"
import { sendEmailTemplate } from "@/lib/notifications/email-service"
import { addEmailToHistory } from "./history/route"

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { employeeIds, subject, message, template, sendToAll } = await request.json()

    if (!subject || !message) {
      return createErrorResponse(new Error("Le sujet et le message sont requis"), undefined, 400)
    }

    let targetEmployees = []
    if (sendToAll) {
      const allEmployees = await getEmployees()
      targetEmployees = allEmployees.filter((emp: any) => emp.email)
    } else if (employeeIds && employeeIds.length > 0) {
      const allEmployees = await getEmployees()
      targetEmployees = allEmployees.filter((emp: any) => employeeIds.includes(emp.id) && emp.email)
    } else {
      return createErrorResponse(new Error("Aucun employé sélectionné"), undefined, 400)
    }

    if (targetEmployees.length === 0) {
      return createErrorResponse(new Error("Aucun employé avec email trouvé"), undefined, 400)
    }

    let successCount = 0
    let errorCount = 0
    const results = []

    for (const employee of targetEmployees) {
      try {
        const emailData = {
          subject,
          message,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          companyName: user.companyName || "Votre entreprise",
        }

        const success = await sendEmailTemplate("custom", employee.email, emailData)
        
        // Add to history
        addEmailToHistory({
          id: `${Date.now()}-${employee.id}`,
          employeeId: employee.id,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          employeeEmail: employee.email,
          subject,
          message,
          sentAt: new Date().toISOString(),
          status: success ? "sent" : "error",
        })
        
        if (success) {
          successCount++
          results.push({ employeeId: employee.id, email: employee.email, status: "sent" })
        } else {
          errorCount++
          results.push({ employeeId: employee.id, email: employee.email, status: "error" })
        }
      } catch (error) {
        console.error(`Erreur envoi email à ${employee.email}:`, error)
        errorCount++
        results.push({ employeeId: employee.id, email: employee.email, status: "error" })
      }
    }

    return createSuccessResponse({
      success: true,
      sent: successCount,
      errors: errorCount,
      total: targetEmployees.length,
      results,
      message: `${successCount} email(s) envoyé(s) avec succès`,
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

