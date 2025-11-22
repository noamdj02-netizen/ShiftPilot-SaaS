import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { getEmployees } from "@/lib/db"
import { z } from "zod"
import { cookies } from "next/headers"
import path from "path"
import fs from "fs/promises"

const SESSIONS_FILE = path.join(process.cwd(), "data", "employee_sessions.json")

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch {
    // Directory already exists
  }
}

async function saveSession(session: any) {
  await ensureDataDir()
  let sessions = []
  try {
    const data = await fs.readFile(SESSIONS_FILE, "utf-8")
    sessions = JSON.parse(data)
  } catch {
    sessions = []
  }

  sessions.push(session)
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2))
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)

    const body = await loginSchema.parseAsync(await request.json())
    const { email, password } = body

    const employees = await getEmployees()
    const employee = employees.find(
      (e: any) => e.email?.toLowerCase() === email.toLowerCase()
    )

    if (!employee) {
      return createErrorResponse(new Error("Email ou mot de passe incorrect"), undefined, 401)
    }

    // In production, use bcrypt to compare hashed passwords
    // For now, simple check (employees should have a password set by admin)
    if (!employee.password) {
      return createErrorResponse(
        new Error("Aucun mot de passe défini. Contactez votre administrateur pour obtenir vos identifiants."),
        undefined,
        401
      )
    }

    if (employee.password !== password) {
      return createErrorResponse(new Error("Email ou mot de passe incorrect"), undefined, 401)
    }

    // Create employee session
    const cookieStore = await cookies()
    const sessionToken = `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    cookieStore.set("employee_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    // Store session info in file
    const sessionData = {
      token: sessionToken,
      employeeId: employee.id,
      email: employee.email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      role: employee.role,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    }

    await saveSession(sessionData)

    return createSuccessResponse({
      success: true,
      employee: {
        id: employee.id,
        email: employee.email,
        firstName: employee.firstName,
        lastName: employee.lastName,
        role: employee.role,
      },
      session: sessionData,
      message: "Connexion réussie",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(new Error("Données invalides"), error.errors, 400)
    }
    return createErrorResponse(error)
  }
}

