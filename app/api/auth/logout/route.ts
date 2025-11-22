import { type NextRequest } from "next/server"
import { createSuccessResponse } from "@/lib/api-utils"
import { getSessionByToken, deleteSession } from "@/lib/sessions"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Get current token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    // Delete session from database
    if (token) {
      const session = await getSessionByToken(token)
      if (session) {
        await deleteSession(session.id)
      }
    }
  } catch (error) {
    console.error("Error deleting session:", error)
    // Continue even if session deletion fails
  }

  const response = createSuccessResponse({ success: true })

  // Clear auth cookie
  response.cookies.delete("auth-token")
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })

  return response
}
