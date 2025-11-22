"use client"

import { useState, useEffect } from "react"
import { ManualScheduleForm } from "@/components/schedules/manual-schedule-form"
import { ArrowLeft, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { SkeletonCard } from "@/components/animations/skeleton-loader"
import { Card, CardContent } from "@/components/ui/card"
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

interface Schedule {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "draft" | "generating" | "completed" | "published"
  shifts: any[]
}

export default function EditSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scheduleId, setScheduleId] = useState<string | null>(null)
  const [showUnpublishDialog, setShowUnpublishDialog] = useState(false)

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

      // If published, show warning
      if (data.schedule.status === "published") {
        setShowUnpublishDialog(true)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnpublish = async () => {
    if (!schedule) return

    try {
      const response = await fetch(`/api/schedules/${schedule.id}/unpublish`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la dépublication")
      }

      toast.success("Planning dépublié. Vous pouvez maintenant le modifier.")
      setShowUnpublishDialog(false)
      fetchSchedule() // Refresh
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    }
  }

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

  // Show protection message if published
  if (schedule.status === "published" && !showUnpublishDialog) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <Button variant="ghost" asChild>
              <Link href={`/dashboard/schedules/${schedule.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Link>
            </Button>
          </motion.div>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Planning verrouillé</h2>
                  <p className="text-muted-foreground mb-4">
                    Ce planning est publié et ne peut pas être modifié pour protéger l'intégrité des données.
                    Les employés ont déjà reçu ce planning.
                  </p>
                  <div className="flex gap-3">
                    <AlertDialog open={showUnpublishDialog} onOpenChange={setShowUnpublishDialog}>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">
                          <Lock className="mr-2 h-4 w-4" />
                          Dépublier pour modifier
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Dépublier ce planning ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            En dépubliant, le planning redeviendra modifiable. Les employés seront notifiés du changement.
                            Êtes-vous sûr de vouloir continuer ?
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
                    <Button variant="ghost" asChild>
                      <Link href={`/dashboard/schedules/${schedule.id}`}>Retour au planning</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
            <Link href={`/dashboard/schedules/${schedule.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
        </motion.div>

        <div className="max-w-4xl">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">Modifier le planning</h1>
              {schedule.status === "published" && (
                <Badge variant="default" className="bg-accent-green/10 text-accent-green border-accent-green/20">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Dépublié pour modification
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{schedule.name}</p>
          </div>

          <ManualScheduleForm scheduleId={schedule.id} existingSchedule={schedule} />
        </div>
      </main>
    </div>
  )
}

