import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { getEmployees, readData } from "@/lib/db"
import { cookies } from "next/headers"
import path from "path"
import fs from "fs/promises"

const SESSIONS_FILE = path.join(process.cwd(), "data", "employee_sessions.json")

async function getEmployeeSessions() {
  try {
    const data = await fs.readFile(SESSIONS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function getSessionByToken(token: string) {
  const sessions = await getEmployeeSessions()
  return sessions.find((s: any) => s.token === token && s.expiresAt > new Date().toISOString())
}

export async function GET(request: NextRequest) {
  try {
    await checkRateLimit(request)

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("employee_session")?.value

    if (!sessionToken) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    // Get session from sessions file
    const session = await getSessionByToken(sessionToken)

    if (!session) {
      return createErrorResponse(new Error("Session expirée"), undefined, 401)
    }

    // Get employee data
    const employees = await getEmployees()
    const employee = employees.find((e: any) => e.id === session.employeeId)

    if (!employee) {
      return createErrorResponse(new Error("Employé introuvable"), undefined, 404)
    }

    return createSuccessResponse({
      success: true,
      employee: {
        id: employee.id,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
        phone: employee.phone,
      },
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}
