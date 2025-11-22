import { type NextRequest } from "next/server"
import { employeeSchema } from "@/lib/validations"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { getEmployees, createEmployee, getEmployeeById } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth()

    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`employees:get:${clientId}`, 30, 60000) // 30 requests per minute

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    // Fetch from database
    const employees = await getEmployees()

    return createSuccessResponse({
      employees,
      total: employees.length,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la récupération des employés")
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth()

    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`employees:post:${clientId}`, 10, 60000) // 10 requests per minute

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const body = await request.json()

    // Validate input with Zod
    const validationResult = employeeSchema.safeParse(body)
    if (!validationResult.success) {
      return createErrorResponse(validationResult.error)
    }

    const data = validationResult.data

    // Check if employee with same email already exists (if email provided)
    if (data.email) {
      const employees = await getEmployees()
      const existingEmployee = employees.find((e) => e.email === data.email)
      if (existingEmployee) {
        return createErrorResponse(
          new Error("Un employé avec cet email existe déjà"),
          "Employee already exists"
        )
      }
    }

    // Create new employee in database
    const newEmployee = await createEmployee({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      hourlyRate: data.hourlyRate,
      maxHoursPerWeek: data.maxHoursPerWeek,
      availability: data.availability,
    })

    return createSuccessResponse({
      success: true,
      employee: newEmployee,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de l'ajout de l'employé")
  }
}
