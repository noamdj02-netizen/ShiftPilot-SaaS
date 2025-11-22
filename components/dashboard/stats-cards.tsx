"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, Clock, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/animations/animated-counter"

const defaultStats = [
  {
    title: "Staff prévu aujourd'hui",
    value: 18,
    subtitle: "8 Midi • 10 Soir",
    icon: Users,
    change: "Complet",
    trend: "success",
    color: "text-accent-green",
    bgColor: "bg-accent-green/10",
  },
  {
    title: "Staff manquant",
    value: 2,
    subtitle: "1 Serveur • 1 Runner",
    icon: AlertTriangle,
    change: "Action requise",
    trend: "warning",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Couverture service",
    value: 89,
    suffix: "%",
    subtitle: "Midi 100% • Soir 78%",
    icon: Calendar,
    change: "+5% vs hier",
    trend: "up",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    title: "Heures cette semaine",
    value: 684,
    suffix: "h",
    subtitle: "Sur 720h max",
    icon: Clock,
    change: "95% utilisé",
    trend: "up",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
]

export function StatsCards() {
  const [stats, setStats] = useState(defaultStats)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
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

      // Calculate today's staff
      const todayShifts = schedules
        .flatMap((s: any) => s.shifts || [])
        .filter((shift: any) => shift.date === today)

      const todayStaffCount = new Set(todayShifts.map((s: any) => s.employeeId)).size
      const midiShifts = todayShifts.filter((s: any) => s.service === "Midi" || s.startTime < "15:00").length
      const soirShifts = todayShifts.filter((s: any) => s.service === "Soir" || s.startTime >= "15:00").length

      // Calculate weekly hours
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
        const start = parseInt(shift.startTime.split(":")[0])
        const end = parseInt(shift.endTime.split(":")[0])
        return acc + (end - start)
      }, 0)

      setStats([
        {
          title: "Staff prévu aujourd'hui",
          value: todayStaffCount || 0,
          subtitle: `${midiShifts} Midi • ${soirShifts} Soir`,
          icon: Users,
          change: todayStaffCount > 0 ? "Complet" : "À planifier",
          trend: todayStaffCount > 0 ? "success" : "warning",
          color: "text-accent-green",
          bgColor: "bg-accent-green/10",
        },
        {
          title: "Employés actifs",
          value: employees.length,
          subtitle: `${employees.filter((e: any) => e.role).length} avec rôle`,
          icon: Users,
          change: employees.length > 0 ? "Actif" : "Aucun",
          trend: employees.length > 0 ? "success" : "warning",
          color: "text-chart-2",
          bgColor: "bg-chart-2/10",
        },
        {
          title: "Plannings actifs",
          value: schedules.filter((s: any) => s.status === "published" || s.status === "completed").length,
          subtitle: `${schedules.length} au total`,
          icon: Calendar,
          change: "+2 ce mois",
          trend: "up",
          color: "text-chart-1",
          bgColor: "bg-chart-1/10",
        },
        {
          title: "Heures cette semaine",
          value: totalHours,
          suffix: "h",
          subtitle: `Sur ${employees.length * 35}h max`,
          icon: Clock,
          change: `${Math.round((totalHours / (employees.length * 35 || 1)) * 100)}% utilisé`,
          trend: "up",
          color: "text-chart-4",
          bgColor: "bg-chart-4/10",
        },
      ])
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
          >
            <Card className="hover:shadow-xl transition-all border-border overflow-hidden relative group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                  <motion.div
                    className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 10 }}
                    transition={{ duration: 0.5, type: "tween" }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.div>
                </div>
                <div className="space-y-1">
                  <motion.div
                    className="text-3xl font-bold text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  >
                    <AnimatedCounter value={stat.value} duration={1.5} />
                    {stat.suffix && <span>{stat.suffix}</span>}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.3 }}
                    className={`text-xs font-medium inline-block px-2 py-1 rounded-md ${
                      stat.trend === "success"
                        ? "bg-accent-green/10 text-accent-green"
                        : stat.trend === "warning"
                          ? "bg-accent/10 text-accent"
                          : "bg-chart-1/10 text-chart-1"
                    }`}
                  >
                    {stat.change}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
