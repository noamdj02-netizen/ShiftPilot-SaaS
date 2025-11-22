import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    // In production, implement Google OAuth flow
    // For now, return a mock URL
    const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/calendar/google/callback`
    const clientId = process.env.GOOGLE_CLIENT_ID || ""
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent`

    return createSuccessResponse({ authUrl, connected: false })
  } catch (error) {
    return createErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { code } = await request.json()

    // In production, exchange code for tokens and store them
    // For now, return success
    return createSuccessResponse({ connected: true, message: "Google Calendar connecté avec succès" })
  } catch (error) {
    return createErrorResponse(error)
  }
}

