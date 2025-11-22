import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { cookies } from "next/headers"

/**
 * Route OAuth Google - Initiation
 * Redirige vers Google OAuth
 */
export async function GET(request: NextRequest) {
  try {
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`oauth:google:${clientId}`, 10, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    // Configuration Google OAuth
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`
    const scopes = "openid email profile"

    if (!googleClientId) {
      // Mode développement: simuler OAuth
      if (process.env.NODE_ENV === "development") {
        const searchParams = request.nextUrl.searchParams
        const callbackUrl = searchParams.get("callback") || "/dashboard"
        
        return Response.redirect(
          new URL(`/api/auth/google/callback?code=dev_mode&state=${encodeURIComponent(callbackUrl)}`, request.url)
        )
      }
      
      return createErrorResponse(
        new Error("Google OAuth non configuré. Contactez l'administrateur."),
        "OAuth not configured"
      )
    }

    // Générer un state pour la sécurité
    const state = Buffer.from(JSON.stringify({
      redirect: request.nextUrl.searchParams.get("redirect") || "/dashboard",
      timestamp: Date.now(),
    })).toString("base64")

    // Stocker le state dans un cookie sécurisé
    const cookieStore = await cookies()
    cookieStore.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    })

    // URL Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(googleClientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=${encodeURIComponent(state)}&` +
      `access_type=offline&` +
      `prompt=consent`

    return Response.redirect(googleAuthUrl)
  } catch (error) {
    return createErrorResponse(error, "Erreur lors de l'initialisation de la connexion Google")
  }
}

