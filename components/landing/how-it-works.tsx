"use client"

import { motion } from "framer-motion"
import { Sparkles, Users, Calendar, CheckCircle } from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

const steps = [
  {
    number: "01",
    title: "Configurez votre équipe",
    description: "Ajoutez vos employés, leurs rôles, disponibilités et compétences en quelques minutes.",
    icon: Users,
    color: "bg-chart-1",
  },
  {
    number: "02",
    title: "Définissez vos contraintes",
    description: "Indiquez vos besoins en staff, heures d'ouverture, et règles légales à respecter.",
    icon: Calendar,
    color: "bg-chart-2",
  },
  {
    number: "03",
    title: "Générez avec l'IA",
    description: "Notre intelligence artificielle crée le planning optimal en quelques secondes.",
    icon: Sparkles,
    color: "bg-chart-3",
  },
  {
    number: "04",
    title: "Publiez et partagez",
    description: "Envoyez le planning à votre équipe en un clic. Ils reçoivent une notification automatique.",
    icon: CheckCircle,
    color: "bg-chart-4",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">Comment ça marche ?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quatre étapes simples pour transformer votre gestion des plannings
          </p>
        </motion.div>

        <StaggerContainer className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <StaggerItem key={step.number}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="relative glass border border-border/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 backdrop-blur-md group"
                  >
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                      {step.number}
                    </div>
                    <div className={`${step.color} text-white w-16 h-16 rounded-xl flex items-center justify-center mb-4 mt-4`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                    )}
                  </motion.div>
                </StaggerItem>
              )
            })}
          </div>
        </StaggerContainer>
      </div>
    </section>
  )
}

