"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { User, Building2, Bell, Shield, CheckCircle } from "lucide-react"
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
        className="space-y-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble</CardTitle>
            <CardDescription>Résumé de vos paramètres et informations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Profil</p>
                  <p className="font-medium">{user?.email || "Non défini"}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/settings/profile">Éditer</Link>
                </Button>
              </div>

              <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Entreprise</p>
                  <p className="font-medium">{user?.companyName || "Non défini"}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/settings/company">Éditer</Link>
                </Button>
              </div>

              <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
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
              </div>

              <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Sécurité</p>
                  <Badge variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Sécurisé
                  </Badge>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/settings/security">Voir</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

