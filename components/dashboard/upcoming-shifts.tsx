"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock } from "lucide-react"
import { motion } from "framer-motion"

const upcomingShifts = [
  {
    id: 1,
    employee: "Marie Dubois",
    initials: "MD",
    role: "Caissière",
    date: "Aujourd'hui",
    time: "14:00 - 22:00",
    status: "confirmed",
  },
  {
    id: 2,
    employee: "Thomas Martin",
    initials: "TM",
    role: "Manager",
    date: "Demain",
    time: "09:00 - 17:00",
    status: "confirmed",
  },
  {
    id: 3,
    employee: "Sophie Bernard",
    initials: "SB",
    role: "Vendeuse",
    date: "Demain",
    time: "10:00 - 18:00",
    status: "pending",
  },
  {
    id: 4,
    employee: "Lucas Petit",
    initials: "LP",
    role: "Stock",
    date: "Mar 21 Jan",
    time: "06:00 - 14:00",
    status: "confirmed",
  },
]

export function UpcomingShifts() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Prochains shifts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingShifts.map((shift, index) => (
            <motion.div
              key={shift.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
              className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 hover:shadow-sm transition-all cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Avatar className="ring-2 ring-background">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {shift.initials}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="flex-1 min-w-0">
                <motion.p
                  className="font-medium truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                >
                  {shift.employee}
                </motion.p>
                <p className="text-sm text-muted-foreground">{shift.role}</p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {shift.time}
                </div>
                <p className="text-sm font-medium mt-1">{shift.date}</p>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
              >
                <Badge
                  variant={shift.status === "confirmed" ? "default" : "secondary"}
                  className="whitespace-nowrap"
                >
                  {shift.status === "confirmed" ? "Confirmé" : "En attente"}
                </Badge>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
