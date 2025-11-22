"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Shield, Lock, Smartphone, Key, LogOut, Monitor, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Session {
  id: string
  ipAddress: string
  userAgent: string
  createdAt: string
  lastActiveAt: string
  isCurrent: boolean
}

export default function SecuritySettingsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/settings/security/sessions")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement")
      }

      setSessions(data.sessions || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const response = await fetch("/api/settings/security/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression")
      }

      toast.success("Session supprimée avec succès")
      fetchSessions() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    }
  }

  const handleDeleteAllSessions = async () => {
    try {
      const response = await fetch("/api/settings/security/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allSessions: true }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression")
      }

      toast.success("Toutes les sessions ont été supprimées (sauf la session actuelle)")
      fetchSessions() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    }
  }

  const getUserAgentInfo = (userAgent: string) => {
    if (userAgent.includes("Chrome")) return { browser: "Chrome", icon: Globe }
    if (userAgent.includes("Firefox")) return { browser: "Firefox", icon: Globe }
    if (userAgent.includes("Safari")) return { browser: "Safari", icon: Globe }
    return { browser: "Navigateur inconnu", icon: Monitor }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité du compte
          </CardTitle>
          <CardDescription>Gérez la sécurité de votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Mot de passe</p>
                <p className="text-sm text-muted-foreground">Dernière modification il y a 3 mois</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast.info("Fonctionnalité de changement de mot de passe à venir")
              }}
            >
              Changer
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Authentification à deux facteurs</p>
                <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité supplémentaire</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.info("Fonctionnalité d'authentification à deux facteurs à venir")
              }}
            >
              Activer 2FA
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Clés API</p>
                <p className="text-sm text-muted-foreground">Gérez vos clés API pour l'intégration</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.info("Fonctionnalité de gestion des clés API à venir")
              }}
            >
              Gérer
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sessions actives</CardTitle>
              <CardDescription>Voir et gérer vos sessions actives</CardDescription>
            </div>
            {sessions.length > 1 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Déconnecter toutes les autres sessions
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Déconnecter toutes les autres sessions ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Toutes vos autres sessions seront déconnectées. La session actuelle restera active.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAllSessions} className="bg-destructive hover:bg-destructive/90">
                      Déconnecter
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Aucune session active</div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => {
                const { browser, icon: BrowserIcon } = getUserAgentInfo(session.userAgent)

                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BrowserIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{browser}</p>
                          {session.isCurrent && <Badge variant="default">Actuelle</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {session.ipAddress} • {format(new Date(session.lastActiveAt), "d MMM yyyy à HH:mm")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Connecté le {format(new Date(session.createdAt), "d MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <LogOut className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Déconnecter cette session ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette session sera déconnectée et devra se reconnecter.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSession(session.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Déconnecter
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

