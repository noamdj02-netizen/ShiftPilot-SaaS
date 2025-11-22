"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, UsersIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const mockShifts = [
  {
    id: 1,
    employee: "Marie Dubois",
    date: "2025-01-22",
    startTime: "12:00",
    endTime: "15:00",
    role: "Serveur",
    service: "Midi",
  },
  {
    id: 2,
    employee: "Thomas Martin",
    date: "2025-01-22",
    startTime: "19:00",
    endTime: "23:00",
    role: "Barman",
    service: "Soir",
  },
  {
    id: 3,
    employee: "Sophie Bernard",
    date: "2025-01-22",
    startTime: "12:00",
    endTime: "15:00",
    role: "Runner",
    service: "Midi",
  },
  {
    id: 4,
    employee: "Lucas Petit",
    date: "2025-01-22",
    startTime: "19:00",
    endTime: "23:00",
    role: "Serveur",
    service: "Soir",
  },
  {
    id: 5,
    employee: "Marie Dubois",
    date: "2025-01-23",
    startTime: "19:00",
    endTime: "23:00",
    role: "Serveur",
    service: "Soir",
  },
  {
    id: 6,
    employee: "Thomas Martin",
    date: "2025-01-23",
    startTime: "12:00",
    endTime: "15:00",
    role: "Barman",
    service: "Midi",
  },
  {
    id: 7,
    employee: "Emma Lefebvre",
    date: "2025-01-24",
    startTime: "12:00",
    endTime: "15:00",
    role: "Chef de rang",
    service: "Midi",
  },
  {
    id: 8,
    employee: "Sophie Bernard",
    date: "2025-01-24",
    startTime: "19:00",
    endTime: "23:00",
    role: "Runner",
    service: "Soir",
  },
  {
    id: 9,
    employee: "Lucas Petit",
    date: "2025-01-25",
    startTime: "12:00",
    endTime: "15:00",
    role: "Serveur",
    service: "Midi",
  },
  {
    id: 10,
    employee: "Marie Dubois",
    date: "2025-01-25",
    startTime: "19:00",
    endTime: "23:00",
    role: "Serveur",
    service: "Soir",
  },
]

const dates = [
  { date: "22", full: "2025-01-22", dayName: "Lun 22" },
  { date: "23", full: "2025-01-23", dayName: "Mar 23" },
  { date: "24", full: "2025-01-24", dayName: "Mer 24" },
  { date: "25", full: "2025-01-25", dayName: "Jeu 25" },
  { date: "26", full: "2025-01-26", dayName: "Ven 26" },
  { date: "27", full: "2025-01-27", dayName: "Sam 27" },
  { date: "28", full: "2025-01-28", dayName: "Dim 28" },
]

import { getRoleColor as getThemeRoleColor } from "@/lib/theme"

const getRoleColor = (role: string) => {
  const roleColor = getThemeRoleColor(role)
  // Map theme colors to Tailwind classes
  const colors: Record<string, string> = {
    "#3B82F6": "bg-blue-500 border-blue-500/40 text-white",
    "#FF7849": "bg-orange-500 border-orange-500/40 text-white",
    "#3DAD7A": "bg-green-500 border-green-500/40 text-white",
    "#991B1B": "bg-red-800 border-red-800/40 text-white",
    "#8B5CF6": "bg-purple-500 border-purple-500/40 text-white",
    "#DAA520": "bg-yellow-600 border-yellow-600/40 text-white",
  }
  
  // Use role-based color from theme
  if (roleColor in colors) {
    return colors[roleColor]
  }
  
  // Fallback to default mapping
  const defaultColors: Record<string, string> = {
    Serveur: "bg-blue-500 border-blue-500/40 text-white",
    Barman: "bg-orange-500 border-orange-500/40 text-white",
    Runner: "bg-green-500 border-green-500/40 text-white",
    "Chef de rang": "bg-purple-500 border-purple-500/40 text-white",
    Cuisine: "bg-red-800 border-red-800/40 text-white",
    Chef: "bg-purple-500 border-purple-500/40 text-white",
    Manager: "bg-yellow-600 border-yellow-600/40 text-white",
  }
  return defaultColors[role] || "bg-muted border-muted-foreground/20"
}

interface CalendarViewProps {
  schedule?: {
    id: string
    startDate: string
    endDate: string
    shifts: Array<{
      id: string
      employeeId: string
      employeeName?: string
      date: string
      startTime: string
      endTime: string
      role: string
      service?: "Midi" | "Soir"
    }>
  }
}

