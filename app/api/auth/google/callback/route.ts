import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils"
import { cookies } from "next/headers"
import { getUserByEmail, createUser } from "@/lib/db"
import { createSession } from "@/lib/sessions"

/**
 * Route OAuth Google - Callback
 * Reçoit le code d'autorisation de Google et crée la session
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    // Vérifier les erreurs
    if (error) {
      return Response.redirect(new URL(`/login?error=${encodeURIComponent("Connexion annulée")}`, request.url))
    }

    // Vérifier le state
    const cookieStore = await cookies()
    const storedState = cookieStore.get("oauth_state")?.value
    cookieStore.delete("oauth_state")

    if (!storedState || storedState !== state) {
      return Response.redirect(new URL("/login?error=" + encodeURIComponent("État invalide"), request.url))
    }

    let stateData: { redirect: string }
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString())
    } catch {
      stateData = { redirect: "/dashboard" }
    }

    const redirectUrl = stateData.redirect || "/dashboard"

    // Mode développement: simuler connexion
    if (code === "dev_mode" || process.env.NODE_ENV === "development") {
      // Créer ou récupérer un utilisateur de test
      const testEmail = "test@google.com"
      let user = await getUserByEmail(testEmail)

      if (!user) {
        user = await createUser({
          email: testEmail,
          password: "", // Pas de mot de passe pour OAuth
          companyName: "Test Company",
        })
      }

      // Créer la session
      const token = Buffer.from(`${testEmail}:${Date.now()}:${user.id}`).toString("base64")
      const ipAddress = request.headers.get("x-forwarded-for") || request.ip || undefined
      const userAgent = request.headers.get("user-agent") || undefined

      await createSession({
        userId: user.id,
        token,
        ipAddress,
        userAgent,
      })

      // Définir le cookie
      const response = Response.redirect(new URL(redirectUrl, request.url))
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })

      return response
    }

    // Production: échanger le code contre un token
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`

    if (!googleClientId || !googleClientSecret) {
      return Response.redirect(new URL("/login?error=" + encodeURIComponent("OAuth non configuré"), request.url))
    }

    // Échanger le code contre un access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code!,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenResponse.ok) {
      return Response.redirect(new URL("/login?error=" + encodeURIComponent("Échec de l'authentification"), request.url))
    }

    const tokens = await tokenResponse.json()
    const accessToken = tokens.access_token

    // Récupérer les infos utilisateur Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!userResponse.ok) {
      return Response.redirect(new URL("/login?error=" + encodeURIComponent("Impossible de récupérer les infos utilisateur"), request.url))
    }

    const googleUser = await userResponse.json()

    // Créer ou récupérer l'utilisateur dans notre DB
    let user = await getUserByEmail(googleUser.email)

    if (!user) {
      // Créer un nouvel utilisateur
      user = await createUser({
        email: googleUser.email,
        password: "", // Pas de mot de passe pour OAuth
        companyName: googleUser.name || "Nouvelle entreprise",
      })
    }

    // Créer la session
    const token = Buffer.from(`${googleUser.email}:${Date.now()}:${user.id}`).toString("base64")
    const ipAddress = request.headers.get("x-forwarded-for") || request.ip || undefined
    const userAgent = request.headers.get("user-agent") || undefined

    await createSession({
      userId: user.id,
      token,
      ipAddress,
      userAgent,
    })

    // Définir le cookie et rediriger
    const response = Response.redirect(new URL(redirectUrl, request.url))
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Erreur OAuth Google:", error)
    return Response.redirect(new URL("/login?error=" + encodeURIComponent("Erreur lors de la connexion"), request.url))
  }
}

