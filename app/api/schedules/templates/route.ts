import { type NextRequest, NextResponse } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { getSession } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { getTemplates, createTemplate } from "@/lib/templates"
import { z } from "zod"

const templateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  shifts: z.array(
    z.object({
      employeeId: z.string(),
      role: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      date: z.string(),
    })
  ),
})

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const templates = await getTemplates(user.id)

    return createSuccessResponse({ templates })
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

    const body = await request.json()
    const validated = templateSchema.parse(body)

    const template = await createTemplate({
      ...validated,
      userId: user.id,
    })

    return createSuccessResponse({ template }, 201)
  } catch (error) {
    return createErrorResponse(error)
  }
}