export function CalendarView({ schedule }: CalendarViewProps) {
  const [view, setView] = useState<"week" | "month">("week")
  const [employees, setEmployees] = useState<any[]>([])

  useEffect(() => {
    // Fetch employees to get names
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => {
        if (data.employees) {
          setEmployees(data.employees)
        }
      })
      .catch(() => {})
  }, [])

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId)
    return employee ? `${employee.firstName} ${employee.lastName}` : "Employé inconnu"
  }

  const getShiftsForDate = (date: string) => {
    if (!schedule?.shifts) return []
    return schedule.shifts
      .filter((shift) => shift.date === date)
      .map((shift) => ({
        ...shift,
        employee: shift.employeeName || getEmployeeName(shift.employeeId),
        service: shift.service || (shift.startTime < "15:00" ? "Midi" : "Soir"),
      }))
  }

  // Generate dates from schedule or use default
  const generateDates = () => {
    if (schedule) {
      const start = new Date(schedule.startDate)
      const end = new Date(schedule.endDate)
      const dates = []
      const current = new Date(start)

      while (current <= end) {
        dates.push({
          date: current.getDate().toString(),
          full: current.toISOString().split("T")[0],
          dayName: current.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }),
        })
        current.setDate(current.getDate() + 1)
      }
      return dates
    }
    return dates // Use default dates if no schedule
  }

  const displayDates = generateDates()

  return (
    <div className="space-y-4">
      <Card className="p-6 border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold text-lg">
              {schedule
                ? `${format(new Date(schedule.startDate), "d MMM")} - ${format(new Date(schedule.endDate), "d MMM yyyy")}`
                : "22 - 28 Janvier 2025"}
            </h3>
            <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("week")}
              className={view === "week" ? "bg-primary" : ""}
            >
              Semaine
            </Button>
            <Button
              variant={view === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("month")}
              className={view === "month" ? "bg-primary" : ""}
            >
              Mois
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {displayDates.map((day, dayIndex) => (
            <motion.div
              key={day.full}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.05 }}
              className={cn(
                "min-h-40 rounded-xl border-2 border-border p-3 transition-all hover:shadow-md",
                dayIndex >= 5 ? "bg-muted/30" : "bg-card",
              )}
            >
              <div className="text-sm font-semibold mb-3 text-center text-foreground">{day.dayName}</div>

              <div className="space-y-2">
                {getShiftsForDate(day.full).map((shift, shiftIndex) => (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + dayIndex * 0.05 + shiftIndex * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "rounded-lg px-2 py-1.5 text-xs cursor-pointer border-2 transition-all",
                      getRoleColor(shift.role),
                    )}
                  >
                    <div className="font-semibold truncate">{shift.employee}</div>
                    <div className="text-xs opacity-90 mt-0.5">
                      {shift.startTime} - {shift.endTime}
                    </div>
                    <div className="text-xs font-medium mt-1 opacity-90">{shift.role}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-3">Légende des rôles</p>
          <div className="flex flex-wrap gap-3">
            {[
              { role: "Serveur", color: "bg-chart-1" },
              { role: "Barman", color: "bg-chart-2" },
              { role: "Runner", color: "bg-chart-3" },
              { role: "Chef de rang", color: "bg-chart-4" },
              { role: "Cuisine", color: "bg-chart-5" },
            ].map((item) => (
              <div key={item.role} className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded", item.color)} />
                <span className="text-sm text-foreground">{item.role}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border">
        <h3 className="font-semibold text-lg mb-4 text-foreground">Statistiques de la semaine</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UsersIcon className="h-4 w-4" />
              <p className="text-sm">Total shifts</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{schedule?.shifts?.length || 0}</p>
            <p className="text-xs text-muted-foreground">
              {schedule?.shifts?.filter((s: any) => s.service === "Midi" || s.startTime < "15:00").length || 0} Midi •{" "}
              {schedule?.shifts?.filter((s: any) => s.service === "Soir" || s.startTime >= "15:00").length || 0} Soir
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UsersIcon className="h-4 w-4" />
              <p className="text-sm">Employés planifiés</p>
            </div>
            <p className="text-3xl font-bold text-foreground">6</p>
            <p className="text-xs text-muted-foreground">Unique staff members</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <p className="text-sm">Heures totales</p>
            </div>
            <p className="text-3xl font-bold text-foreground">40h</p>
            <p className="text-xs text-muted-foreground">Sur 42h prévues</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <p className="text-sm">Coût estimé</p>
            </div>
            <p className="text-3xl font-bold text-foreground">680€</p>
            <p className="text-xs text-muted-foreground">17€/heure moyen</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border">
        <h3 className="font-semibold text-lg mb-4 text-foreground">Liste détaillée des shifts</h3>

        {/* Service Midi */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-chart-1" />
            <h4 className="font-semibold text-foreground">Service Midi (12h-15h)</h4>
          </div>
          <div className="space-y-2">
            {(schedule?.shifts || mockShifts)
              .filter((s: any) => s.service === "Midi" || (!s.service && s.startTime < "15:00"))
              .map((shift: any) => (
                <motion.div
                  key={shift.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-sm text-muted-foreground font-medium">
                      {new Date(shift.date).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                    <div className="font-semibold text-foreground">{shift.employee}</div>
                    <Badge className={cn("text-xs", getRoleColor(shift.role))}>{shift.role}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-foreground">
                      {shift.startTime} - {shift.endTime}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {Number.parseInt(shift.endTime.split(":")[0]) - Number.parseInt(shift.startTime.split(":")[0])}h
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Service Soir */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-chart-2" />
            <h4 className="font-semibold text-foreground">Service Soir (19h-23h)</h4>
          </div>
          <div className="space-y-2">
            {(schedule?.shifts || mockShifts)
              .filter((s: any) => s.service === "Soir" || (!s.service && s.startTime >= "15:00"))
              .map((shift: any) => (
                <motion.div
                  key={shift.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-sm text-muted-foreground font-medium">
                      {new Date(shift.date).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                    <div className="font-semibold text-foreground">{shift.employee}</div>
                    <Badge className={cn("text-xs", getRoleColor(shift.role))}>{shift.role}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-foreground">
                      {shift.startTime} - {shift.endTime}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {Number.parseInt(shift.endTime.split(":")[0]) - Number.parseInt(shift.startTime.split(":")[0])}h
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Planning généré automatiquement avec les contraintes
            légales (11h de repos, coupure max 3h). Cliquez sur un shift pour modifier ou déplacer.
          </p>
        </div>
      </Card>
    </div>
  )
}
