"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Activity,
  Clock,
  Bell,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  User,
  Wifi,
  WifiOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface RealtimeStats {
  activeSessions: {
    managers: number
    employees: Array<{
      userId: string
      name: string
      lastSeen: string
    }>
  }
  stats: {
    activeShifts: number
    scheduledEmployees: number
    activeUsers: number
    activeEmployees: number
  }
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
  timestamp: string
}

export function RealtimeDashboard() {
  const [data, setData] = useState<RealtimeStats | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        // Ping endpoint to update our session
        await fetch("/api/realtime", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userType: "manager" }),
        })

        // Fetch real-time data
        const res = await fetch("/api/realtime")
        const result = await res.json()

        if (result.success) {
          setData(result.data)
          setLastUpdate(new Date())
        }
      } catch (error) {
        console.error("Error fetching realtime data:", error)
      }
    }

    // Initial fetch
    fetchRealtimeData()

    // Poll every 10 seconds
    const interval = setInterval(fetchRealtimeData, 10000)

    return () => clearInterval(interval)
  }, [])

  if (!data) {
    return (
      <Card variant="glass" className="backdrop-blur-md border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Activity className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4 text-accent-green" />
              <span className="text-sm text-muted-foreground">Temps réel actif</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">Hors ligne</span>
            </>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          Mis à jour {formatDistanceToNow(lastUpdate, { addSuffix: true, locale: fr })}
        </Badge>
      </motion.div>

      {/* Active Users Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass" className="backdrop-blur-md border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Utilisateurs actifs</p>
                  <p className="text-2xl font-bold text-foreground">{data.stats.activeUsers}</p>
                </div>
                <Users className="h-8 w-8 text-chart-1 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass" className="backdrop-blur-md border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Employés connectés</p>
                  <p className="text-2xl font-bold text-foreground">{data.stats.activeEmployees}</p>
                </div>
                <Activity className="h-8 w-8 text-chart-2 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass" className="backdrop-blur-md border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Shifts en cours</p>
                  <p className="text-2xl font-bold text-foreground">{data.stats.activeShifts}</p>
                </div>
                <Clock className="h-8 w-8 text-chart-3 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="glass" className="backdrop-blur-md border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Employés planifiés</p>
                  <p className="text-2xl font-bold text-foreground">{data.stats.scheduledEmployees}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent-green opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Active Employees List */}
      {data.activeSessions.employees.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass" className="backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <User className="h-5 w-5" />
                Employés connectés maintenant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <AnimatePresence>
                  {data.activeSessions.employees.map((employee, index) => (
                    <motion.div
                      key={employee.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-chart-1 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Actif {formatDistanceToNow(new Date(employee.lastSeen), { addSuffix: true, locale: fr })}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-accent-green/10 text-accent-green border-accent-green/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        En ligne
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Activity */}
      {data.recentActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="glass" className="backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <AnimatePresence>
                  {data.recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <AlertCircle className="h-4 w-4 text-chart-1 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

