import { type NextRequest } from "next/server"
import { signupSchema } from "@/lib/validations"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { getUserByEmail, createUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`signup:${clientId}`, 3, 60000) // 3 requests per minute

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de tentatives d'inscription. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const body = await request.json()

    // Validate input with Zod
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      return createErrorResponse(validationResult.error)
    }

    const { companyName, email, password } = validationResult.data

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return createErrorResponse(
        new Error("Un compte avec cet email existe déjà"),
        "User already exists"
      )
    }

    // Create user in database
    // In production: hash password with bcrypt before storing
    const newUser = await createUser({
      email,
      companyName,
      password, // In production: hash this with bcrypt.hash(password, 10)
    })

    // Create session token (mock)
    // In production: use JWT or session management library
    const token = Buffer.from(`${email}:${Date.now()}:${newUser.id}`).toString("base64")

    // Set cookie
    const response = createSuccessResponse({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        companyName: newUser.companyName,
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
    return createErrorResponse(error, "Erreur lors de la création du compte")
  }
}
