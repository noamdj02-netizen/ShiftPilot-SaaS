"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Calendar, UserPlus, RefreshCw, FileText } from "lucide-react"
import { motion } from "framer-motion"

const activities = [
  {
    id: 1,
    action: "Planning créé",
    description: "Planning de la semaine 4 généré automatiquement",
    time: "Il y a 2h",
    icon: Calendar,
    color: "text-[#FF7849]",
    bgColor: "bg-[#FF7849]/10",
  },
  {
    id: 2,
    action: "Employé ajouté",
    description: "Marie Dubois a été ajoutée à l'équipe",
    time: "Il y a 5h",
    icon: UserPlus,
    color: "text-[#3b82f6]",
    bgColor: "bg-[#3b82f6]/10",
  },
  {
    id: 3,
    action: "Shift échangé",
    description: "Thomas a échangé son shift avec Sophie",
    time: "Hier",
    icon: RefreshCw,
    color: "text-[#3DAD7A]",
    bgColor: "bg-[#3DAD7A]/10",
  },
  {
    id: 4,
    action: "Rapport généré",
    description: "Rapport mensuel de janvier disponible",
    time: "Hier",
    icon: FileText,
    color: "text-[#8B5CF6]",
    bgColor: "bg-[#8B5CF6]/10",
  },
]

export function RecentActivity() {
  return (
    <Card variant="glass" className="hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-foreground">Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.08, 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 20 
                }}
                whileHover={{ 
                  x: 4, 
                  scale: 1.01,
                  transition: { duration: 0.2 } 
                }}
                className="flex gap-4 group cursor-pointer p-2 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <motion.div
                  className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center transition-colors group-hover:scale-110`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={`h-5 w-5 ${activity.color}`} />
                </motion.div>
                <div className="flex-1 space-y-1">
                  <motion.p
                    className="font-medium text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    {activity.action}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
