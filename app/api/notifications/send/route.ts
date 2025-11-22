import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { showNotification } from "@/lib/push-notifications"

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { title, body, icon, tag } = await request.json()

    // In production, send push notification via service worker
    // For now, return success
    return createSuccessResponse({
      message: "Notification envoyée",
      sent: true,
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

