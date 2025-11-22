import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getEmployees, getSchedules } from "@/lib/db"

// Force dynamic rendering for this route (uses cookies)
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`analytics:${clientId}`, 30, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const employees = await getEmployees()
    const schedules = await getSchedules()

    // Calculate stats
    const activeEmployees = employees.length
    const totalShifts = schedules.reduce((acc, schedule) => acc + (schedule.shifts?.length || 0), 0)
    
    // Calculate total hours (mock for now - would need actual shift calculations)
    const totalHours = schedules.reduce((acc, schedule) => {
      const scheduleHours = schedule.shifts?.reduce((shiftsAcc: number, shift: any) => {
        // Mock calculation: assume 8 hours per shift
        return shiftsAcc + 8
      }, 0) || 0
      return acc + scheduleHours
    }, 0)

    // Calculate total costs (mock for now)
    const totalCosts = employees.reduce((acc, emp) => {
      const weeklyHours = emp.weeklyHours || 0
      const hourlyRate = emp.hourlyRate || 0
      return acc + (weeklyHours * hourlyRate * 4) // 4 weeks per month
    }, 0)

    // Generate chart data
    const hoursByEmployee = employees.slice(0, 10).map((emp) => ({
      name: `${emp.firstName} ${emp.lastName}`.slice(0, 15),
      hours: Math.floor(Math.random() * 40) + 20, // Mock data
    }))

    const costsByWeek = Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - (7 * (7 - i)))
      return {
        week: `Sem ${i + 1}`,
        costs: Math.floor(totalCosts * 0.8 + Math.random() * totalCosts * 0.4),
      }
    })

    const roleDistribution = employees.reduce((acc: Record<string, number>, emp) => {
      acc[emp.role] = (acc[emp.role] || 0) + 1
      return acc
    }, {})

    const roleData = Object.entries(roleDistribution).map(([name, value]) => ({
      name,
      value,
    }))

    const occupationByDay = [
      { day: "Lun", occupancy: 85 },
      { day: "Mar", occupancy: 78 },
      { day: "Mer", occupancy: 82 },
      { day: "Jeu", occupancy: 90 },
      { day: "Ven", occupancy: 95 },
      { day: "Sam", occupancy: 98 },
      { day: "Dim", occupancy: 92 },
    ]

    return createSuccessResponse({
      stats: {
        activeEmployees,
        totalHours,
        totalCosts: Math.floor(totalCosts),
        totalShifts,
      },
      charts: {
        hoursByEmployee,
        costsByWeek,
        roleDistribution: roleData,
        occupationByDay,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la récupération des statistiques")
  }
}

