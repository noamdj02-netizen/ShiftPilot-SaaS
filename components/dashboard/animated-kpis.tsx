"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, DollarSign, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/animations/animated-counter"

interface KPI {
  id: string
  label: string
  value: number
  suffix?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  trend?: number
}

const kpis: KPI[] = [
  {
    id: "1",
    label: "Staff présent aujourd'hui",
    value: 18,
    icon: Users,
    color: "text-[#3b82f6]",
    bgColor: "bg-[#3b82f6]/10",
    trend: 2,
  },
  {
    id: "2",
    label: "Taux de couverture",
    value: 89,
    suffix: "%",
    icon: TrendingUp,
    color: "text-[#3DAD7A]",
    bgColor: "bg-[#3DAD7A]/10",
    trend: 5,
  },
  {
    id: "3",
    label: "Coûts du personnel estimés",
    value: 2450,
    suffix: "€",
    icon: DollarSign,
    color: "text-[#FF7849]",
    bgColor: "bg-[#FF7849]/10",
    trend: -3,
  },
  {
    id: "4",
    label: "Satisfaction équipe",
    value: 4.7,
    suffix: "/5",
    icon: Clock,
    color: "text-[#8B5CF6]",
    bgColor: "bg-[#8B5CF6]/10",
    trend: 0.2,
  },
]

export function AnimatedKPIs() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <Card variant="glass" className="backdrop-blur-md border-border/50 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${kpi.bgColor} ${kpi.color} shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {kpi.trend !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        kpi.trend > 0
                          ? "bg-[#3DAD7A]/10 text-[#3DAD7A]"
                          : kpi.trend < 0
                            ? "bg-[#FF7849]/10 text-[#FF7849]"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {kpi.trend > 0 ? "+" : ""}
                      {kpi.trend}
                      {kpi.suffix?.includes("%") ? "%" : ""}
                    </motion.div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">
                    <AnimatedCounter value={kpi.value} duration={1.5} decimals={kpi.suffix?.includes("/") ? 1 : 0} className="inline" />
                    {kpi.suffix && <span className="text-lg text-muted-foreground ml-1">{kpi.suffix}</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

