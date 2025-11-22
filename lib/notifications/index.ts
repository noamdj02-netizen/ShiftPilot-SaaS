/**
 * Service de notifications unifié
 * Gère l'envoi d'emails et SMS selon les préférences de l'employé
 */

import { sendEmailTemplate } from "./email-service"
import { sendSMSTemplate } from "./sms-service"
import { getEmployees } from "@/lib/db"

interface NotificationPreferences {
  email?: boolean
  sms?: boolean
  phone?: string
}

interface NotificationData {
  templateName: string
  employeeIds?: string[]
  data: Record<string, any>
}

/**
 * Envoie des notifications (email/SMS) à des employés spécifiques
 */
export async function sendNotificationsToEmployees(
  employeeIds: string[],
  templateName: "schedulePublished" | "scheduleUpdated" | "welcome",
  data: Record<string, any>
): Promise<{ email: number; sms: number; errors: number }> {
  const employees = await getEmployees()
  const targetEmployees = employees.filter((emp) => employeeIds.includes(emp.id))

  let emailCount = 0
  let smsCount = 0
  let errorCount = 0

  for (const employee of targetEmployees) {
    const preferences: NotificationPreferences = {
      email: employee.email ? true : false,
      sms: employee.phone ? true : false,
      phone: employee.phone,
    }

    // Envoi email
    if (preferences.email && employee.email) {
      try {
        const success = await sendEmailTemplate(templateName, employee.email, {
          ...data,
          employeeName: `${employee.firstName} ${employee.lastName}`,
        })
        if (success) emailCount++
        else errorCount++
      } catch (error) {
        console.error(`Erreur email pour ${employee.email}:`, error)
        errorCount++
      }
    }

    // Envoi SMS
    if (preferences.sms && employee.phone) {
      try {
        const success = await sendSMSTemplate(templateName, employee.phone, {
          ...data,
          employeeName: `${employee.firstName} ${employee.lastName}`,
        })
        if (success) smsCount++
        else errorCount++
      } catch (error) {
        console.error(`Erreur SMS pour ${employee.phone}:`, error)
        errorCount++
      }
    }
  }

  return { email: emailCount, sms: smsCount, errors: errorCount }
}

/**
 * Envoie des notifications à tous les employés concernés par un planning
 */
export async function notifySchedulePublished(
  scheduleId: string,
  scheduleName: string,
  startDate: string,
  endDate: string,
  shifts: Array<{
    employeeId: string
    date: string
    startTime: string
    endTime: string
    role: string
  }>
): Promise<{ email: number; sms: number; errors: number }> {
  const employees = await getEmployees()
  const employeesWithShifts = new Set(shifts.map((s) => s.employeeId))

  // Grouper les shifts par employé
  const shiftsByEmployee: Record<string, typeof shifts> = {}
  shifts.forEach((shift) => {
    if (!shiftsByEmployee[shift.employeeId]) {
      shiftsByEmployee[shift.employeeId] = []
    }
    shiftsByEmployee[shift.employeeId].push(shift)
  })

  let emailCount = 0
  let smsCount = 0
  let errorCount = 0

  for (const employee of employees) {
    if (!employeesWithShifts.has(employee.id)) continue

    const employeeShifts = shiftsByEmployee[employee.id] || []

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const viewUrl = `${baseUrl}/dashboard/schedules/${scheduleId}`

    const notificationData = {
      scheduleName,
      startDate,
      endDate,
      viewUrl,
      shifts: employeeShifts.map((s) => ({
        date: new Date(s.date).toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
        startTime: s.startTime,
        endTime: s.endTime,
        role: s.role,
      })),
    }

    // Vérifier les préférences de notification
    const emailEnabled = employee.notificationPreferences?.emailEnabled !== false // true par défaut
    const smsEnabled = employee.notificationPreferences?.smsEnabled !== false // true par défaut

    // Email
    if (employee.email && emailEnabled) {
      try {
        const success = await sendEmailTemplate("schedulePublished", employee.email, {
          ...notificationData,
          employeeName: `${employee.firstName} ${employee.lastName}`,
        })
        if (success) emailCount++
        else errorCount++
      } catch (error) {
        console.error(`Erreur email pour ${employee.email}:`, error)
        errorCount++
      }
    }

    // SMS
    if (employee.phone && smsEnabled) {
      try {
        const success = await sendSMSTemplate("schedulePublished", employee.phone, {
          ...notificationData,
          employeeName: `${employee.firstName} ${employee.lastName}`,
        })
        if (success) smsCount++
        else errorCount++
      } catch (error) {
        console.error(`Erreur SMS pour ${employee.phone}:`, error)
        errorCount++
      }
    }
  }

  return { email: emailCount, sms: smsCount, errors: errorCount }
}

