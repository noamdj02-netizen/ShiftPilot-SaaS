"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Edit, Trash2, MapPin, Phone, Mail, Loader2, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Location {
  id: string
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  phone?: string
  email?: string
  timezone: string
  isActive: boolean
  settings: {
    defaultShiftDuration: number
    breakDuration: number
    minEmployeesPerShift: number
    maxEmployeesPerShift: number
  }
}

export function MultiLocationManager() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    phone: "",
    email: "",
    timezone: "Europe/Paris",
    settings: {
      defaultShiftDuration: 8,
      breakDuration: 0.5,
      minEmployeesPerShift: 2,
      maxEmployeesPerShift: 10,
    },
  })

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setIsFetching(true)
      const res = await fetch("/api/locations")
      const data = await res.json()
      if (data.success) {
        setLocations(data.locations || [])
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des établissements")
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = editingLocation ? `/api/locations/${editingLocation.id}` : "/api/locations"
      const method = editingLocation ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(
          editingLocation
            ? "Établissement mis à jour avec succès"
            : "Établissement créé avec succès"
        )
        setIsOpen(false)
        resetForm()
        fetchLocations()
      } else {
        toast.error(data.error || "Erreur")
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (locationId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet établissement ?")) {
      return
    }

    try {
      const res = await fetch(`/api/locations/${locationId}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Établissement supprimé")
        fetchLocations()
      } else {
        toast.error(data.error || "Erreur")
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
      phone: "",
      email: "",
      timezone: "Europe/Paris",
      settings: {
        defaultShiftDuration: 8,
        breakDuration: 0.5,
        minEmployeesPerShift: 2,
        maxEmployeesPerShift: 10,
      },
    })
    setEditingLocation(null)
  }

  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
      postalCode: location.postalCode,
      country: location.country,
      phone: location.phone || "",
      email: location.email || "",
      timezone: location.timezone,
      settings: location.settings,
    })
    setIsOpen(true)
  }

  return (
    <Card variant="glass" className="backdrop-blur-md border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-chart-1" />
              Multi-établissements
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Gérez vos différents établissements et restaurants
            </CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingLocation ? "Modifier l'établissement" : "Nouvel établissement"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Ajoutez un nouvel établissement à votre compte
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Nom <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Restaurant Principal"
                      required
                      className="bg-background text-foreground border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-foreground">
                      Ville <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Paris"
                      required
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-foreground">
                    Adresse <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Rue de la Paix"
                    required
                    className="bg-background text-foreground border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-foreground">
                      Code postal <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="75001"
                      required
                      className="bg-background text-foreground border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-foreground">
                      Pays
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+33 1 23 45 67 89"
                      className="bg-background text-foreground border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@restaurant.fr"
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <Label htmlFor="defaultShiftDuration" className="text-foreground">
                      Durée de shift par défaut (h)
                    </Label>
                    <Input
                      id="defaultShiftDuration"
                      type="number"
                      value={formData.settings.defaultShiftDuration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings,
                            defaultShiftDuration: parseInt(e.target.value) || 8,
                          },
                        })
                      }
                      className="bg-background text-foreground border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minEmployeesPerShift" className="text-foreground">
                      Employés min par shift
                    </Label>
                    <Input
                      id="minEmployeesPerShift"
                      type="number"
                      value={formData.settings.minEmployeesPerShift}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings,
                            minEmployeesPerShift: parseInt(e.target.value) || 2,
                          },
                        })
                      }
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false)
                      resetForm()
                    }}
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {editingLocation ? "Mettre à jour" : "Créer"}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">Aucun établissement</p>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un établissement
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg border border-border/50 bg-muted/30 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{location.name}</h3>
                      {location.isActive ? (
                        <Badge className="bg-accent-green/10 text-accent-green border-accent-green/20">
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="outline">Inactif</Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {location.address}, {location.postalCode} {location.city}
                      </div>
                      {location.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {location.phone}
                        </div>
                      )}
                      {location.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {location.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(location)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(location.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

