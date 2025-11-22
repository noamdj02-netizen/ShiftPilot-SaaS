import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"
import { getEmployees, getSchedules } from "@/lib/db"
import path from "path"
import fs from "fs/promises"

const ACTIVE_SESSIONS_FILE = path.join(process.cwd(), "data", "active_sessions.json")

async function getActiveSessions() {
  try {
    const data = await fs.readFile(ACTIVE_SESSIONS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function updateActiveSession(userId: string, userType: "manager" | "employee", data: any) {
  await fs.mkdir(path.dirname(ACTIVE_SESSIONS_FILE), { recursive: true })

  let sessions: any[] = []
  try {
    const data = await fs.readFile(ACTIVE_SESSIONS_FILE, "utf-8")
    sessions = JSON.parse(data)
  } catch {
    sessions = []
  }

  // Remove old session for this user (if exists)
  sessions = sessions.filter((s: any) => s.userId !== userId || s.userType !== userType)

  // Add or update session
  sessions.push({
    userId,
    userType,
    ...data,
    lastSeen: new Date().toISOString(),
  })

  // Clean up old sessions (older than 5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  sessions = sessions.filter((s: any) => s.lastSeen > fiveMinutesAgo)

  await fs.writeFile(ACTIVE_SESSIONS_FILE, JSON.stringify(sessions, null, 2))
}

export async function GET(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)

    const sessions = await getActiveSessions()
    const employees = await getEmployees()
    const schedules = await getSchedules()

    // Filter sessions for this user's employees/team
    const managerSessions = sessions.filter((s: any) => s.userType === "manager")
    const employeeSessions = sessions.filter((s: any) => s.userType === "employee")

    // Get employee names for active employee sessions
    const activeEmployees = employeeSessions.map((session: any) => {
      const employee = employees.find((e: any) => e.id === session.userId)
      return {
        ...session,
        name: employee ? `${employee.firstName} ${employee.lastName}` : "Employé",
      }
    })

    // Real-time stats
    const now = new Date()
    const todayShifts = schedules
      .flatMap((s: any) => s.shifts || [])
      .filter((shift: any) => {
        const shiftDate = new Date(shift.date)
        return (
          shiftDate.toDateString() === now.toDateString() &&
          shift.startTime <= now.toTimeString().slice(0, 5) &&
          shift.endTime >= now.toTimeString().slice(0, 5)
        )
      })

    const todayStats = {
      activeShifts: todayShifts.length,
      scheduledEmployees: new Set(todayShifts.map((s: any) => s.employeeId)).size,
      activeUsers: managerSessions.length + employeeSessions.length,
      activeEmployees: employeeSessions.length,
    }

    // Recent activity (mock - in production, use a proper activity log)
    const recentActivity = [
      {
        id: "1",
        type: "schedule_published",
        message: "Un planning a été publié",
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        type: "shift_exchange",
        message: "Demande d'échange de shift",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
    ]

    return createSuccessResponse({
      activeSessions: {
        managers: managerSessions.length,
        employees: activeEmployees,
      },
      stats: todayStats,
      recentActivity,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await checkRateLimit(request)
    const user = await requireAuth(request)
    const body = await request.json()

    const userType = body.userType || "manager" // Default to manager for authenticated users

    await updateActiveSession(user.id, userType, {
      ip: request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })

    return createSuccessResponse({
      success: true,
      message: "Session mise à jour",
    })
  } catch (error) {
    return createErrorResponse(error)
  }
}

