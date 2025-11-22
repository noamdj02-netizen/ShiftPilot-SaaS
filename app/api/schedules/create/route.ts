import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { createSchedule } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { z } from "zod"

const createScheduleSchema = z.object({
  name: z.string().min(1, "Le nom du planning est requis"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  shifts: z.array(
    z.object({
      employeeId: z.string(),
      date: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      role: z.string(),
      service: z.enum(["Midi", "Soir"]).optional(),
    })
  ),
})

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`schedules:create:${clientId}`, 10, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const body = await request.json()
    const validationResult = createScheduleSchema.safeParse(body)

    if (!validationResult.success) {
      return createErrorResponse(validationResult.error)
    }

    const data = validationResult.data

    // Validate date range
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)

    if (startDate >= endDate) {
      return createErrorResponse(
        new Error("La date de fin doit être postérieure à la date de début"),
        "Invalid date range"
      )
    }

    // Create schedule with shifts
    const newSchedule = await createSchedule({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "draft",
      shifts: data.shifts,
    })

    return createSuccessResponse({
      success: true,
      scheduleId: newSchedule.id,
      schedule: newSchedule,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la création du planning")
  }
}

