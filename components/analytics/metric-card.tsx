"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: LucideIcon
  delay?: number
}

export function MetricCard({ label, value, change, changeType, icon: Icon, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card variant="glass" className="hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">{label}</CardTitle>
          <motion.div
            className="p-2 rounded-lg bg-primary/10 text-primary"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="h-4 w-4" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="text-2xl font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.1 }}
          >
            {value}
          </motion.div>
          <p
            className={`text-xs flex items-center gap-1 mt-1 font-medium ${
              changeType === "positive" 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {changeType === "positive" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change} par rapport à la période précédente
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

