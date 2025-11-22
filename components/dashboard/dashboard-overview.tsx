"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/animations/animated-counter"

interface DashboardStats {
  totalEmployees: number
  activeShifts: number
  weeklyHours: number
  weeklyRevenue: number
  publishedSchedules: number
  pendingActions: number
  coverageRate: number
  efficiencyScore: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeShifts: 0,
    weeklyHours: 0,
    weeklyRevenue: 0,
    publishedSchedules: 0,
    pendingActions: 0,
    coverageRate: 0,
    efficiencyScore: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOverviewStats()
  }, [])

  const fetchOverviewStats = async () => {
    try {
      const [employeesRes, schedulesRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/schedules"),
      ])

      const employeesData = await employeesRes.json()
      const schedulesData = await schedulesRes.json()

      const employees = employeesData.employees || []
      const schedules = schedulesData.schedules || []
      const today = new Date().toISOString().split("T")[0]

      // Calculate today's shifts
      const todayShifts = schedules
        .flatMap((s: any) => s.shifts || [])
        .filter((shift: any) => shift.date === today)

      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const weekShifts = schedules
        .flatMap((s: any) => s.shifts || [])
        .filter((shift: any) => {
          const shiftDate = new Date(shift.date)
          return shiftDate >= weekStart && shiftDate <= weekEnd
        })

      const totalHours = weekShifts.reduce((acc: number, shift: any) => {
        const start = parseInt(shift.startTime?.split(":")[0] || "0")
        const end = parseInt(shift.endTime?.split(":")[0] || "0")
        return acc + Math.max(0, end - start)
      }, 0)

      const publishedSchedules = schedules.filter((s: any) => s.status === "published").length
      const coverageRate = employees.length > 0 ? Math.min(100, (todayShifts.length / (employees.length * 2)) * 100) : 0

      setStats({
        totalEmployees: employees.length,
        activeShifts: todayShifts.length,
        weeklyHours: totalHours,
        weeklyRevenue: totalHours * 12.5, // Approximate hourly rate
        publishedSchedules,
        pendingActions: schedules.filter((s: any) => s.status === "draft").length,
        coverageRate: Math.round(coverageRate),
        efficiencyScore: Math.round(Math.min(100, (publishedSchedules / Math.max(1, schedules.length)) * 100)),
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="glass" className="backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent-green" />
              Performance de la semaine
            </CardTitle>
            <CardDescription className="text-muted-foreground">Indicateurs clés de performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Couverture des shifts</span>
                <Badge className="bg-accent-green/10 text-accent-green border-accent-green/20">
                  {stats.coverageRate}%
                </Badge>
              </div>
              <Progress value={stats.coverageRate} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Efficacité des plannings</span>
                <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                  {stats.efficiencyScore}%
                </Badge>
              </div>
              <Progress value={stats.efficiencyScore} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Heures cette semaine</p>
                <p className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={stats.weeklyHours} duration={1} />
                  <span className="text-sm text-muted-foreground ml-1">h</span>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Plannings publiés</p>
                <p className="text-2xl font-bold text-foreground">
                  <AnimatedCounter value={stats.publishedSchedules} duration={1} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="glass" className="backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent-green" />
              Statut rapide
            </CardTitle>
            <CardDescription className="text-muted-foreground">Vue d'ensemble de l'activité</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="p-2 rounded-lg bg-chart-2/10">
                  <Users className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Employés</p>
                  <p className="text-xl font-bold text-foreground">
                    <AnimatedCounter value={stats.totalEmployees} duration={1} />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="p-2 rounded-lg bg-chart-1/10">
                  <Calendar className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Shifts aujourd'hui</p>
                  <p className="text-xl font-bold text-foreground">
                    <AnimatedCounter value={stats.activeShifts} duration={1} />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="p-2 rounded-lg bg-accent-green/10">
                  <Clock className="h-5 w-5 text-accent-green" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Actions en attente</p>
                  <p className="text-xl font-bold text-foreground">
                    <AnimatedCounter value={stats.pendingActions} duration={1} />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="p-2 rounded-lg bg-chart-4/10">
                  <DollarSign className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Coût estimé</p>
                  <p className="text-xl font-bold text-foreground">
                    <AnimatedCounter value={Math.round(stats.weeklyRevenue)} duration={1} />
                    <span className="text-xs text-muted-foreground ml-1">€</span>
                  </p>
                </div>
              </div>
            </div>

            {stats.pendingActions > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20"
              >
                <AlertCircle className="h-5 w-5 text-accent" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{stats.pendingActions}</span> plannings nécessitent votre attention
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

