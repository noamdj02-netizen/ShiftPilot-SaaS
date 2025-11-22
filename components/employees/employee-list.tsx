"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Mail, Phone, Edit, Trash2, Award, Loader2, Eye, Key } from "lucide-react"
import Link from "next/link"
import { GenerateCredentials } from "./generate-credentials"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { SkeletonCard } from "@/components/animations/skeleton-loader"

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
  createdAt: string
}

const mockEmployees = [
  {
    id: 1,
    name: "Marie Dubois",
    initials: "MD",
    role: "Serveur",
    email: "marie.dubois@restaurant.com",
    phone: "+33 6 12 34 56 78",
    contract: "CDI - 35h",
    status: "active",
    weeklyHours: 35,
    skills: ["Terrasse", "Bar", "Anglais"],
    availability: "Lun-Ven",
  },
  {
    id: 2,
    name: "Thomas Martin",
    initials: "TM",
    role: "Barman",
    email: "thomas.martin@restaurant.com",
    phone: "+33 6 23 45 67 89",
    contract: "CDI - 35h",
    status: "active",
    weeklyHours: 35,
    skills: ["Cocktails", "Vin", "Gestion stock"],
    availability: "Mar-Sam",
  },
  {
    id: 3,
    name: "Sophie Bernard",
    initials: "SB",
    role: "Runner",
    email: "sophie.bernard@restaurant.com",
    phone: "+33 6 34 56 78 90",
    contract: "Extra",
    status: "active",
    weeklyHours: 20,
    skills: ["Rapidité", "Polyvalent"],
    availability: "Ven-Dim",
  },
  {
    id: 4,
    name: "Lucas Petit",
    initials: "LP",
    role: "Chef de rang",
    email: "lucas.petit@restaurant.com",
    phone: "+33 6 45 67 89 01",
    contract: "CDI - 35h",
    status: "active",
    weeklyHours: 35,
    skills: ["Management", "Vin", "Anglais", "Italien"],
    availability: "Lun-Sam",
  },
  {
    id: 5,
    name: "Emma Lefebvre",
    initials: "EL",
    role: "Serveur",
    email: "emma.lefebvre@restaurant.com",
    phone: "+33 6 56 78 90 12",
    contract: "CDD - 25h",
    status: "active",
    weeklyHours: 25,
    skills: ["Salle", "Terrasse"],
    availability: "Mer-Dim",
  },
  {
    id: 6,
    name: "Antoine Rousseau",
    initials: "AR",
    role: "Serveur",
    email: "antoine.rousseau@restaurant.com",
    phone: "+33 6 67 89 01 23",
    contract: "CDI - 35h",
    status: "active",
    weeklyHours: 35,
    skills: ["Salle", "Bar", "Polyvalent"],
    availability: "Lun-Ven",
  },
]

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

interface EmployeeListProps {
  searchQuery?: string
  roleFilter?: string
  statusFilter?: string
}

export function EmployeeList({ searchQuery = "", roleFilter = "all", statusFilter = "active" }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      searchQuery === "" ||
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.phone?.includes(searchQuery)

    const matchesRole = roleFilter === "all" || employee.role === roleFilter

    // For now, all employees are considered active
    const matchesStatus = statusFilter === "all" || statusFilter === "active"

    return matchesSearch && matchesRole && matchesStatus
  })

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/employees")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement")
      }

      setEmployees(data.employees || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      return
    }

    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression")
      }

      toast.success("Employé supprimé avec succès")
      fetchEmployees() // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
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

  if (error && employees.length === 0) {
    return (
      <div className="p-6 border-2 border-destructive/20 rounded-xl text-center bg-destructive/5">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchEmployees} className="mt-4" variant="outline">
          Réessayer
        </Button>
      </div>
    )
  }

  if (employees.length === 0) {
    return (
      <div className="p-12 border-2 border-dashed border-border rounded-xl text-center">
        <p className="text-muted-foreground mb-4">Aucun employé pour le moment</p>
        <Button asChild>
          <a href="/dashboard/employees/new">Ajouter le premier employé</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {filteredEmployees.length === 0 && employees.length > 0 && (
        <div className="p-6 border-2 border-dashed border-border rounded-xl text-center">
          <p className="text-muted-foreground">Aucun employé ne correspond aux critères de recherche</p>
        </div>
      )}
      {filteredEmployees.map((employee, index) => {
        const fullName = `${employee.firstName} ${employee.lastName}`
        const initials = `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase()
        const roleDisplay = employee.role.charAt(0).toUpperCase() + employee.role.slice(1)
        const contractDisplay = employee.contractType
          ?.replace("-", " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()) || "Non spécifié"

        return (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
            whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.2 } }}
          >
            <Card variant="glass" className="p-6 hover:shadow-xl transition-all duration-300 border-border/50 backdrop-blur-md group">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 bg-primary">
                  <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{fullName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={cn("text-xs", getRoleBadgeColor(roleDisplay))}>{roleDisplay}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {contractDisplay}
                        </Badge>
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
                          <Link href={`/dashboard/employees/${employee.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir le profil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/employees/${employee.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(employee.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {employee.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate text-foreground">{employee.email}</span>
                      </div>
                    )}

                    {employee.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{employee.phone}</span>
                      </div>
                    )}

                    {employee.weeklyHours && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Heures/semaine: </span>
                        <span className="font-semibold text-foreground">{employee.weeklyHours}h</span>
                      </div>
                    )}

                    {employee.hourlyRate && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Taux horaire: </span>
                        <span className="font-semibold text-foreground">{employee.hourlyRate}€</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-border/50 mt-4">
                    <GenerateCredentials
                      employee={{
                        id: employee.id,
                        firstName: employee.firstName,
                        lastName: employee.lastName,
                        email: employee.email || "",
                        role: employee.role,
                        phone: employee.phone,
                      }}
                      onCredentialsGenerated={(credentials) => {
                        // Optionally update employee list or show success
                        toast.success(`Identifiants générés pour ${employee.firstName} ${employee.lastName}`)
                      }}
                    />
                    {employee.email && (
                      <Badge variant="outline" className="bg-accent-green/10 text-accent-green border-accent-green/20">
                        <Key className="h-3 w-3 mr-1" />
                        Identifiants activés
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
