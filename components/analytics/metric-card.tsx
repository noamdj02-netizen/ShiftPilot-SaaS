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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p
            className={`text-xs flex items-center gap-1 mt-1 ${
              changeType === "positive" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
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

