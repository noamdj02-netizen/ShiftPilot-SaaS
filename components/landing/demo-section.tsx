"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function DemoSection() {
  const [activeTab, setActiveTab] = useState<"calendar" | "stats" | "team">("calendar")

  return (
    <section id="demo" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">Découvrez ShiftPilot en action</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une interface intuitive pensée pour les professionnels de la restauration
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Card variant="glass" className="border-2 border-border/50 overflow-hidden shadow-2xl backdrop-blur-md hover:shadow-3xl transition-shadow duration-300">
            <div className="bg-muted/50 p-4 border-b border-border flex gap-2">
              {[
                { id: "calendar", label: "Calendrier", icon: Calendar },
                { id: "stats", label: "Statistiques", icon: Clock },
                { id: "team", label: "Équipe", icon: Users },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "bg-[#3b82f6] text-white shadow-md"
                        : "text-muted-foreground hover:text-[#3b82f6] hover:bg-[#3b82f6]/10"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </motion.button>
                )
              })}
            </div>

            <div className="p-8 bg-gradient-to-br from-card to-muted/20 min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === "calendar" && (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-7 gap-2">
                      {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => (
                        <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-[#3b82f6] rounded-lg p-3 text-white text-xs text-center shadow-sm"
                        >
                          <div className="font-semibold">Midi</div>
                          <div className="text-xs opacity-90">2-3 pers.</div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 + 0.2 }}
                          className="bg-[#FF7849] rounded-lg p-3 text-white text-xs text-center shadow-sm"
                        >
                          <div className="font-semibold">Soir</div>
                          <div className="text-xs opacity-90">3-4 pers.</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "stats" && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {[
                      { label: "Staff aujourd'hui", value: "18", color: "bg-[#3b82f6]" },
                      { label: "Heures/semaine", value: "684h", color: "bg-[#FF7849]" },
                      { label: "Couverture", value: "89%", color: "bg-[#3DAD7A]" },
                      { label: "Employés", value: "12", color: "bg-[#8B5CF6]" },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`${stat.color} rounded-xl p-6 text-white`}
                      >
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm opacity-90">{stat.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "team" && (
                  <motion.div
                    key="team"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {[
                      { name: "Marie Dubois", role: "Serveur", status: "active" },
                      { name: "Thomas Martin", role: "Barman", status: "active" },
                      { name: "Sophie Bernard", role: "Runner", status: "active" },
                    ].map((emp, i) => (
                      <motion.div
                        key={emp.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
                      >
                        <div>
                          <div className="font-semibold text-foreground">{emp.name}</div>
                          <div className="text-sm text-muted-foreground">{emp.role}</div>
                        </div>
                        <Badge variant="secondary" className="bg-[#3DAD7A]/10 text-[#3DAD7A] border border-[#3DAD7A]/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Actif
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

