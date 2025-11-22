"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, Clock, DollarSign, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { format } from "date-fns"
import { NotificationPreferences } from "@/components/employees/notification-preferences"
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
import { cn } from "@/lib/utils"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  role: string
  contractType?: string
  weeklyHours?: number
  hourlyRate?: number
  startDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const getRoleBadgeColor = (role: string) => {
  const colors: Record<string, string> = {
    Serveur: "bg-chart-1 text-white border-chart-1",
    Barman: "bg-chart-2 text-white border-chart-2",
    Runner: "bg-chart-3 text-white border-chart-3",
    "Chef de rang": "bg-chart-4 text-white border-chart-4",
    Cuisine: "bg-chart-5 text-white border-chart-5",
  }
  return colors[role] || "bg-secondary"
}

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [employeeId, setEmployeeId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    params.then((p) => setEmployeeId(p.id))
  }, [params])

  useEffect(() => {
    if (!employeeId) return

    fetchEmployee()
  }, [employeeId])

  const fetchEmployee = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/employees/${employeeId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement")
      }

      setEmployee(data.employee)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
      router.push("/dashboard/employees")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!employee) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression")
      }

      toast.success("Employé supprimé avec succès")
      router.push("/dashboard/employees")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
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

  if (!employee) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6">
          <div className="p-12 border-2 border-destructive/20 rounded-xl text-center bg-destructive/5">
            <p className="text-destructive font-medium mb-4">Employé non trouvé</p>
            <Button asChild variant="outline">
              <Link href="/dashboard/employees">Retour aux employés</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const fullName = `${employee.firstName} ${employee.lastName}`
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase()
  const roleDisplay = employee.role.charAt(0).toUpperCase() + employee.role.slice(1)
  const contractDisplay = employee.contractType
    ?.replace("-", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()) || "Non spécifié"

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Button variant="ghost" asChild>
            <Link href="/dashboard/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20 bg-primary">
                        <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-2xl mb-2">{fullName}</CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={cn("text-sm", getRoleBadgeColor(roleDisplay))}>{roleDisplay}</Badge>
                          <Badge variant="outline" className="text-sm">
                            {contractDisplay}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline">
                        <Link href={`/dashboard/employees/${employee.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" disabled={isDeleting}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer cet employé ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. L'employé sera définitivement supprimé.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {employee.email && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{employee.email}</p>
                        </div>
                      </div>
                    )}

                    {employee.phone && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Téléphone</p>
                          <p className="font-medium">{employee.phone}</p>
                        </div>
                      </div>
                    )}

                    {employee.startDate && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date d'embauche</p>
                          <p className="font-medium">
                            {format(new Date(employee.startDate), "d MMMM yyyy")}
                          </p>
                        </div>
                      </div>
                    )}

                    {employee.weeklyHours && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Heures par semaine</p>
                          <p className="font-medium">{employee.weeklyHours}h</p>
                        </div>
                      </div>
                    )}

                    {employee.hourlyRate && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Taux horaire</p>
                          <p className="font-medium">{employee.hourlyRate}€</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rôle</p>
                        <p className="font-medium">{roleDisplay}</p>
                      </div>
                    </div>
                  </div>

                  {employee.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Notes</p>
                      <p className="text-sm bg-muted p-3 rounded-lg">{employee.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <NotificationPreferences
                employeeId={employee.id}
                email={employee.email}
                phone={employee.phone}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Créé le</span>
                    <span className="font-medium">
                      {format(new Date(employee.createdAt), "d MMM yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modifié le</span>
                    <span className="font-medium">
                      {format(new Date(employee.updatedAt), "d MMM yyyy")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

