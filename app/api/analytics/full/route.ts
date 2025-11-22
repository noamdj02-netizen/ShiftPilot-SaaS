import { type NextRequest } from "next/server"
import { createErrorResponse, createSuccessResponse, checkRateLimit } from "@/lib/api-utils"
import { requireAuth } from "@/lib/auth"

function generateDateRange(days: number): string[] {
  const dates: string[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split("T")[0])
  }
  return dates
}

function generateMockData(days: number) {
  const dates = generateDateRange(days)
  const baseUsers = 1000
  const baseRevenue = 40000

  return {
    activeUsers: dates.map((date, index) => ({
      date,
      users: Math.floor(baseUsers + Math.sin(index / 5) * 200 + Math.random() * 100),
    })),
    revenue: dates.map((date, index) => ({
      date,
      revenue: Math.floor(baseRevenue + Math.sin(index / 3) * 3000 + Math.random() * 2000),
    })),
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    const clientId = request.headers.get("x-forwarded-for") || request.ip || "unknown"
    const rateLimit = checkRateLimit(`analytics-full:${clientId}`, 30, 60000)

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new Error("Trop de requêtes. Veuillez réessayer dans quelques instants."),
        "Rate limit exceeded"
      )
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "30d"
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    let days = 30
    if (period === "7d") days = 7
    else if (period === "30d") days = 30
    else if (period === "90d") days = 90
    else if (period === "custom" && from && to) {
      const fromDate = new Date(from)
      const toDate = new Date(to)
      days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    }

    const { activeUsers, revenue } = generateMockData(days)

    // Metrics
    const totalUsers = 1234
    const userChange = 12

    const revenueMRR = 45230
    const revenueChange = 8

    const churnRate = 2.1
    const churnChange = -0.5

    const conversionRate = 3.4
    const conversionChange = 1.2

    // Feature Usage (Top 5)
    const featureUsage = [
      { name: "Planning automatique", usage: 8542 },
      { name: "Gestion d'équipe", usage: 7231 },
      { name: "Analytics", usage: 6124 },
      { name: "Export PDF", usage: 4892 },
      { name: "Notifications", usage: 3654 },
    ]

    // Acquisition Channels
    const acquisition = [
      { name: "Organic", value: 45 },
      { name: "Paid", value: 30 },
      { name: "Direct", value: 15 },
      { name: "Referral", value: 10 },
    ]

    // Top Users
    const topUsers = [
      {
        id: "1",
        name: "Jean Dupont",
        email: "jean.dupont@example.com",
        activity: 1245,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
      },
      {
        id: "2",
        name: "Marie Martin",
        email: "marie.martin@example.com",
        activity: 987,
        lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
      },
      {
        id: "3",
        name: "Pierre Durand",
        email: "pierre.durand@example.com",
        activity: 856,
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
      },
      {
        id: "4",
        name: "Sophie Bernard",
        email: "sophie.bernard@example.com",
        activity: 743,
        lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
      },
      {
        id: "5",
        name: "Lucas Petit",
        email: "lucas.petit@example.com",
        activity: 621,
        lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "inactive" as const,
      },
    ]

    // Recent Transactions
    const transactions = [
      {
        id: "1",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Abonnement Premium - Jean Dupont",
        amount: 49.99,
        type: "credit" as const,
        status: "completed" as const,
      },
      {
        id: "2",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Abonnement Pro - Marie Martin",
        amount: 29.99,
        type: "credit" as const,
        status: "completed" as const,
      },
      {
        id: "3",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Remboursement - Pierre Durand",
        amount: 49.99,
        type: "debit" as const,
        status: "completed" as const,
      },
      {
        id: "4",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Abonnement Premium - Sophie Bernard",
        amount: 49.99,
        type: "credit" as const,
        status: "pending" as const,
      },
      {
        id: "5",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Abonnement Basic - Lucas Petit",
        amount: 19.99,
        type: "credit" as const,
        status: "completed" as const,
      },
    ]

    // Widgets
    const churnPrediction = 2.1
    const mrrForecast = 48200

    // Retention Cohorts
    const cohorts = [
      { month: "Jan 2024", retention: 85.5 },
      { month: "Fév 2024", retention: 87.2 },
      { month: "Mar 2024", retention: 86.8 },
    ]

    return createSuccessResponse({
      metrics: {
        totalUsers: { value: totalUsers, change: userChange, label: "Total Users" },
        revenueMRR: { value: revenueMRR, change: revenueChange, label: "Revenue MRR" },
        churnRate: { value: churnRate, change: churnChange, label: "Churn Rate" },
        conversionRate: { value: conversionRate, change: conversionChange, label: "Conversion Rate" },
      },
      chartData: {
        activeUsers,
        revenue,
        featureUsage,
        acquisition,
      },
      topUsers,
      transactions,
      widgets: {
        churnPrediction,
        mrrForecast,
      },
      cohorts,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return createErrorResponse(error, "Non autorisé")
    }
    return createErrorResponse(error, "Erreur lors de la récupération des analytics")
  }
}

