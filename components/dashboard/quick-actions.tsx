"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Wand2, UserPlus, Download } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const actions = [
  {
    href: "/dashboard/schedules/new",
    icon: Plus,
    label: "Créer un planning",
    variant: "default" as const,
    delay: 0,
  },
  {
    href: "/dashboard/schedules/generate",
    icon: Wand2,
    label: "Générer avec l'IA",
    variant: "outline" as const,
    delay: 0.1,
  },
  {
    href: "/dashboard/employees/new",
    icon: UserPlus,
    label: "Ajouter un employé",
    variant: "outline" as const,
    delay: 0.2,
  },
  {
    href: "/dashboard/schedules",
    icon: Download,
    label: "Exporter les plannings",
    variant: "outline" as const,
    delay: 0.3,
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: action.delay }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full justify-start"
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
      </CardContent>
    </Card>
  )
}
