import { type NextRequest } from "next/server"
import { loginSchema } from "@/lib/validations"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { getUserByEmail } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`login:${clientId}`, 5, 60000) // 5 requests per minute

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de tentatives de connexion. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const body = await request.json()

    // Validate input with Zod
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return createErrorResponse(validationResult.error)
    }

    const { email, password } = validationResult.data

    // Get user from database
    const user = await getUserByEmail(email)

    if (!user || password !== user.password) {
      return createErrorResponse(
        new Error("Email ou mot de passe incorrect"),
        "Invalid credentials"
      )
    }

    // Create session token (mock)
    // In production: use JWT or session management library
    const token = Buffer.from(`${email}:${Date.now()}:${user.id}`).toString("base64")

    // Create session in database
    const { createSession } = await import("@/lib/sessions")
    const ipAddress = request.headers.get("x-forwarded-for") || request.ip || undefined
    const userAgent = request.headers.get("user-agent") || undefined

    await createSession({
      userId: user.id,
      token,
      ipAddress,
      userAgent,
    })

    // Set cookie
    const response = createSuccessResponse({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    return createErrorResponse(error, "Erreur lors de la connexion")
  }
}
