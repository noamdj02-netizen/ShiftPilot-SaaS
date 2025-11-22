"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Wand2, UserPlus, Download, Mail } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { EmployeeEmailComposer } from "./employee-email-composer"

const actions = [
  {
    href: "/dashboard/schedules/new",
    icon: Plus,
    label: "Créer un planning",
    variant: "default" as const,
    delay: 0,
    color: "bg-[#3b82f6] hover:bg-[#3b82f6]/90",
  },
  {
    href: "/dashboard/schedules/generate",
    icon: Wand2,
    label: "Générer avec l'IA",
    variant: "outline" as const,
    delay: 0.1,
    color: "border-[#FF7849] text-[#FF7849] hover:bg-[#FF7849]/10",
  },
  {
    href: "/dashboard/employees/new",
    icon: UserPlus,
    label: "Ajouter un employé",
    variant: "outline" as const,
    delay: 0.2,
    color: "border-[#3DAD7A] text-[#3DAD7A] hover:bg-[#3DAD7A]/10",
  },
  {
    href: "/dashboard/schedules",
    icon: Download,
    label: "Exporter les plannings",
    variant: "outline" as const,
    delay: 0.3,
    color: "border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10",
  },
]

export function QuickActions() {
  return (
    <Card variant="glass" className="hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-foreground">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: action.delay, 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className={`w-full justify-start shadow-sm hover:shadow-md transition-shadow ${action.color}`}
                variant={action.variant}
                asChild
              >
                <Link href={action.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Link>
              </Button>
            </motion.div>
          )
        })}
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.4, 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
        >
          <EmployeeEmailComposer />
        </motion.div>
      </CardContent>
    </Card>
  )
}
