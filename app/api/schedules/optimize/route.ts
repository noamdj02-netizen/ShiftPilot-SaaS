import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getScheduleById, getEmployees } from "@/lib/db"
import { readAvailabilities } from "@/app/api/availability/route"
import { z } from "zod"

const optimizeSchema = z.object({
  scheduleId: z.string(),
  constraints: z.object({
    minHoursPerEmployee: z.number().optional(),
    maxHoursPerEmployee: z.number().optional(),
    respectAvailabilities: z.boolean().default(true),
    balanceWorkload: z.boolean().default(true),
    minimizeCosts: z.boolean().default(true),
    preferredRoles: z.record(z.string(), z.array(z.string())).optional(),
  }).optional(),
})

interface OptimizationResult {
  optimized: boolean
  improvements: string[]
  costSavings?: number
  hoursOptimized?: number
  conflictsResolved?: number
  suggestions: string[]
}

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const body = await optimizeSchema.parseAsync(await request.json())
    const { scheduleId, constraints } = body

    const schedule = await getScheduleById(scheduleId)

    if (!schedule) {
      return createErrorResponse(new Error("Planning introuvable"), undefined, 404)
    }

    if (schedule.status === "published") {
      return createErrorResponse(
        new Error("Impossible d'optimiser un planning publié"),
        undefined,
        400
      )
    }

    const employees = await getEmployees()
    const availabilities = await readAvailabilities()

    // Analyse du planning actuel
    const shifts = schedule.shifts || []
    const employeeHours: Record<string, number> = {}
    const conflicts: string[] = []
    const suggestions: string[] = []

    // Calculer les heures par employé
    shifts.forEach((shift: any) => {
      const start = parseInt(shift.startTime?.split(":")[0] || "0")
      const end = parseInt(shift.endTime?.split(":")[0] || "0")
      const hours = Math.max(0, end - start)

      if (!employeeHours[shift.employeeId]) {
        employeeHours[shift.employeeId] = 0
      }
      employeeHours[shift.employeeId] += hours

      // Vérifier les disponibilités
      if (constraints?.respectAvailabilities) {
        const availability = availabilities.find(
          (a) => a.employeeId === shift.employeeId && a.date === shift.date
        )
        if (availability?.type === "unavailable") {
          conflicts.push(
            `Conflit: ${shift.employeeId} n'est pas disponible le ${shift.date}`
          )
        }
      }
    })

    // Analyser les déséquilibres
    const hoursArray = Object.values(employeeHours)
    const avgHours = hoursArray.reduce((a, b) => a + b, 0) / hoursArray.length || 0
    const maxHours = Math.max(...hoursArray, 0)
    const minHours = Math.min(...hoursArray, 0)

    if (constraints?.balanceWorkload && maxHours - minHours > 10) {
      suggestions.push(
        `Écart important détecté: ${maxHours}h vs ${minHours}h. Rééquilibrer les heures entre employés.`
      )
    }

    // Suggestions d'optimisation
    if (constraints?.minimizeCosts) {
      // Analyser les coûts par rôle (simplifié)
      const roleCosts: Record<string, number> = {
        Serveur: 12,
        Barman: 14,
        Cuisine: 15,
        Chef: 18,
        Manager: 20,
      }

      const currentCost = shifts.reduce((total: number, shift: any) => {
        const start = parseInt(shift.startTime?.split(":")[0] || "0")
        const end = parseInt(shift.endTime?.split(":")[0] || "0")
        const hours = Math.max(0, end - start)
        const roleCost = roleCosts[shift.role] || 12
        return total + hours * roleCost
      }, 0)

      suggestions.push(
        `Coût actuel estimé: ${currentCost.toFixed(2)}€. Utilisez des employés junior pour réduire les coûts.`
      )
    }

    // Détecter les sur-staffing
    const shiftsByDate: Record<string, number> = {}
    shifts.forEach((shift: any) => {
      if (!shiftsByDate[shift.date]) {
        shiftsByDate[shift.date] = 0
      }
      shiftsByDate[shift.date]++
    })

    Object.entries(shiftsByDate).forEach(([date, count]) => {
      if (count > employees.length * 0.5) {
        suggestions.push(`Sur-staffing détecté le ${date}: ${count} shifts pour ${employees.length} employés`)
      }
    })

    const result: OptimizationResult = {
      optimized: conflicts.length === 0 && suggestions.length === 0,
      improvements: suggestions,
      conflictsResolved: conflicts.length,
      suggestions,
    }

    return createSuccessResponse({
      success: true,
      result,
      conflicts,
      employeeHours,
      message: "Analyse d'optimisation terminée",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(new Error("Données invalides"), error.errors, 400)
    }
    return createErrorResponse(error)
  }
}

