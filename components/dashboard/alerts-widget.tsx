"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, X, TrendingUp, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Alert {
  id: string
  type: "warning" | "error" | "info" | "success"
  title: string
  message: string
  timestamp: string
  action?: {
    label: string
    href: string
  }
}

export function AlertsWidget() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      // In production, fetch from API
      // Mock data for now
      const mockAlerts: Alert[] = [
        {
          id: "1",
          type: "warning",
          title: "Staff manquant demain",
          message: "2 postes non pourvus pour le service de demain soir",
          timestamp: "Il y a 30 min",
          action: { label: "Voir le planning", href: "/dashboard/schedules" },
        },
        {
          id: "2",
          type: "info",
          title: "Planning publié",
          message: "Le planning de la semaine 4 a été publié avec succès",
          timestamp: "Il y a 2h",
        },
        {
          id: "3",
          type: "success",
          title: "Tous les shifts couverts",
          message: "Excellent ! Tous les shifts de la semaine sont couverts",
          timestamp: "Il y a 1 jour",
        },
      ]
      setAlerts(mockAlerts)
    } catch (error) {
      console.error("Error fetching alerts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
    toast.success("Alerte masquée")
  }

  const getIcon = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-4 w-4 text-accent" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-accent-green" />
      default:
        return <Clock className="h-4 w-4 text-chart-1" />
    }
  }

  const getColor = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return "bg-accent/10 border-accent/20 text-accent"
      case "error":
        return "bg-destructive/10 border-destructive/20 text-destructive"
      case "success":
        return "bg-accent-green/10 border-accent-green/20 text-accent-green"
      default:
        return "bg-chart-1/10 border-chart-1/20 text-chart-1"
    }
  }

  if (isLoading) {
    return (
      <Card variant="glass" className="backdrop-blur-md border-border/50">
        <CardContent className="p-6">
          <div className="h-32 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  const activeAlerts = alerts.filter((a) => a.type === "warning" || a.type === "error")
  const hasCriticalAlerts = activeAlerts.length > 0

  return (
    <Card variant="glass" className="backdrop-blur-md border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className={`h-5 w-5 ${hasCriticalAlerts ? "text-accent" : "text-muted-foreground"}`} />
            Alertes
            {hasCriticalAlerts && (
              <Badge variant="destructive" className="ml-2">
                {activeAlerts.length}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground text-sm"
            >
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-accent-green opacity-50" />
              <p>Aucune alerte</p>
            </motion.div>
          ) : (
            alerts.slice(0, 4).map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border ${getColor(alert.type)} flex items-start gap-2 relative group`}
              >
                <div className="flex-shrink-0 mt-0.5">{getIcon(alert.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm mb-1">{alert.title}</p>
                  <p className="text-xs opacity-80 mb-2">{alert.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-60">{alert.timestamp}</span>
                    {alert.action && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => (window.location.href = alert.action!.href)}
                      >
                        {alert.action.label}
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => dismissAlert(alert.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {alerts.length > 4 && (
          <Button variant="outline" size="sm" className="w-full mt-2">
            Voir toutes les alertes ({alerts.length})
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

