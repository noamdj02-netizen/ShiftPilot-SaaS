"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns"
import { fr } from "date-fns/locale"

interface WeekSwitcherProps {
  currentDate?: Date
  onWeekChange?: (startDate: Date, endDate: Date) => void
}

export function WeekSwitcher({ currentDate = new Date(), onWeekChange }: WeekSwitcherProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const getWeekDates = (offset: number) => {
    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() + offset * 7)
    const start = startOfWeek(baseDate, { weekStartsOn: 1 })
    const end = endOfWeek(baseDate, { weekStartsOn: 1 })
    return { start, end }
  }

  const { start, end } = getWeekDates(weekOffset)
  const isCurrentWeek = weekOffset === 0

  const handlePreviousWeek = () => {
    setIsAnimating(true)
    setWeekOffset((prev) => prev - 1)
    const newDates = getWeekDates(weekOffset - 1)
    onWeekChange?.(newDates.start, newDates.end)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleNextWeek = () => {
    setIsAnimating(true)
    setWeekOffset((prev) => prev + 1)
    const newDates = getWeekDates(weekOffset + 1)
    onWeekChange?.(newDates.start, newDates.end)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleToday = () => {
    setIsAnimating(true)
    setWeekOffset(0)
    const newDates = getWeekDates(0)
    onWeekChange?.(newDates.start, newDates.end)
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg glass-premium border border-border/50 backdrop-blur-md">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePreviousWeek}
        disabled={isAnimating}
        className="h-9 w-9 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <AnimatePresence mode="wait">
        <motion.div
          key={weekOffset}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 min-w-[200px] justify-center"
        >
          <Calendar className="h-4 w-4 text-[#3b82f6]" />
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              {format(start, "d MMM", { locale: fr })} - {format(end, "d MMM yyyy", { locale: fr })}
            </p>
            {isCurrentWeek && (
              <p className="text-xs text-[#3DAD7A] font-medium">Semaine actuelle</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextWeek}
        disabled={isAnimating}
        className="h-9 w-9 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {!isCurrentWeek && (
        <Button
          variant="outline"
          onClick={handleToday}
          className="h-9 px-3 text-xs border-[#3DAD7A] text-[#3DAD7A] hover:bg-[#3DAD7A]/10"
        >
          Aujourd'hui
        </Button>
      )}
    </div>
  )
}

