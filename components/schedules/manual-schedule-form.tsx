"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface Employee {
  id: string
  firstName: string
  lastName: string
  role: string
}

interface ManualScheduleFormProps {
  scheduleId?: string
  existingSchedule?: {
    id: string
    name: string
    startDate: string
    endDate: string
    shifts: any[]
  }
}

export function ManualScheduleForm({ scheduleId, existingSchedule }: ManualScheduleFormProps = {}) {
  const router = useRouter()
  const [scheduleName, setScheduleName] = useState(existingSchedule?.name || "")
  const [startDate, setStartDate] = useState(existingSchedule?.startDate || "")
  const [endDate, setEndDate] = useState(existingSchedule?.endDate || "")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true)
  const [shifts, setShifts] = useState(
    existingSchedule?.shifts && existingSchedule.shifts.length > 0
      ? existingSchedule.shifts.map((shift, index) => ({
          id: index + 1,
          employeeId: shift.employeeId || "",
          date: shift.date || "",
          startTime: shift.startTime || "",
          endTime: shift.endTime || "",
          role: shift.role || "",
        }))
      : [{ id: 1, employeeId: "", date: "", startTime: "", endTime: "", role: "" }]
  )

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees")
      const data = await response.json()
      if (response.ok && data.employees) {
        setEmployees(data.employees)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setIsLoadingEmployees(false)
    }
  }

  const addShift = () => {
    setShifts([
      ...shifts,
      {
        id: Date.now(),
        employeeId: "",
        date: "",
        startTime: "",
        endTime: "",
        role: "",
      },
    ])
  }

  const removeShift = (id: number) => {
    setShifts(shifts.filter((shift) => shift.id !== id))
  }

  const updateShift = (id: number, field: string, value: string) => {
    setShifts(shifts.map((shift) => (shift.id === id ? { ...shift, [field]: value } : shift)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!scheduleName || !startDate || !endDate) {
        toast.error("Veuillez remplir tous les champs obligatoires")
        return
      }

      // If editing, use PUT, otherwise POST
      const url = scheduleId ? `/api/schedules/${scheduleId}` : "/api/schedules/create"
      const method = scheduleId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: scheduleName,
          startDate,
          endDate,
          shifts: shifts
            .filter((shift) => shift.employeeId && shift.date && shift.startTime && shift.endTime)
            .map((shift) => ({
              employeeId: shift.employeeId,
              date: shift.date,
              startTime: shift.startTime,
              endTime: shift.endTime,
              role: shift.role,
              service: shift.startTime < "15:00" ? "Midi" : "Soir",
            })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Erreur lors de la ${scheduleId ? "modification" : "création"}`)
      }

      toast.success(`Planning ${scheduleId ? "modifié" : "créé"} avec succès!`)
      router.push(`/dashboard/schedules/${scheduleId || data.scheduleId}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleName">Nom du planning</Label>
              <Input
                id="scheduleName"
                placeholder="Planning Semaine 5 - Janvier"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Shifts</Label>
              <Button type="button" size="sm" onClick={addShift}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un shift
              </Button>
            </div>

            <div className="space-y-4">
              {shifts.map((shift, index) => (
                <Card key={shift.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Shift {index + 1}</h4>
                      {shifts.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeShift(shift.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Employé</Label>
                        {isLoadingEmployees ? (
                          <div className="h-10 bg-muted animate-pulse rounded-md" />
                        ) : (
                          <Select
                            value={shift.employeeId}
                            onValueChange={(value) => {
                              const employee = employees.find((e) => e.id === value)
                              updateShift(shift.id, "employeeId", value)
                              if (employee) {
                                updateShift(shift.id, "role", employee.role)
                              }
                            }}
                            disabled={isLoading}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un employé" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map((emp) => (
                                <SelectItem key={emp.id} value={emp.id}>
                                  {emp.firstName} {emp.lastName} - {emp.role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Rôle</Label>
                        <Select
                          value={shift.role}
                          onValueChange={(value) => updateShift(shift.id, "role", value)}
                          disabled={isLoading}
                          required
                        >
                          <SelectTrigger>
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
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={shift.date}
                          onChange={(e) => updateShift(shift.id, "date", e.target.value)}
                          required
                          disabled={isLoading}
                          min={startDate}
                          max={endDate}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Début</Label>
                        <Input
                          type="time"
                          value={shift.startTime}
                          onChange={(e) => updateShift(shift.id, "startTime", e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Fin</Label>
                        <Input
                          type="time"
                          value={shift.endTime}
                          onChange={(e) => updateShift(shift.id, "endTime", e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : scheduleId ? (
                  "Enregistrer les modifications"
                ) : (
                  "Créer le planning"
                )}
              </Button>
            </motion.div>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
