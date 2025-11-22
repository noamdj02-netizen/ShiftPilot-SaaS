import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { subscription, userId } = await request.json()

    // In production, store subscription in database
    // For now, return success
    return createSuccessResponse({
      message: "Abonnement aux notifications activé",
      subscribed: true,
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

