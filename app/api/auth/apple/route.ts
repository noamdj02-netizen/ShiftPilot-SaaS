import { type NextRequest } from "next/server"
import { createErrorResponse, checkRateLimit } from "@/lib/api-utils"
import { cookies } from "next/headers"

/**
 * Route OAuth Apple - Initiation
 * Redirige vers Apple OAuth
 */
export async function GET(request: NextRequest) {
  try {
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`oauth:apple:${clientId}`, 10, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    // Configuration Apple OAuth
    const appleClientId = process.env.APPLE_CLIENT_ID
    const redirectUri = process.env.APPLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/apple/callback`

    if (!appleClientId) {
      // Mode développement: simuler OAuth
      if (process.env.NODE_ENV === "development") {
        const callbackUrl = request.nextUrl.searchParams.get("callback") || "/dashboard"
        return Response.redirect(
          new URL(`/api/auth/apple/callback?code=dev_mode&state=${encodeURIComponent(callbackUrl)}`, request.url)
        )
      }

      return createErrorResponse(
        new Error("Apple OAuth non configuré. Contactez l'administrateur."),
        "OAuth not configured"
      )
    }

    // Générer un state
    const state = Buffer.from(JSON.stringify({
      redirect: request.nextUrl.searchParams.get("redirect") || "/dashboard",
      timestamp: Date.now(),
    })).toString("base64")

    // Stocker le state
    const cookieStore = await cookies()
    cookieStore.set("oauth_state_apple", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    })

    // URL Apple OAuth
    const appleAuthUrl = `https://appleid.apple.com/auth/authorize?` +
      `client_id=${encodeURIComponent(appleClientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `response_mode=form_post&` +
      `scope=email name&` +
      `state=${encodeURIComponent(state)}`

    return Response.redirect(appleAuthUrl)
  } catch (error) {
    return createErrorResponse(error, "Erreur lors de l'initialisation de la connexion Apple")
  }
}

