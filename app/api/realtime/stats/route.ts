import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getEmployees, getSchedules } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const employees = await getEmployees()
    const schedules = await getSchedules()

    // Calculer les statistiques en temps réel
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(today)
    thisWeek.setDate(today.getDate() - today.getDay())

    // Employés actifs aujourd'hui
    const activeEmployeesToday = employees.filter((emp: any) => {
      // Vérifier si l'employé a un shift aujourd'hui
      return schedules.some((sched: any) => {
        if (!sched.shifts) return false
        return sched.shifts.some((shift: any) => {
          const shiftDate = new Date(shift.date)
          return (
            shiftDate.toDateString() === today.toDateString() &&
            shift.employeeId === emp.id
          )
        })
      })
    }).length

    // Shifts aujourd'hui
    const shiftsToday = schedules.reduce((total: number, sched: any) => {
      if (!sched.shifts) return total
      return (
        total +
        sched.shifts.filter((shift: any) => {
          const shiftDate = new Date(shift.date)
          return shiftDate.toDateString() === today.toDateString()
        }).length
      )
    }, 0)

    // Heures travaillées aujourd'hui
    const hoursToday = schedules.reduce((total: number, sched: any) => {
      if (!sched.shifts) return total
      return (
        total +
        sched.shifts
          .filter((shift: any) => {
            const shiftDate = new Date(shift.date)
            return shiftDate.toDateString() === today.toDateString()
          })
          .reduce((shiftTotal: number, shift: any) => {
            const start = parseInt(shift.startTime?.split(":")[0] || "0")
            const end = parseInt(shift.endTime?.split(":")[0] || "0")
            return shiftTotal + Math.max(0, end - start)
          }, 0)
      )
    }, 0)

    // Plannings publiés cette semaine
    const publishedThisWeek = schedules.filter((sched: any) => {
      if (sched.status !== "published") return false
      const publishedDate = new Date(sched.publishedAt || sched.updatedAt)
      return publishedDate >= thisWeek
    }).length

    return createSuccessResponse({
      stats: {
        activeEmployeesToday,
        shiftsToday,
        hoursToday,
        publishedThisWeek,
        totalEmployees: employees.length,
        totalSchedules: schedules.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

