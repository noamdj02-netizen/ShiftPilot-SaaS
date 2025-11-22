import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getSchedules, getEmployees } from "@/lib/db"
import { format } from "date-fns"

interface PayrollEntry {
  employeeId: string
  employeeName: string
  date: string
  startTime: string
  endTime: string
  hours: number
  role: string
  hourlyRate: number
  total: number
}

export async function GET(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    if (!user) {
      return createErrorResponse(new Error("Non authentifié"), undefined, 401)
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate") || format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd")
    const endDate = searchParams.get("endDate") || format(new Date(), "yyyy-MM-dd")

    const schedules = await getSchedules()
    const employees = await getEmployees()

    // Role-based hourly rates (in production, get from employee settings)
    const hourlyRates: Record<string, number> = {
      Serveur: 12.5,
      Barman: 14.0,
      Cuisine: 15.0,
      Chef: 18.0,
      Manager: 20.0,
    }

    const payrollEntries: PayrollEntry[] = []

    // Extract all shifts in date range
    schedules.forEach((schedule: any) => {
      if (schedule.shifts) {
        schedule.shifts.forEach((shift: any) => {
          const shiftDate = new Date(shift.date)
          const rangeStart = new Date(startDate)
          const rangeEnd = new Date(endDate)

          if (shiftDate >= rangeStart && shiftDate <= rangeEnd) {
            const employee = employees.find((e: any) => e.id === shift.employeeId)
            if (employee) {
              const start = parseInt(shift.startTime?.split(":")[0] || "0")
              const end = parseInt(shift.endTime?.split(":")[0] || "0")
              const hours = Math.max(0, end - start)
              const hourlyRate = hourlyRates[shift.role] || 12.5

              payrollEntries.push({
                employeeId: employee.id,
                employeeName: `${employee.firstName} ${employee.lastName}`,
                date: shift.date,
                startTime: shift.startTime || "00:00",
                endTime: shift.endTime || "00:00",
                hours,
                role: shift.role || "Autre",
                hourlyRate,
                total: hours * hourlyRate,
              })
            }
          }
        })
      }
    })

    // Group by employee and calculate totals
    const payrollSummary: Record<string, {
      employeeId: string
      employeeName: string
      totalHours: number
      totalAmount: number
      entries: PayrollEntry[]
    }> = {}

    payrollEntries.forEach((entry) => {
      if (!payrollSummary[entry.employeeId]) {
        payrollSummary[entry.employeeId] = {
          employeeId: entry.employeeId,
          employeeName: entry.employeeName,
          totalHours: 0,
          totalAmount: 0,
          entries: [],
        }
      }

      payrollSummary[entry.employeeId].totalHours += entry.hours
      payrollSummary[entry.employeeId].totalAmount += entry.total
      payrollSummary[entry.employeeId].entries.push(entry)
    })

    // Format as CSV
    const csvHeaders = [
      "Employee ID",
      "Employee Name",
      "Date",
      "Start Time",
      "End Time",
      "Hours",
      "Role",
      "Hourly Rate",
      "Total",
    ]

    const csvRows = payrollEntries.map((entry) =>
      [
        entry.employeeId,
        entry.employeeName,
        entry.date,
        entry.startTime,
        entry.endTime,
        entry.hours.toFixed(2),
        entry.role,
        entry.hourlyRate.toFixed(2),
        entry.total.toFixed(2),
      ].join(",")
    )

    const csv = [csvHeaders.join(","), ...csvRows].join("\n")

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="payroll-${startDate}-to-${endDate}.csv"`,
      },
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

