import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getUserSessions, deleteSession, deleteUserSessions } from "@/lib/sessions"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()

    const userSessions = await getUserSessions(session.id)

    // Get current session token
    const cookieStore = await cookies()
    const currentToken = cookieStore.get("auth-token")?.value

    // Format sessions for display
    const formattedSessions = userSessions.map((s) => ({
      id: s.id,
      ipAddress: s.ipAddress || "Inconnu",
      userAgent: s.userAgent || "Inconnu",
      createdAt: s.createdAt,
      lastActiveAt: s.lastActiveAt,
      isCurrent: s.token === currentToken,
    }))

    return createSuccessResponse({
      sessions: formattedSessions,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la récupération des sessions")
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth()

    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`sessions:delete:${clientId}`, 10, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const body = await request.json()
    const { sessionId, allSessions } = body

    if (allSessions) {
      const session = await requireAuth()
      const cookieStore = await cookies()
      const currentToken = cookieStore.get("auth-token")?.value
      await deleteUserSessions(session.id, currentToken) // Keep current session
      return createSuccessResponse({
        success: true,
        message: "Toutes les sessions ont été supprimées (sauf la session actuelle)",
      })
    } else if (sessionId) {
      await deleteSession(sessionId)
      return createSuccessResponse({
        success: true,
        message: "Session supprimée avec succès",
      })
    } else {
      return createErrorResponse(new Error("sessionId requis"), "Missing sessionId")
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la suppression de la session")
  }
}

