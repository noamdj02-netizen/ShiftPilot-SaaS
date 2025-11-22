import { type NextRequest } from "next/server"
import { cookies } from "next/headers"
import { getUserByEmail, createUser } from "@/lib/db"
import { createSession } from "@/lib/sessions"

/**
 * Route OAuth Apple - Callback
 * Apple utilise POST au lieu de GET pour le callback
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const code = formData.get("code")?.toString()
    const state = formData.get("state")?.toString()
    const error = formData.get("error")?.toString()

    if (error) {
      return Response.redirect(new URL(`/login?error=${encodeURIComponent("Connexion annulée")}`, request.url))
    }

    // Vérifier le state
    const cookieStore = await cookies()
    const storedState = cookieStore.get("oauth_state_apple")?.value
    cookieStore.delete("oauth_state_apple")

    if (!storedState || storedState !== state) {
      return Response.redirect(new URL("/login?error=" + encodeURIComponent("État invalide"), request.url))
    }

    let stateData: { redirect: string }
    try {
      stateData = JSON.parse(Buffer.from(state!, "base64").toString())
    } catch {
      stateData = { redirect: "/dashboard" }
    }

    const redirectUrl = stateData.redirect || "/dashboard"

    // Mode développement
    if (code === "dev_mode" || process.env.NODE_ENV === "development") {
      const testEmail = "test@apple.com"
      let user = await getUserByEmail(testEmail)

      if (!user) {
        user = await createUser({
          email: testEmail,
          password: "",
          companyName: "Test Company",
        })
      }

      const token = Buffer.from(`${testEmail}:${Date.now()}:${user.id}`).toString("base64")
      const ipAddress = request.headers.get("x-forwarded-for") || request.ip || undefined
      const userAgent = request.headers.get("user-agent") || undefined

      await createSession({ userId: user.id, token, ipAddress, userAgent })

      const response = Response.redirect(new URL(redirectUrl, request.url))
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })

      return response
    }

    // Production: implémentation Apple Sign In complète nécessiterait JWT verification
    // Pour l'instant, mode dev seulement
    return Response.redirect(new URL("/login?error=" + encodeURIComponent("Apple Sign In en cours de développement"), request.url))
  } catch (error) {
    console.error("Erreur OAuth Apple:", error)
    return Response.redirect(new URL("/login?error=" + encodeURIComponent("Erreur lors de la connexion"), request.url))
  }
}

// Apple peut aussi utiliser GET pour le redirect initial
export async function GET(request: NextRequest) {
  return POST(request)
}

