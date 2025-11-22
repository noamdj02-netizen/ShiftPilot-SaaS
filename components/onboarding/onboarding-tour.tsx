"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, ArrowLeft, CheckCircle, Calendar, Users, BarChart3, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

interface Step {
  id: string
  title: string
  description: string
  target?: string // CSS selector for highlighting
  route?: string
  icon: React.ReactNode
}

const onboardingSteps: Step[] = [
  {
    id: "welcome",
    title: "Bienvenue sur ShiftPilot ! 👋",
    description:
      "Découvrez comment créer vos premiers plannings en quelques minutes. Nous allons vous guider étape par étape.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    id: "employees",
    title: "1. Ajoutez vos employés",
    description:
      "Commencez par créer votre équipe. Ajoutez les employés avec leurs rôles, disponibilités et compétences.",
    route: "/dashboard/employees/new",
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: "schedule",
    title: "2. Créez votre premier planning",
    description:
      "Générez un planning automatiquement avec l'IA ou créez-le manuellement. Choisissez vos dates et vos contraintes.",
    route: "/dashboard/schedules/generate",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    id: "analytics",
    title: "3. Consultez vos statistiques",
    description: "Suivez les heures travaillées, les coûts, et analysez les performances de votre équipe.",
    route: "/dashboard/analytics",
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    id: "settings",
    title: "4. Personnalisez vos paramètres",
    description:
      "Configurez vos notifications, votre entreprise, et personnalisez ShiftPilot selon vos besoins.",
    route: "/dashboard/settings",
    icon: <Settings className="h-6 w-6" />,
  },
  {
    id: "complete",
    title: "Vous êtes prêt ! 🎉",
    description:
      "Vous avez toutes les bases pour utiliser ShiftPilot. N'hésitez pas à explorer les différentes fonctionnalités !",
    icon: <CheckCircle className="h-6 w-6" />,
  },
]

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if onboarding has been completed
    const completed = localStorage.getItem("onboarding_completed")
    if (!completed) {
      setIsOpen(true)
    } else {
      setIsCompleted(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      const nextStep = onboardingSteps[currentStep + 1]
      if (nextStep.route) {
        router.push(nextStep.route)
      }
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = onboardingSteps[currentStep - 1]
      if (prevStep.route) {
        router.push(prevStep.route)
      }
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    localStorage.setItem("onboarding_completed", "true")
    setIsCompleted(true)
    setIsOpen(false)
  }

  const handleRestart = () => {
    localStorage.removeItem("onboarding_completed")
    setCurrentStep(0)
    setIsCompleted(false)
    setIsOpen(true)
  }

  if (isCompleted && !isOpen) {
    return null
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleRestart}
        className="fixed bottom-4 right-4 z-50 glass backdrop-blur-md"
      >
        Reprendre le guide
      </Button>
    )
  }

  const step = onboardingSteps[currentStep]
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass border border-border/50 rounded-2xl p-6 max-w-md w-full backdrop-blur-md shadow-2xl relative"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={handleSkip}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="p-2 rounded-lg bg-primary/10 text-primary"
              >
                {step.icon}
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">Étape {currentStep + 1} sur {onboardingSteps.length}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-chart-1 to-chart-2 rounded-full"
                />
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{step.description}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleSkip}>
                Passer
              </Button>
              <Button onClick={handleNext}>
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    Terminer
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

