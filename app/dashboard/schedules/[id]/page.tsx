"use client"

import { useState, useEffect } from "react"
import { CalendarView } from "@/components/schedules/calendar-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Download, Send, Loader2, CheckCircle, AlertCircle, Lock, Unlock } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { format } from "date-fns"
import { SkeletonCard } from "@/components/animations/skeleton-loader"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface Schedule {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "draft" | "generating" | "completed" | "published"
  shifts: any[]
  createdAt: string
}

export default function ScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)
  const [scheduleId, setScheduleId] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setScheduleId(p.id))
  }, [params])

  useEffect(() => {
    if (!scheduleId) return

    fetchSchedule()
  }, [scheduleId])

  const fetchSchedule = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/schedules/${scheduleId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement")
      }

      setSchedule(data.schedule)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPeriod = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      return `${format(start, "d MMMM")} - ${format(end, "d MMMM yyyy")}`
    } catch {
      return `${startDate} - ${endDate}`
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      published: "default",
      completed: "default",
      generating: "secondary",
      draft: "outline",
    }
    return variants[status] || "outline"
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      published: "Publié",
      completed: "Terminé",
      generating: "Génération...",
      draft: "Brouillon",
    }
    return labels[status] || status
  }

  const handlePublish = async () => {
    if (!schedule) return

    setIsPublishing(true)
    try {
      const response = await fetch(`/api/schedules/${schedule.id}/publish`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la publication")
      }

      toast.success("Planning publié avec succès ! Il est maintenant verrouillé et envoyé aux employés.")
      fetchSchedule() // Refresh schedule
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    if (!schedule) return

    setIsUnpublishing(true)
    try {
      const response = await fetch(`/api/schedules/${schedule.id}/unpublish`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la dépublication")
      }

      toast.success("Planning dépublié avec succès. Vous pouvez maintenant le modifier.")
      fetchSchedule() // Refresh schedule
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setIsUnpublishing(false)
    }
  }

  const isReadOnly = schedule?.status === "published"
  const canPublish = schedule && schedule.status === "draft" && schedule.shifts && schedule.shifts.length > 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6">
          <SkeletonCard />
        </main>
      </div>
    )
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6">
          <div className="p-12 border-2 border-destructive/20 rounded-xl text-center bg-destructive/5">
            <p className="text-destructive font-medium mb-4">Planning non trouvé</p>
            <Button asChild variant="outline">
              <Link href="/dashboard/schedules">Retour aux plannings</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Button variant="ghost" asChild>
            <Link href="/dashboard/schedules">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-start justify-between mb-6 flex-wrap gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold">{schedule.name}</h1>
              <Badge variant={getStatusBadge(schedule.status)}>{getStatusLabel(schedule.status)}</Badge>
            </div>
            <p className="text-muted-foreground">{formatPeriod(schedule.startDate, schedule.endDate)}</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {isReadOnly && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                <Lock className="mr-1 h-3 w-3" />
                Verrouillé (Publié)
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={schedule.status === "generating"}>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href={`/api/schedules/${schedule.id}/export?format=pdf`} download>
                    Exporter en PDF
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`/api/schedules/${schedule.id}/export?format=ical`} download>
                    Exporter en iCal
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {schedule.status === "published" ? (
              <Button variant="default" disabled>
                <Send className="mr-2 h-4 w-4" />
                Envoyé aux employés
              </Button>
            ) : (
              <Button variant="outline" disabled>
                <Send className="mr-2 h-4 w-4" />
                Envoyer aux employés
              </Button>
            )}
            {canPublish && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" disabled={isPublishing}>
                    {isPublishing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publication...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Publier le planning
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Publier ce planning ?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>
                        Une fois publié, le planning sera :
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Envoyé automatiquement à tous les employés concernés</li>
                        <li>Verrouillé et ne pourra plus être modifié</li>
                        <li>Visible par l'équipe dans leur interface</li>
                      </ul>
                      <p className="font-medium text-foreground pt-2">
                        Cette action est irréversible. Êtes-vous sûr de vouloir publier ce planning ?
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePublish} className="bg-primary">
                      Oui, publier
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {!isReadOnly && schedule.status !== "generating" && (
              <Button asChild variant="outline">
                <Link href={`/dashboard/schedules/${schedule.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
            )}
            {isReadOnly && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isUnpublishing}>
                    {isUnpublishing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Dépublication...
                      </>
                    ) : (
                      <>
                        <Unlock className="mr-2 h-4 w-4" />
                        Dépublier
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Dépublier ce planning ?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>
                        En dépubliant ce planning :
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Il redeviendra modifiable</li>
                        <li>Les employés seront notifiés du changement</li>
                        <li>Le planning sera remis en statut "Brouillon"</li>
                      </ul>
                      <p className="font-medium text-foreground pt-2">
                        Êtes-vous sûr de vouloir dépublier ce planning ?
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleUnpublish} className="bg-accent">
                      Oui, dépublier
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </motion.div>

        <CalendarView schedule={schedule} />
      </main>
    </div>
  )
}
