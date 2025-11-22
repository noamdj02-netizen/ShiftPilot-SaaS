import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { getEmployeeById, updateEmployee, deleteEmployee } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { employeeSchema } from "@/lib/validations"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params

    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`employees:get:${clientId}`, 30, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const employee = await getEmployeeById(id)

    if (!employee) {
      return createErrorResponse(new Error("Employé non trouvé"), "Employee not found")
    }

    return createSuccessResponse({
      employee,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la récupération de l'employé")
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params
    const body = await request.json()

    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`employees:put:${clientId}`, 10, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    // Validate input with Zod
    const validationResult = employeeSchema.partial().safeParse(body)
    if (!validationResult.success) {
      return createErrorResponse(validationResult.error)
    }

    const data = validationResult.data

    const employee = await getEmployeeById(id)

    if (!employee) {
      return createErrorResponse(new Error("Employé non trouvé"), "Employee not found")
    }

    // Update employee
    const updatedEmployee = await updateEmployee(id, data)

    return createSuccessResponse({
      success: true,
      employee: updatedEmployee,
      message: "Employé modifié avec succès",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la modification de l'employé")
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()

    const { id } = await params

    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`employees:delete:${clientId}`, 5, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const employee = await getEmployeeById(id)

    if (!employee) {
      return createErrorResponse(new Error("Employé non trouvé"), "Employee not found")
    }

    // Delete employee
    await deleteEmployee(id)

    return createSuccessResponse({
      success: true,
      message: "Employé supprimé avec succès",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la suppression de l'employé")
  }
}

