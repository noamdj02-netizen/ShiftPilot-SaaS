"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Bell, TrendingUp, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { EmployeeEmailComposer } from "./employee-email-composer"
import Link from "next/link"

interface CommunicationStats {
  emailsSent: number
  emailsRead: number
  notificationsSent: number
  lastEmailSent: string | null
}

export function CommunicationWidget() {
  const [stats, setStats] = useState<CommunicationStats>({
    emailsSent: 0,
    emailsRead: 0,
    notificationsSent: 0,
    lastEmailSent: null,
  })

  useEffect(() => {
    // Fetch communication stats
    // For now, using mock data
    setStats({
      emailsSent: 24,
      emailsRead: 18,
      notificationsSent: 42,
      lastEmailSent: "Il y a 2h",
    })
  }, [])

  const readRate = stats.emailsSent > 0 ? Math.round((stats.emailsRead / stats.emailsSent) * 100) : 0

  return (
    <Card variant="glass" className="backdrop-blur-md border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-chart-1" />
          Communication
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Statistiques de communication avec votre équipe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EmployeeEmailComposer />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-3 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-chart-1" />
              <span className="text-xs text-muted-foreground">Emails envoyés</span>
            </div>
            <p className="text-xl font-bold text-foreground">{stats.emailsSent}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-3 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-accent-green" />
              <span className="text-xs text-muted-foreground">Taux de lecture</span>
            </div>
            <p className="text-xl font-bold text-foreground">{readRate}%</p>
          </motion.div>
        </div>

        {/* Last Activity */}
        {stats.lastEmailSent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/30"
          >
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Dernier email envoyé {stats.lastEmailSent}
            </p>
          </motion.div>
        )}

        {/* Quick Links */}
        <div className="pt-2 border-t border-border/50">
          <Link href="/dashboard/employees">
            <Button variant="outline" size="sm" className="w-full">
              <Bell className="mr-2 h-4 w-4" />
              Gérer les notifications
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

