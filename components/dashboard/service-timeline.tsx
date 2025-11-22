"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, UtensilsCrossed, Coffee, Moon } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TimelineEvent {
  id: string
  time: string
  label: string
  status: "upcoming" | "active" | "completed"
  service: "midi" | "soir" | "preparation"
}

const getServiceEvents = (): TimelineEvent[] => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute

  const events: TimelineEvent[] = [
    {
      id: "1",
      time: "11:00",
      label: "Préparation service midi",
      status: currentTime >= 11 * 60 ? (currentTime >= 12 * 60 ? "completed" : "active") : "upcoming",
      service: "preparation",
    },
    {
      id: "2",
      time: "12:00",
      label: "Coup de feu - Service Midi",
      status: currentTime >= 12 * 60 ? (currentTime >= 14 * 60 ? "completed" : "active") : "upcoming",
      service: "midi",
    },
    {
      id: "3",
      time: "14:00",
      label: "Fin de service midi",
      status: currentTime >= 14 * 60 ? "completed" : "upcoming",
      service: "midi",
    },
    {
      id: "4",
      time: "18:00",
      label: "Préparation service soir",
      status: currentTime >= 18 * 60 ? (currentTime >= 19 * 60 ? "completed" : "active") : "upcoming",
      service: "preparation",
    },
    {
      id: "5",
      time: "19:00",
      label: "Coup de feu - Service Soir",
      status: currentTime >= 19 * 60 ? (currentTime >= 22 * 60 ? "completed" : "active") : "upcoming",
      service: "soir",
    },
    {
      id: "6",
      time: "22:00",
      label: "Fin de service soir",
      status: currentTime >= 22 * 60 ? "completed" : "upcoming",
      service: "soir",
    },
  ]

  return events
}

const getServiceIcon = (service: TimelineEvent["service"]) => {
  switch (service) {
    case "midi":
      return <UtensilsCrossed className="h-4 w-4" />
    case "soir":
      return <Moon className="h-4 w-4" />
    default:
      return <Coffee className="h-4 w-4" />
  }
}

const getServiceColor = (service: TimelineEvent["service"]) => {
  switch (service) {
    case "midi":
      return "bg-[#3b82f6] border-[#3b82f6]/40"
    case "soir":
      return "bg-[#FF7849] border-[#FF7849]/40"
    default:
      return "bg-[#3DAD7A] border-[#3DAD7A]/40"
  }
}

export function ServiceTimeline() {
  const events = getServiceEvents()
  const activeEvent = events.find((e) => e.status === "active")

  return (
    <Card variant="glass" className="backdrop-blur-md border-border/50 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#3b82f6]" />
          Timeline du service
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border/50" />

          <div className="space-y-4">
            {events.map((event, index) => {
              const Icon = getServiceIcon(event.service)
              const isActive = event.status === "active"
              const isCompleted = event.status === "completed"

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg",
                        isActive
                          ? `${getServiceColor(event.service)} text-white`
                          : isCompleted
                            ? "bg-[#3DAD7A] border-[#3DAD7A]/40 text-white"
                            : "bg-muted border-border text-muted-foreground"
                      )}
                    >
                      {Icon}
                    </motion.div>
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={cn("absolute inset-0 rounded-full", getServiceColor(event.service).split(" ")[0])}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{event.time}</span>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-xs font-medium text-[#3b82f6]"
                        >
                          • En cours
                        </motion.span>
                      )}
                      {isCompleted && (
                        <span className="text-xs font-medium text-[#3DAD7A]">• Terminé</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{event.label}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {activeEvent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20"
          >
            <p className="text-sm font-medium text-foreground">
              Service actif : <span className="text-[#3b82f6]">{activeEvent.label}</span>
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

