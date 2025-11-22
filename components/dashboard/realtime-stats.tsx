"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Clock, TrendingUp, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface RealtimeStats {
  activeEmployeesToday: number
  shiftsToday: number
  hoursToday: number
  publishedThisWeek: number
  totalEmployees: number
  totalSchedules: number
  timestamp: string
}

export function RealtimeStats() {
  const [stats, setStats] = useState<RealtimeStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/realtime/stats")
      const data = await res.json()

      if (data.success) {
        setStats(data.stats)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error("Error fetching realtime stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-8 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statsCards = [
    {
      title: "Employés actifs",
      value: stats.activeEmployeesToday,
      total: stats.totalEmployees,
      icon: Users,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Shifts aujourd'hui",
      value: stats.shiftsToday,
      icon: Calendar,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Heures travaillées",
      value: `${stats.hoursToday}h`,
      icon: Clock,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Plannings publiés",
      value: stats.publishedThisWeek,
      icon: TrendingUp,
      color: "text-accent-green",
      bgColor: "bg-accent-green/10",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Statistiques en temps réel</h2>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <Badge variant="outline" className="text-xs">
              Mis à jour: {lastUpdate.toLocaleTimeString()}
            </Badge>
          )}
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            onClick={fetchStats}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" className="backdrop-blur-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-foreground">{card.value}</p>
                        {card.total && (
                          <span className="text-xs text-muted-foreground">
                            / {card.total}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`${card.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

