"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { UpcomingShifts } from "@/components/dashboard/upcoming-shifts"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { motion } from "framer-motion"
import { PageTransition } from "@/components/animations/page-transition"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { OnboardingTour } from "@/components/onboarding/onboarding-tour"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { CommunicationWidget } from "@/components/dashboard/communication-widget"
import { MiniCalendar } from "@/components/dashboard/mini-calendar"
import { AlertsWidget } from "@/components/dashboard/alerts-widget"
import { SmartSuggestions } from "@/components/dashboard/smart-suggestions"
import { DraggableDashboard } from "@/components/dashboard/draggable-dashboard"
import { ResetLayoutButton } from "@/components/dashboard/reset-layout-button"
import { RealtimeDashboard } from "@/components/dashboard/realtime-dashboard"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [layoutKey, setLayoutKey] = useState(0)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bonjour"
    if (hour < 18) return "Bon après-midi"
    return "Bonsoir"
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Effects - Même style que le hero */}
        <AnimatedBackground opacity={0.2} />

        <DashboardHeader />

        <main className="container mx-auto px-4 py-6 space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between"
          >
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl lg:text-4xl font-bold text-foreground mb-2"
              >
                {getGreeting()} {user?.companyName?.split(" ")[0] || "Manager"} 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="text-muted-foreground"
              >
                {user?.companyName || "Votre établissement"} - Vue d'ensemble
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ResetLayoutButton onReset={() => setLayoutKey((k) => k + 1)} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <StatsCards />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 100 }}
          >
            <DashboardOverview />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="mb-6"
          >
            <RealtimeDashboard />
          </motion.div>

          <DraggableDashboard
            key={layoutKey}
            leftColumn={["upcoming-shifts", "recent-activity"]}
            rightColumn={["quick-actions", "communication", "alerts", "calendar", "suggestions"]}
            onLayoutChange={(left, right) => {
              // Layout saved automatically in localStorage
              console.log("Layout updated:", { left, right })
            }}
            children={{
              "upcoming-shifts": <UpcomingShifts />,
              "recent-activity": <RecentActivity />,
              "quick-actions": <QuickActions />,
              communication: <CommunicationWidget />,
              alerts: <AlertsWidget />,
              calendar: <MiniCalendar />,
              suggestions: <SmartSuggestions />,
            }}
          />
        </main>
        <OnboardingTour />
      </div>
    </PageTransition>
  )
}
