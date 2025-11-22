"use client"

import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/animations/animated-counter"
import { TrendingUp, Clock, Users, Zap } from "lucide-react"

const stats = [
  {
    value: 95,
    suffix: "%",
    label: "Gain de temps",
    description: "Réduction du temps de planification",
    icon: Clock,
    color: "text-chart-1",
  },
  {
    value: 10,
    suffix: "h",
    label: "Économisées par semaine",
    description: "Temps gagné en moyenne",
    icon: Zap,
    color: "text-chart-2",
  },
  {
    value: 500,
    suffix: "+",
    label: "Restaurants",
    description: "Nous font confiance",
    icon: Users,
    color: "text-chart-3",
  },
  {
    value: 4.9,
    suffix: "/5",
    label: "Satisfaction client",
    description: "Note moyenne",
    icon: TrendingUp,
    color: "text-chart-4",
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
            Des résultats qui parlent d'eux-mêmes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Les chiffres qui prouvent l'efficacité de ShiftPilot
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="glass border border-border/50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 backdrop-blur-md"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 ${stat.color}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold mb-2 text-foreground">
                  <AnimatedCounter value={stat.value} duration={2} />
                  <span>{stat.suffix}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1 text-foreground">{stat.label}</h3>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

