"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { User, Building2, Bell, Shield, CheckCircle, Calendar } from "lucide-react"
import { GoogleCalendarIntegration } from "@/components/settings/google-calendar-integration"
import { MultiLocationManager } from "@/components/settings/multi-location-manager"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface UserProfile {
  email: string
  companyName: string
}

export default function SettingsOverviewPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="space-y-4"
      >
        <Card variant="glass" className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-foreground">Vue d'ensemble</CardTitle>
            <CardDescription>Résumé de vos paramètres et informations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:shadow-md transition-all cursor-pointer glass backdrop-blur-sm"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Profil</p>
                  <p className="font-medium text-foreground">{user?.email || "Non défini"}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/settings/profile">Éditer</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                whileHover={{ scale: 1.02, x: -4 }}
                className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:shadow-md transition-all cursor-pointer glass backdrop-blur-sm"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Entreprise</p>
                  <p className="font-medium text-foreground">{user?.companyName || "Non défini"}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/settings/company">Éditer</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:shadow-md transition-all cursor-pointer glass backdrop-blur-sm"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Notifications</p>
                  <Badge variant="outline">Actives</Badge>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/settings/notifications">Configurer</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                whileHover={{ scale: 1.02, x: -4 }}
                className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:shadow-md transition-all cursor-pointer glass backdrop-blur-sm"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Sécurité</p>
                  <Badge variant="outline" className="text-foreground">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Sécurisé
                  </Badge>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/settings/security">Voir</Link>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mt-6"
        >
          <MultiLocationManager />
        </motion.div>

        {/* Google Calendar Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="mt-6"
        >
          <GoogleCalendarIntegration />
        </motion.div>
      </motion.div>
    </div>
  )
}

