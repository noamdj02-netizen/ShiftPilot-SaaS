import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getEmployeeById, updateEmployee, getEmployees } from "@/lib/db"

/**
 * GET - Récupère les préférences de notification d'un employé
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params

    const employee = await getEmployeeById(id)

    if (!employee) {
      return createErrorResponse(new Error("Employé non trouvé"), "Employee not found")
    }

    const preferences = {
      email: !!employee.email,
      sms: !!employee.phone,
      emailEnabled: employee.notificationPreferences?.emailEnabled ?? true,
      smsEnabled: employee.notificationPreferences?.smsEnabled ?? true,
    }

    return createSuccessResponse({ preferences })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la récupération des préférences")
  }
}

/**
 * PUT - Met à jour les préférences de notification d'un employé
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const body = await request.json()

    const employee = await getEmployeeById(id)

    if (!employee) {
      return createErrorResponse(new Error("Employé non trouvé"), "Employee not found")
    }

    const updates: any = {}

    if (typeof body.emailEnabled === "boolean") {
      if (!updates.notificationPreferences) {
        updates.notificationPreferences = employee.notificationPreferences || {}
      }
      updates.notificationPreferences.emailEnabled = body.emailEnabled
    }

    if (typeof body.smsEnabled === "boolean") {
      if (!updates.notificationPreferences) {
        updates.notificationPreferences = employee.notificationPreferences || {}
      }
      updates.notificationPreferences.smsEnabled = body.smsEnabled
    }

    const updatedEmployee = await updateEmployee(id, updates)

    return createSuccessResponse({
      success: true,
      employee: updatedEmployee,
      message: "Préférences de notification mises à jour",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la mise à jour des préférences")
  }
}

