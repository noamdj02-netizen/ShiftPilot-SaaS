"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface AddEmployeeFormProps {
  employeeId?: string
  existingEmployee?: {
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
  }
}

export function AddEmployeeForm({ employeeId, existingEmployee }: AddEmployeeFormProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: existingEmployee?.firstName || "",
    lastName: existingEmployee?.lastName || "",
    email: existingEmployee?.email || "",
    phone: existingEmployee?.phone || "",
    role: existingEmployee?.role || "",
    contractType: existingEmployee?.contractType || "",
    weeklyHours: existingEmployee?.weeklyHours?.toString() || "",
    hourlyRate: existingEmployee?.hourlyRate?.toString() || "",
    startDate: existingEmployee?.startDate || "",
    notes: existingEmployee?.notes || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = employeeId ? `/api/employees/${employeeId}` : "/api/employees"
      const method = employeeId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          role: formData.role,
          contractType: formData.contractType || undefined,
          hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
          maxHoursPerWeek: formData.weeklyHours ? Number(formData.weeklyHours) : undefined,
          startDate: formData.startDate || undefined,
          notes: formData.notes || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'ajout de l'employé")
      }

      toast.success(employeeId ? "Employé modifié avec succès!" : "Employé ajouté avec succès!")
      router.push(employeeId ? `/dashboard/employees/${employeeId}` : "/dashboard/employees")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue"
      toast.error(errorMessage)
      console.error("Error adding employee:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                disabled={isLoading}
                required
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Serveur">Serveur</SelectItem>
                  <SelectItem value="Barman">Barman</SelectItem>
                  <SelectItem value="Runner">Runner</SelectItem>
                  <SelectItem value="Chef de rang">Chef de rang</SelectItem>
                  <SelectItem value="Cuisine">Cuisine</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractType">Type de contrat</Label>
              <Select
                value={formData.contractType}
                onValueChange={(value) => setFormData({ ...formData, contractType: value })}
                disabled={isLoading}
              >
                <SelectTrigger id="contractType">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cdi-full">CDI - Temps plein</SelectItem>
                  <SelectItem value="cdi-part">CDI - Temps partiel</SelectItem>
                  <SelectItem value="cdd-full">CDD - Temps plein</SelectItem>
                  <SelectItem value="cdd-part">CDD - Temps partiel</SelectItem>
                  <SelectItem value="intern">Stage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weeklyHours">Heures/semaine</Label>
              <Input
                id="weeklyHours"
                type="number"
                min="1"
                max="48"
                value={formData.weeklyHours}
                onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Taux horaire (€)</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Informations complémentaires..."
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {employeeId ? "Modification en cours..." : "Ajout en cours..."}
                </>
              ) : (
                employeeId ? "Modifier l'employé" : "Ajouter l'employé"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
