"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Calendar, CheckCircle, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function GoogleCalendarIntegration() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      const res = await fetch("/api/calendar/google/connect")
      const data = await res.json()

      if (data.success && data.authUrl) {
        // In production, redirect to Google OAuth
        // For now, simulate connection
        setTimeout(() => {
          setIsConnected(true)
          setIsConnecting(false)
          toast.success("Google Calendar connecté avec succès")
        }, 1000)
      }
    } catch (error) {
      toast.error("Erreur lors de la connexion")
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    setIsConnected(false)
    toast.success("Google Calendar déconnecté")
  }

  const handleSync = async () => {
    try {
      setIsSyncing(true)
      // In production, sync all schedules
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSyncing(false)
      toast.success("Synchronisation réussie")
    } catch (error) {
      toast.error("Erreur lors de la synchronisation")
      setIsSyncing(false)
    }
  }

  return (
    <Card variant="glass" className="backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Google Calendar
        </CardTitle>
        <CardDescription>
          Synchronisez automatiquement vos plannings avec Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Statut de connexion</p>
            {isConnected ? (
              <Badge className="bg-accent-green text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connecté
              </Badge>
            ) : (
              <Badge variant="outline">
                <X className="h-3 w-3 mr-1" />
                Non connecté
              </Badge>
            )}
          </div>
        </div>

        {isConnected ? (
          <div className="space-y-3">
            <Button onClick={handleSync} disabled={isSyncing} className="w-full">
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Synchronisation...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Synchroniser maintenant
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleDisconnect} className="w-full">
              Déconnecter
            </Button>
          </div>
        ) : (
          <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Connecter Google Calendar
              </>
            )}
          </Button>
        )}

        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Les plannings publiés seront automatiquement synchronisés avec votre Google Calendar.
            Les modifications dans ShiftPilot seront reflétées dans Google Calendar.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

