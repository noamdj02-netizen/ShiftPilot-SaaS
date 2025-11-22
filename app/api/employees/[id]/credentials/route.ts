import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getEmployees, updateEmployee } from "@/lib/db"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { id } = await params
    const body = await credentialsSchema.parseAsync(await request.json())

    const employees = await getEmployees()
    const employee = employees.find((e: any) => e.id === id)

    if (!employee) {
      return createErrorResponse(new Error("Employé introuvable"), undefined, 404)
    }

    // Check if email is already used by another employee
    const emailExists = employees.find(
      (e: any) => e.email?.toLowerCase() === body.email.toLowerCase() && e.id !== id
    )

    if (emailExists) {
      return createErrorResponse(
        new Error("Cet email est déjà utilisé par un autre employé"),
        undefined,
        400
      )
    }

    // Update employee with credentials
    // In production, hash the password with bcrypt
    const updatedEmployee = await updateEmployee(id, {
      email: body.email,
      password: body.password, // In production: await bcrypt.hash(body.password, 10)
      hasCredentials: true,
      credentialsGeneratedAt: new Date().toISOString(),
    })

    return createSuccessResponse({
      success: true,
      employee: updatedEmployee,
      message: "Identifiants créés avec succès",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(new Error("Données invalides"), error.errors, 400)
    }
    return createErrorResponse(error)
  }
}

