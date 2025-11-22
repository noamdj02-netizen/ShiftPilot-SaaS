import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { deleteTemplate } from "@/lib/templates"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { id } = await params
    const success = await deleteTemplate(id, user.id)

    if (!success) {
      return createErrorResponse(new Error("Template introuvable"), undefined, 404)
    }

    return createSuccessResponse({ message: "Template supprimé avec succès" })
  } catch (error) {
    return createErrorResponse(error)
  }
}

