"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WeekSwitcher } from "./week-switcher"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { format, startOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

interface Shift {
  id: string
  employee: string
  role: string
  date: string
  startTime: string
  endTime: string
  service: "midi" | "soir"
}

const roleColors: Record<string, { bg: string; border: string; text: string }> = {
  Serveur: { bg: "bg-[#3b82f6]", border: "border-[#3b82f6]/40", text: "text-white" },
  Barman: { bg: "bg-[#FF7849]", border: "border-[#FF7849]/40", text: "text-white" },
  Runner: { bg: "bg-[#3DAD7A]", border: "border-[#3DAD7A]/40", text: "text-white" },
  Cuisine: { bg: "bg-[#991B1B]", border: "border-[#991B1B]/40", text: "text-white" },
  Chef: { bg: "bg-[#8B5CF6]", border: "border-[#8B5CF6]/40", text: "text-white" },
  Manager: { bg: "bg-[#DAA520]", border: "border-[#DAA520]/40", text: "text-white" },
}

const mockShifts: Shift[] = [
  {
    id: "1",
    employee: "Marie Dubois",
    role: "Serveur",
    date: new Date().toISOString().split("T")[0],
    startTime: "12:00",
    endTime: "15:00",
    service: "midi",
  },
  {
    id: "2",
    employee: "Thomas Martin",
    role: "Barman",
    date: new Date().toISOString().split("T")[0],
    startTime: "19:00",
    endTime: "23:00",
    service: "soir",
  },
  {
    id: "3",
    employee: "Sophie Bernard",
    role: "Runner",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "12:00",
    endTime: "15:00",
    service: "midi",
  },
]

export function ColoredShiftsCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: new Date(weekStart.getTime() + 6 * 86400000) })

  const getShiftsForDate = (date: Date) => {
    return mockShifts.filter((shift) => isSameDay(parseISO(shift.date), date))
  }

  const getRoleColor = (role: string) => {
    return roleColors[role] || roleColors.Serveur
  }

  return (
    <Card variant="glass" className="backdrop-blur-md border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-foreground flex items-center gap-2">
            <span>Shifts de la semaine</span>
          </CardTitle>
          <WeekSwitcher
            currentDate={currentWeek}
            onWeekChange={(start, end) => setCurrentWeek(start)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, dayIndex) => {
            const dayShifts = getShiftsForDate(day)
            const isToday = isSameDay(day, new Date())

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.05 }}
                className={cn(
                  "min-h-32 rounded-xl border-2 p-2 transition-all",
                  isToday
                    ? "border-[#3b82f6] bg-[#3b82f6]/5 shadow-md"
                    : "border-border/50 bg-card/50"
                )}
              >
                <div className="text-xs font-semibold mb-2 text-center text-foreground">
                  {format(day, "EEE d", { locale: fr })}
                </div>
                <div className="space-y-1.5">
                  {dayShifts.map((shift) => {
                    const colors = getRoleColor(shift.role)
                    return (
                      <motion.div
                        key={shift.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className={cn(
                          "rounded-lg px-2 py-1.5 text-xs cursor-pointer border-2 transition-all shadow-sm hover:shadow-md",
                          colors.bg,
                          colors.border,
                          colors.text
                        )}
                      >
                        <div className="font-semibold truncate">{shift.employee}</div>
                        <div className="text-xs opacity-90 mt-0.5">
                          {shift.startTime} - {shift.endTime}
                        </div>
                        <div className="text-xs font-medium mt-1 opacity-90">{shift.role}</div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-3">Légende des rôles</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(roleColors).map(([role, colors]) => (
              <div key={role} className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded shadow-sm", colors.bg)} />
                <span className="text-sm text-foreground font-medium">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

