"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Clock, Eye, Edit, MoreVertical, Loader2, Unlock } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { SkeletonCard } from "@/components/animations/skeleton-loader"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
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
import { Lock, CheckCircle } from "lucide-react"

interface Schedule {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "draft" | "generating" | "completed" | "published"
  shifts: any[]
  createdAt: string
}

const mockSchedules = [
  {
    id: 1,
    name: "Planning Semaine 4 - Janvier",
    period: "22 Jan - 28 Jan 2025",
    status: "published",
    employees: 12,
    totalHours: 420,
    shifts: 48,
    createdBy: "IA",
    createdAt: "Il y a 2 jours",
  },
  {
    id: 2,
    name: "Planning Semaine 3 - Janvier",
    period: "15 Jan - 21 Jan 2025",
    status: "published",
    employees: 12,
    totalHours: 435,
    shifts: 52,
    createdBy: "Manuel",
    createdAt: "Il y a 9 jours",
  },
  {
    id: 3,
    name: "Planning Semaine 5 - Janvier",
    period: "29 Jan - 04 Fév 2025",
    status: "draft",
    employees: 0,
    totalHours: 0,
    shifts: 0,
    createdBy: "Manuel",
    createdAt: "Aujourd'hui",
  },
]

export function ScheduleList() {
  const router = useRouter()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [unpublishingId, setUnpublishingId] = useState<string | null>(null)

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/schedules")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement")
      }

      setSchedules(data.schedules || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPeriod = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      return `${format(start, "d MMM")} - ${format(end, "d MMM yyyy")}`
    } catch {
      return `${startDate} - ${endDate}`
    }
  }

  const handlePublish = async (scheduleId: string) => {
    setPublishingId(scheduleId)
    try {
      const response = await fetch(`/api/schedules/${scheduleId}/publish`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la publication")
      }

      toast.success("Planning publié avec succès !")
      fetchSchedules() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setPublishingId(null)
    }
  }

  const handleDelete = async (scheduleId: string) => {
    setDeletingId(scheduleId)
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression")
      }

      toast.success("Planning supprimé avec succès")
      fetchSchedules() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setDeletingId(null)
    }
  }

  const handleUnpublish = async (scheduleId: string) => {
    setUnpublishingId(scheduleId)
    try {
      const response = await fetch(`/api/schedules/${scheduleId}/unpublish`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la dépublication")
      }

      toast.success("Planning dépublié avec succès. Il peut maintenant être modifié.")
      fetchSchedules() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setUnpublishingId(null)
    }
  }

  const formatCreatedAt = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return "Aujourd'hui"
      if (diffDays === 1) return "Hier"
      if (diffDays < 7) return `Il y a ${diffDays} jours`
      return format(date, "d MMM yyyy")
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error && schedules.length === 0) {
    return (
      <div className="p-6 border-2 border-destructive/20 rounded-xl text-center bg-destructive/5">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchSchedules} className="mt-4" variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  if (schedules.length === 0) {
    return (
      <div className="p-12 border-2 border-dashed border-border rounded-xl text-center">
        <p className="text-muted-foreground mb-4">Aucun planning pour le moment</p>
        <div className="flex gap-2 justify-center">
          <Button asChild>
            <Link href="/dashboard/schedules/new">Créer un planning</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/schedules/generate">Générer avec l'IA</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {schedules.map((schedule, index) => {
        const period = formatPeriod(schedule.startDate, schedule.endDate)
        const createdAt = formatCreatedAt(schedule.createdAt)
        const totalShifts = schedule.shifts?.length || 0

        return (
          <motion.div
            key={schedule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-lg">{schedule.name}</h3>
                  <Badge
                    variant={
                      schedule.status === "published"
                        ? "default"
                        : schedule.status === "draft"
                          ? "secondary"
                          : schedule.status === "generating"
                            ? "outline"
                            : "outline"
                    }
                    className="flex items-center gap-1"
                  >
                    {schedule.status === "published" && <Lock className="h-3 w-3" />}
                    {schedule.status === "published"
                      ? "Publié"
                      : schedule.status === "draft"
                        ? "Brouillon"
                        : schedule.status === "generating"
                          ? "Génération..."
                          : schedule.status === "completed"
                            ? "Terminé"
                            : "Archivé"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{period}</span>
                  <span className="mx-2">•</span>
                  <span>{createdAt}</span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/schedules/${schedule.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </Link>
                  </DropdownMenuItem>
                  {schedule.status !== "published" && schedule.status !== "generating" && (
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/schedules/${schedule.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {schedule.status === "published" && (
                    <>
                      <DropdownMenuItem disabled className="text-muted-foreground">
                        <Lock className="mr-2 h-4 w-4" />
                        Verrouillé (publié)
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            disabled={unpublishingId === schedule.id}
                          >
                            {unpublishingId === schedule.id ? (
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
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Dépublier ce planning ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              En dépubliant, le planning redeviendra modifiable. Les employés seront notifiés du changement.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleUnpublish(schedule.id)} className="bg-accent">
                              Dépublier
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                  <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href={`/api/schedules/${schedule.id}/export?format=pdf`} download>
                      Exporter PDF
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`/api/schedules/${schedule.id}/export?format=ical`} download>
                      Exporter iCal
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {schedule.status === "draft" && schedule.shifts && schedule.shifts.length > 0 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          disabled={publishingId === schedule.id}
                        >
                          {publishingId === schedule.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Publication...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Publier
                            </>
                          )}
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Publier ce planning ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Une fois publié, le planning sera verrouillé et envoyé à tous les employés concernés.
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handlePublish(schedule.id)}>
                            Publier
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {schedule.status === "draft" && (!schedule.shifts || schedule.shifts.length === 0) && (
                    <DropdownMenuItem disabled className="text-muted-foreground">
                      Publier (ajoutez des shifts d'abord)
                    </DropdownMenuItem>
                  )}
                  {schedule.status !== "published" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive"
                          disabled={deletingId === schedule.id}
                        >
                          {deletingId === schedule.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Suppression...
                            </>
                          ) : (
                            "Supprimer"
                          )}
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer ce planning ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Le planning sera définitivement supprimé.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(schedule.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {schedule.status === "published" && (
                    <DropdownMenuItem disabled className="text-muted-foreground">
                      Impossible de supprimer un planning publié
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Shifts:</span>
                <span className="font-medium">{totalShifts}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Statut:</span>
                <span className="font-medium">
                  {schedule.status === "published"
                    ? "Publié"
                    : schedule.status === "generating"
                      ? "Génération..."
                      : schedule.status === "completed"
                        ? "Terminé"
                        : "Brouillon"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" asChild>
                <Link href={`/dashboard/schedules/${schedule.id}`}>
                  <Eye className="mr-2 h-3 w-3" />
                  Voir le planning
                </Link>
              </Button>
              {schedule.status === "draft" && (
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/schedules/${schedule.id}/edit`}>
                    <Edit className="mr-2 h-3 w-3" />
                    Modifier
                  </Link>
                </Button>
              )}
            </div>
            </CardContent>
          </Card>
        </motion.div>
      )
      })}
    </div>
  )
}
