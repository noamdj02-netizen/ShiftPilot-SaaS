"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon, Clock, Save, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PageTransition } from "@/components/animations/page-transition"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [availabilityType, setAvailabilityType] = useState<"available" | "unavailable" | "preferred">("available")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [reason, setReason] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [availabilities, setAvailabilities] = useState<any[]>([])

  useEffect(() => {
    fetchAvailabilities()
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me")
      const data = await res.json()
      if (data.user) {
        setEmployeeId(data.user.id)
      }
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  const fetchAvailabilities = async () => {
    try {
      const res = await fetch("/api/availability")
      const data = await res.json()
      if (data.success) {
        setAvailabilities(data.availabilities || [])
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des disponibilités")
    }
  }

  const handleSave = async () => {
    if (!selectedDate || !employeeId) {
      toast.error("Veuillez sélectionner une date")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          date: format(selectedDate, "yyyy-MM-dd"),
          type: availabilityType,
          startTime: availabilityType === "preferred" ? startTime : undefined,
          endTime: availabilityType === "preferred" ? endTime : undefined,
          reason: reason || undefined,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Disponibilité enregistrée")
        setReason("")
        fetchAvailabilities()
      } else {
        toast.error(data.error || "Erreur")
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setIsLoading(false)
    }
  }

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return availabilities.find((a) => a.date === dateStr)
  }

  const getAvailabilityBadge = (type: string) => {
    switch (type) {
      case "available":
        return (
          <Badge className="bg-accent-green/10 text-accent-green border-accent-green/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Disponible
          </Badge>
        )
      case "unavailable":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="h-3 w-3 mr-1" />
            Indisponible
          </Badge>
        )
      case "preferred":
        return (
          <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">
            <Clock className="h-3 w-3 mr-1" />
            Préférence
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedBackground opacity={0.2} />
        <DashboardHeader />

        <main className="container mx-auto px-4 py-6 space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" />
              Mes disponibilités
            </h1>
            <p className="text-muted-foreground">
              Indiquez vos disponibilités et préférences pour les plannings
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass" className="backdrop-blur-md border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Calendrier</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Sélectionnez une date pour définir votre disponibilité
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-border/50"
                    modifiers={{
                      available: availabilities
                        .filter((a) => a.type === "available")
                        .map((a) => new Date(a.date)),
                      unavailable: availabilities
                        .filter((a) => a.type === "unavailable")
                        .map((a) => new Date(a.date)),
                      preferred: availabilities
                        .filter((a) => a.type === "preferred")
                        .map((a) => new Date(a.date)),
                    }}
                    modifiersClassNames={{
                      available: "bg-accent-green/20 border-accent-green",
                      unavailable: "bg-destructive/20 border-destructive",
                      preferred: "bg-chart-1/20 border-chart-1",
                    }}
                  />

                  {/* Legend */}
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                    <p className="text-sm font-medium text-foreground mb-2">Légende :</p>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-accent-green/20 border border-accent-green" />
                        <span className="text-xs text-muted-foreground">Disponible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive" />
                        <span className="text-xs text-muted-foreground">Indisponible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-chart-1/20 border border-chart-1" />
                        <span className="text-xs text-muted-foreground">Préférence</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass" className="backdrop-blur-md border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Définir la disponibilité</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {selectedDate
                      ? format(selectedDate, "dd MMMM yyyy", { locale: fr })
                      : "Sélectionnez une date"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedDate && (
                    <>
                      {getAvailabilityForDate(selectedDate) && (
                        <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                          <p className="text-sm font-medium text-foreground mb-1">
                            Disponibilité actuelle :
                          </p>
                          {getAvailabilityBadge(getAvailabilityForDate(selectedDate).type)}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-foreground">Type de disponibilité</Label>
                        <Select value={availabilityType} onValueChange={(v: any) => setAvailabilityType(v)}>
                          <SelectTrigger className="bg-background text-foreground border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Disponible</SelectItem>
                            <SelectItem value="unavailable">Indisponible</SelectItem>
                            <SelectItem value="preferred">Préférence horaire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {availabilityType === "preferred" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-foreground">Heure de début</Label>
                            <Input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="bg-background text-foreground border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-foreground">Heure de fin</Label>
                            <Input
                              type="time"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="bg-background text-foreground border-border"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label className="text-foreground">Raison (optionnel)</Label>
                        <Textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Ex: Congé familial, rendez-vous médical..."
                          rows={3}
                          className="bg-background text-foreground border-border"
                        />
                      </div>

                      <Button onClick={handleSave} disabled={isLoading} className="w-full">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Availabilities */}
          {availabilities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass" className="backdrop-blur-md border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground">Disponibilités récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availabilities
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 10)
                      .map((availability) => (
                        <div
                          key={availability.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            {getAvailabilityBadge(availability.type)}
                            <div>
                              <p className="font-medium text-sm text-foreground">
                                {format(new Date(availability.date), "dd MMMM yyyy", { locale: fr })}
                              </p>
                              {availability.startTime && availability.endTime && (
                                <p className="text-xs text-muted-foreground">
                                  {availability.startTime} - {availability.endTime}
                                </p>
                              )}
                            </div>
                          </div>
                          {availability.reason && (
                            <p className="text-xs text-muted-foreground italic max-w-xs truncate">
                              {availability.reason}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  )
}

