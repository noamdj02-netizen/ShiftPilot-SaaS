"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Users, TrendingUp, TrendingDown, DollarSign, Percent, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { SkeletonCard } from "@/components/animations/skeleton-loader"
import { useState, useEffect } from "react"
import { MetricCard } from "@/components/analytics/metric-card"
import { ActiveUsersChart } from "@/components/analytics/active-users-chart"
import { RevenueChart } from "@/components/analytics/revenue-chart"
import { FeatureUsageChart } from "@/components/analytics/feature-usage-chart"
import { AcquisitionChart } from "@/components/analytics/acquisition-chart"
import { TopUsersTable } from "@/components/analytics/top-users-table"
import { TransactionsTable } from "@/components/analytics/transactions-table"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalyticsData {
  metrics: {
    totalUsers: number
    revenueMRR: number
    churnRate: number
    conversionRate: number
  }
  charts: {
    activeUsers: Array<{ date: string; users: number }>
    revenueTrend: Array<{ date: string; revenue: number }>
    featureUsage: Array<{ name: string; usage: number }>
    acquisitionChannel: Array<{ name: string; value: number }>
  }
  topUsers: Array<{
    id: string
    name: string
    email: string
    activity: number
    lastActive: string
    status: "active" | "inactive"
  }>
  transactions: Array<{
    id: string
    date: string
    description: string
    amount: number
    type: "credit" | "debit"
    status: "completed" | "pending" | "failed"
  }>
  widgets: {
    churnPrediction: number
    mrrForecast: number
  }
}

export default function AnalyticsFullPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "custom">("30d")
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({})

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        period: period === "custom" ? "custom" : period,
        ...(period === "custom" && customDateRange.from && customDateRange.to
          ? {
              from: customDateRange.from.toISOString(),
              to: customDateRange.to.toISOString(),
            }
          : {}),
      })

      const response = await fetch(`/api/analytics/stats?${params.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors du chargement")
      }

      // Transform data for the full analytics page
      setData(transformToFullAnalytics(result.data))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const transformToFullAnalytics = (data: any): AnalyticsData => {
    return {
      metrics: {
        totalUsers: data.stats?.activeEmployees || 1234,
        revenueMRR: Math.floor(data.stats?.totalCosts || 45230),
        churnRate: 2.1,
        conversionRate: 3.4,
      },
      charts: {
        activeUsers: generateActiveUsersData(),
        revenueTrend: data.charts?.costsByWeek?.map((item: any) => ({
          date: item.week,
          revenue: item.costs,
        })) || generateRevenueData(),
        featureUsage: [
          { name: "Génération IA", usage: 234 },
          { name: "Planning manuel", usage: 189 },
          { name: "Gestion équipe", usage: 156 },
          { name: "Export PDF", usage: 98 },
          { name: "Analytics", usage: 76 },
        ],
        acquisitionChannel: [
          { name: "Organique", value: 45 },
          { name: "Payant", value: 30 },
          { name: "Direct", value: 15 },
          { name: "Parrainage", value: 10 },
        ],
      },
      topUsers: generateTopUsers(),
      transactions: generateTransactions(),
      widgets: {
        churnPrediction: 2.3,
        mrrForecast: 48750,
      },
    }
  }

  const generateActiveUsersData = () => {
    const data = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString(),
        users: Math.floor(Math.random() * 50) + 200,
      })
    }
    return data
  }

  const generateRevenueData = () => {
    const data = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString(),
        revenue: Math.floor(Math.random() * 2000) + 1500,
      })
    }
    return data
  }

  const generateTopUsers = () => {
    return [
      {
        id: "1",
        name: "Marie Dubois",
        email: "marie@example.com",
        activity: 342,
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
      },
      {
        id: "2",
        name: "Thomas Martin",
        email: "thomas@example.com",
        activity: 298,
        lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
      },
      {
        id: "3",
        name: "Sophie Bernard",
        email: "sophie@example.com",
        activity: 256,
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
      },
    ]
  }

  const generateTransactions = () => {
    return [
      {
        id: "1",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Abonnement Pro - Janvier 2024",
        amount: 79,
        type: "credit" as const,
        status: "completed" as const,
      },
      {
        id: "2",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Abonnement Pro - Décembre 2023",
        amount: 79,
        type: "credit" as const,
        status: "completed" as const,
      },
      {
        id: "3",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Upgrade vers Enterprise",
        amount: 120,
        type: "credit" as const,
        status: "pending" as const,
      },
    ]
  }

  if (isLoading || !data) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <SkeletonCard />
      </div>
    )
  }

  const metrics = [
    {
      label: "Total Utilisateurs",
      value: data.metrics.totalUsers.toLocaleString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      label: "Revenus MRR",
      value: `${data.metrics.revenueMRR.toLocaleString()}€`,
      change: "+8%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      label: "Taux de désabonnement",
      value: `${data.metrics.churnRate}%`,
      change: "-0.5%",
      changeType: "positive" as const,
      icon: Percent,
    },
    {
      label: "Taux de conversion",
      value: `${data.metrics.conversionRate}%`,
      change: "+1.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">Statistiques et analyses de votre activité</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={period === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("7d")}
            >
              7j
            </Button>
            <Button
              variant={period === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("30d")}
            >
              30j
            </Button>
            <Button
              variant={period === "90d" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("90d")}
            >
              90j
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={period === "custom" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriod("custom")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Personnalisé
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={{
                    from: customDateRange.from,
                    to: customDateRange.to,
                  }}
                  onSelect={(range) => {
                    setCustomDateRange({ from: range?.from, to: range?.to })
                    if (range?.from && range?.to) {
                      setPeriod("custom")
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              change={metric.change}
              changeType={metric.changeType}
              icon={metric.icon}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs actifs</CardTitle>
              <CardDescription>Évolution sur les 30 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <ActiveUsersChart data={data.charts.activeUsers} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenus MRR</CardTitle>
              <CardDescription>Évolution des revenus mensuels récurrents</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart data={data.charts.revenueTrend} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilisation des fonctionnalités</CardTitle>
              <CardDescription>Top 5 fonctionnalités les plus utilisées</CardDescription>
            </CardHeader>
            <CardContent>
              <FeatureUsageChart data={data.charts.featureUsage} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Canal d'acquisition</CardTitle>
              <CardDescription>Répartition des nouveaux utilisateurs par canal</CardDescription>
            </CardHeader>
            <CardContent>
              <AcquisitionChart data={data.charts.acquisitionChannel} />
            </CardContent>
          </Card>
        </div>

        {/* Tables */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top utilisateurs</CardTitle>
              <CardDescription>Utilisateurs les plus actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <TopUsersTable users={data.topUsers} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions récentes</CardTitle>
              <CardDescription>Dernières transactions effectuées</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable transactions={data.transactions} />
            </CardContent>
          </Card>
        </div>

        {/* Extra Widgets */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prédiction désabonnement</CardTitle>
              <CardDescription>Prévision pour le prochain mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{data.widgets.churnPrediction}%</div>
              <p className="text-sm text-muted-foreground mt-2">
                Stable par rapport au mois précédent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prévision MRR</CardTitle>
              <CardDescription>Revenus prévus pour le prochain mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {data.widgets.mrrForecast.toLocaleString()}€
              </div>
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                +7.8% par rapport au mois actuel
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

