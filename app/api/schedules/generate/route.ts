import { type NextRequest } from "next/server"
import { scheduleGenerateSchema } from "@/lib/validations"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { createSchedule, updateSchedule, getSchedules } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth()

    // Rate limiting - schedule generation is resource-intensive
    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`schedules:generate:${clientId}`, 5, 60000) // 5 requests per minute

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de générations en cours. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const body = await request.json()

    // Validate input with Zod
    const validationResult = scheduleGenerateSchema.safeParse(body)
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

    if (endDate.getTime() - startDate.getTime() > 90 * 24 * 60 * 60 * 1000) {
      return createErrorResponse(
        new Error("La période ne peut pas dépasser 90 jours"),
        "Date range too large"
      )
    }

    // Validate hours constraints
    if (
      data.minHoursPerEmployee &&
      data.maxHoursPerEmployee &&
      data.minHoursPerEmployee > data.maxHoursPerEmployee
    ) {
      return createErrorResponse(
        new Error("Le nombre d'heures minimum ne peut pas être supérieur au maximum"),
        "Invalid hours constraint"
      )
    }

    // Create schedule with "generating" status in database
    const newSchedule = await createSchedule({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "generating",
      minHoursPerEmployee: data.minHoursPerEmployee,
      maxHoursPerEmployee: data.maxHoursPerEmployee,
      constraints: data.constraints,
      respectPreferences: data.respectPreferences,
      balanceWorkload: data.balanceWorkload,
      minimizeCosts: data.minimizeCosts,
    })

    // Simulate AI generation (in production, this would be async with a queue)
    // Update status to completed after generation
    setTimeout(async () => {
      try {
        await updateSchedule(newSchedule.id, {
          status: "completed",
          shifts: [], // In production: generate actual shifts
        })
      } catch (error) {
        console.error("Error updating schedule:", error)
      }
    }, 2000)

    return createSuccessResponse({
      success: true,
      scheduleId: newSchedule.id,
      schedule: newSchedule,
      message: "Génération du planning en cours...",
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la génération du planning")
  }
}
