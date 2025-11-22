"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { motion } from "framer-motion"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scheduledDates, setScheduledDates] = useState<Set<string>>(new Set())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fetchScheduledDates()
  }, [currentDate])

  const fetchScheduledDates = async () => {
    try {
      // In production, fetch actual schedules for the current month
      const res = await fetch("/api/schedules")
      const data = await res.json()
      const schedules = data.schedules || []

      const datesWithSchedules = new Set<string>()
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)

      schedules.forEach((schedule: any) => {
        if (schedule.shifts) {
          schedule.shifts.forEach((shift: any) => {
            const shiftDate = new Date(shift.date)
            if (shiftDate >= monthStart && shiftDate <= monthEnd) {
              datesWithSchedules.add(format(shiftDate, "yyyy-MM-dd"))
            }
          })
        }
      })

      setScheduledDates(datesWithSchedules)
    } catch (error) {
      console.error("Error fetching scheduled dates:", error)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get first day of week for the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = getDay(monthStart)
  const daysBeforeMonth = Array.from({ length: firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1 }, (_, i) => null)

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const today = new Date()
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()

  const hasScheduleOnDate = (date: Date) => {
    if (!isClient) return false // Prevent hydration mismatch
    const dateKey = format(date, "yyyy-MM-dd")
    return scheduledDates.has(dateKey)
  }

  const weekDays = ["L", "M", "M", "J", "V", "S", "D"]

  return (
    <Card variant="glass" className="backdrop-blur-md border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 text-lg">
            <CalendarIcon className="h-4 w-4" />
            Calendrier
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          {format(currentDate, "MMMM yyyy", { locale: fr })}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {daysBeforeMonth.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {daysInMonth.map((date) => {
              const dateNum = date.getDate()
              const isToday =
                dateNum === todayDate &&
                date.getMonth() === todayMonth &&
                date.getFullYear() === todayYear
              const hasSchedule = hasScheduleOnDate(date)

              return (
                <motion.div
                  key={date.toString()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`aspect-square rounded-md text-center text-sm flex items-center justify-center cursor-pointer transition-colors relative ${
                    isToday
                      ? "bg-primary text-primary-foreground font-bold"
                      : hasSchedule
                        ? "bg-chart-1/20 text-foreground hover:bg-chart-1/30"
                        : "text-foreground hover:bg-muted"
                  }`}
                >
                  {dateNum}
                  {hasSchedule && !isToday && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-chart-1" />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-chart-1" />
              <span>Planning</span>
            </div>
            <Link href="/dashboard/schedules">
              <Button variant="outline" size="sm" className="text-xs h-7">
                Voir tout
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

