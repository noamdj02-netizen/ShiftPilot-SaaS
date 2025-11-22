import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse } from "@/lib/api-utils"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return createErrorResponse(new Error("Non authentifié"), "Unauthorized")
    }

    return createSuccessResponse({
      user: session,
    })
  } catch (error) {
    return createErrorResponse(error, "Erreur lors de la récupération de la session")
  }
}

