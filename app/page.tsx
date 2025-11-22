"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Clock, TrendingUp, Shield, ArrowRight, Sparkles, Play, Zap, Calendar, Building2, FileText } from "lucide-react"
import { Logo } from "@/components/logo/logo"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { StatsSection } from "@/components/landing/stats-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FAQSection } from "@/components/landing/faq-section"
import { DemoSection } from "@/components/landing/demo-section"
import { TextReveal } from "@/components/animations/text-reveal"
import { MagneticButton } from "@/components/animations/magnetic-button"

export default function LandingPage() {
  return (
    <div className="min-h-screen premium-restaurant-bg relative overflow-hidden">
      {/* Premium Background decorations - Subtle & Elegant */}
      <div className="fixed inset-0 opacity-40 pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF7849] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.3, 0.2],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3DAD7A] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#3b82f6] rounded-full blur-3xl"
        />
      </div>
      
      <header className="sticky top-0 z-50 glass border-b border-border/50 shadow-lg backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo href="/" />
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "#features", label: "Fonctionnalités" },
              { href: "#demo", label: "Démo" },
              { href: "#before-after", label: "Avant/Après" },
              { href: "#pricing", label: "Tarifs" },
            ].map((link) => (
              <motion.div key={link.href} whileHover={{ y: -2 }}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" asChild>
                <Link href="/auth-select">Connexion</Link>
              </Button>
            </motion.div>
            <MagneticButton strength={0.15}>
              <Button className="bg-[#FF7849] hover:bg-[#FF7849]/90 text-white shadow-lg hover:shadow-xl transition-all" asChild>
                <Link href="/auth-select">Essayer gratuitement</Link>
              </Button>
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* Hero Section - Redesign Complet */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-chart-1 rounded-full blur-3xl opacity-20"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="space-y-8"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium text-foreground border border-border/50 shadow-lg backdrop-blur-md group"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                  </motion.div>
                  <span>Spécialement conçu pour la restauration</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </motion.div>
                </motion.div>

                {/* Main Title */}
                <div className="space-y-4">
                  <TextReveal
                    text="Planification intelligente pour restaurants"
                    className="text-5xl lg:text-6xl xl:text-7xl font-bold text-balance text-foreground leading-tight"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="flex items-center gap-3 text-lg lg:text-xl text-muted-foreground"
                  >
                    <div className="h-1 w-12 bg-gradient-to-r from-[#3DAD7A] via-[#3b82f6] to-[#FF7849] rounded-full shadow-sm" />
                    <span>Solution complète pour managers, serveurs et équipes F&B</span>
                  </motion.div>
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl"
                >
                  Créez vos plannings en <span className="font-semibold text-foreground">quelques secondes</span>, optimisez vos services midi et soir, éliminez les sous-effectifs. 
                  <span className="block mt-2">Gagnez du temps, réduisez les erreurs, améliorez la satisfaction de votre équipe.</span>
                </motion.p>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="grid grid-cols-2 gap-4 max-w-xl"
                >
                  {[
                    { label: "Temps gagné", value: "95%", icon: Clock, color: "text-[#3DAD7A]", bgColor: "bg-[#3DAD7A]/10" },
                    { label: "Erreurs évitées", value: "100%", icon: Shield, color: "text-[#3b82f6]", bgColor: "bg-[#3b82f6]/10" },
                    { label: "Satisfaction", value: "4.9/5", icon: TrendingUp, color: "text-[#FF7849]", bgColor: "bg-[#FF7849]/10" },
                    { label: "Restaurants", value: "500+", icon: Users, color: "text-[#8B5CF6]", bgColor: "bg-[#8B5CF6]/10" },
                  ].map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className="glass border border-border/50 rounded-xl p-4 backdrop-blur-md hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color} shadow-sm`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        </div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </motion.div>
                    )
                  })}
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4"
                >
                  <MagneticButton strength={0.2}>
                    <Button size="lg" className="bg-[#FF7849] hover:bg-[#FF7849]/90 text-white text-lg px-8 h-14 shadow-xl hover:shadow-2xl transition-all" asChild>
                      <Link href="/signup">
                        Commencer gratuitement
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </MagneticButton>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="glass" className="text-lg px-8 h-14 border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 backdrop-blur-md hover:shadow-xl transition-all" asChild>
                      <Link href="#demo">
                        <Play className="mr-2 h-5 w-5" />
                        Voir la démo
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex flex-wrap items-center gap-3 pt-2"
                >
                  {[
                    { icon: Shield, text: "14 jours gratuits" },
                    { icon: CheckCircle, text: "Sans carte bancaire" },
                    { icon: Sparkles, text: "Annulation à tout moment" },
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1 + i * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 glass px-3 py-1.5 rounded-full text-sm text-foreground border border-border/50 backdrop-blur-sm"
                      >
                        <Icon className="h-4 w-4 text-accent-green" />
                        <span>{item.text}</span>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </motion.div>

              {/* Right Column - Visual Dashboard Preview */}
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="relative lg:h-[600px]"
              >
                {/* Dashboard Mockup Card */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="glass border-2 border-border/50 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden group h-full"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex items-center gap-2 glass px-3 py-1 rounded-lg border border-border/50 backdrop-blur-sm">
                      <Calendar className="h-4 w-4 text-foreground" />
                      <span className="text-sm font-medium text-foreground">Semaine 4 - Janvier</span>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="space-y-4">
                    {/* Days Header */}
                    <div className="grid grid-cols-7 gap-2">
                      {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, i) => (
                        <motion.div
                          key={day}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                          className="text-center font-medium text-sm text-muted-foreground"
                        >
                          {day}
                        </motion.div>
                      ))}
                    </div>

                    {/* Services Grid */}
                    <div className="space-y-3">
                      {[
                        { name: "Service Midi", color: "bg-[#3b82f6]", hours: "11h-15h", people: 2 },
                        { name: "Service Soir", color: "bg-[#FF7849]", hours: "19h-23h", people: 4 },
                        { name: "Bar", color: "bg-[#3DAD7A]", hours: "17h-01h", people: 2 },
                      ].map((service, serviceIndex) => (
                        <div key={service.name} className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-3 h-3 rounded-full ${service.color} shadow-sm`} />
                            <span className="text-xs font-medium text-foreground">{service.name}</span>
                          </div>
                          <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 7 }).map((_, dayIndex) => (
                              <motion.div
                                key={dayIndex}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                  delay: 0.7 + serviceIndex * 0.1 + dayIndex * 0.03,
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 25
                                }}
                                whileHover={{ scale: 1.05, z: 10 }}
                                whileTap={{ scale: 0.98 }}
                                className={`${service.color} rounded-lg p-2 text-white text-[10px] flex flex-col items-center justify-center min-h-[60px] hover:shadow-xl transition-shadow duration-200 cursor-pointer group/cell`}
                              >
                                <div className="font-semibold">{service.people}-{service.people + 1}</div>
                                <div className="opacity-80 text-[9px]">{service.hours.split('-')[0]}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Stats Footer */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="flex items-center justify-between pt-4 mt-4 border-t border-border/50 glass px-4 py-3 rounded-xl backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Heures totales</div>
                          <div className="font-bold text-foreground">420h</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Employés</div>
                          <div className="font-bold text-foreground">12</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Conformité</div>
                          <div className="font-bold text-accent-green flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            100%
                          </div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="glass px-3 py-1.5 rounded-lg border border-border/50 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-accent-green"
                          />
                          <span className="text-foreground font-medium">Généré en 5s</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 glass px-3 py-2 rounded-lg border border-border/50 backdrop-blur-sm shadow-lg z-10"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <Zap className="h-3 w-3 text-chart-2" />
                    <span className="font-medium text-foreground">IA Active</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 glass px-3 py-2 rounded-lg border border-border/50 backdrop-blur-sm shadow-lg z-10"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-accent-green" />
                    <span className="font-medium text-foreground">100% Conforme</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      <DemoSection />

      <section id="before-after" className="py-20 bg-muted/30 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium mb-6 text-foreground border border-border/50 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Transformation</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">Avant / Après ShiftPilot</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance mb-8">
              Abandonnez les outils inadaptés pour une solution pensée pour vos besoins. Voyez la différence en chiffres.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl mx-auto">
              {[
                { label: "Gain de temps", value: "95%", color: "text-[#3DAD7A]", bgColor: "bg-[#3DAD7A]/10", borderColor: "border-[#3DAD7A]/30" },
                { label: "Erreurs évitées", value: "100%", color: "text-[#3b82f6]", bgColor: "bg-[#3b82f6]/10", borderColor: "border-[#3b82f6]/30" },
                { label: "Satisfaction équipe", value: "+80%", color: "text-[#FF7849]", bgColor: "bg-[#FF7849]/10", borderColor: "border-[#FF7849]/30" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`glass px-6 py-4 rounded-xl border-2 ${stat.borderColor} backdrop-blur-sm text-center ${stat.bgColor} shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-sm font-medium text-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="glass border-2 border-[#991B1B]/50 rounded-2xl p-8 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-[#991B1B]/5 to-card/80"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#991B1B] shadow-sm"></div>
                <div className="text-[#991B1B] font-bold text-sm">AVANT</div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Excel + WhatsApp</h3>
              <ul className="space-y-4">
                {[
                  "2h pour faire un planning par semaine",
                  "Erreurs de saisie constantes",
                  "Conflits d'horaires non détectés",
                  "Messages WhatsApp sans fin",
                  "Temps de travail non comptabilisé",
                  "Stress permanent du manager",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground">
                    <div className="h-5 w-5 rounded-full bg-[#991B1B]/20 border-2 border-[#991B1B]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#991B1B] text-xs font-bold">✕</span>
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ scale: 1.02, x: -4 }}
              className="glass border-2 border-[#3DAD7A]/50 rounded-2xl p-8 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-[#3DAD7A]/5 to-card/80"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#3DAD7A] shadow-sm"></div>
                <div className="text-[#3DAD7A] font-bold text-sm">APRÈS</div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">Avec ShiftPilot</h3>
              <ul className="space-y-4">
                {[
                  "5 minutes pour générer un planning",
                  "Zéro erreur de calcul",
                  "Conflits détectés automatiquement",
                  "Équipe notifiée en 1 clic",
                  "Suivi temps réel des heures",
                  "Sérénité retrouvée",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground">
                    <div className="h-5 w-5 rounded-full bg-[#3DAD7A]/20 border-2 border-[#3DAD7A]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-[#3DAD7A]" />
                    </div>
                    <span className="font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium mb-6 text-foreground border border-border/50 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Fonctionnalités complètes</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Fonctionnalités pensées pour le service
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance mb-8">
              Chaque détail a été conçu pour les réalités de la restauration. Découvrez comment ShiftPilot transforme votre gestion quotidienne.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline" className="glass border-border/50 backdrop-blur-sm">
                <Clock className="h-3 w-3 mr-1" />
                Temps réel
              </Badge>
              <Badge variant="outline" className="glass border-border/50 backdrop-blur-sm">
                <Shield className="h-3 w-3 mr-1" />
                Sécurisé
              </Badge>
              <Badge variant="outline" className="glass border-border/50 backdrop-blur-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                Automatisé
              </Badge>
              <Badge variant="outline" className="glass border-border/50 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                IA intégrée
              </Badge>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            <FeatureCard
              icon={<Sparkles className="h-8 w-8" />}
              title="Planning assisté par IA"
              description="Notre intelligence artificielle génère automatiquement le planning optimal en analysant vos contraintes, l'affluence prévue et les compétences de votre équipe."
              details={["Génération en quelques secondes", "Optimisation automatique des coûts", "Respect des contraintes légales"]}
              color="bg-[#FF7849]"
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Optimisation des coûts"
              description="Réduisez vos coûts de personnel jusqu'à 20% en optimisant automatiquement la répartition des heures et en évitant les sur-effectifs."
              details={["Analyse des coûts en temps réel", "Suggestions d'optimisation", "Prédiction budgétaire"]}
              color="bg-[#3DAD7A]"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Anti-rupture équipe"
              description="Détectez et prévenez automatiquement les sous-effectifs. Recevez des alertes intelligentes avant qu'il ne soit trop tard."
              details={["Alertes proactives", "Détection des manques", "Suggestions de remplacement"]}
              color="bg-[#3b82f6]"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Gestion live des absences"
              description="Gérez les absences en temps réel. Réorganisez automatiquement les shifts et notifiez votre équipe instantanément."
              details={["Gestion immédiate", "Réorganisation automatique", "Notifications instantanées"]}
              color="bg-[#8B5CF6]"
            />
            <FeatureCard
              icon={<Building2 className="h-8 w-8" />}
              title="Multi-sites & multi-postes"
              description="Gérez plusieurs établissements et postes depuis un seul tableau de bord. Parfait pour les chaînes et groupes."
              details={["Gestion centralisée", "Synchronisation multi-sites", "Vue d'ensemble globale"]}
              color="bg-[#DAA520]"
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8" />}
              title="Export PDF du planning"
              description="Exportez vos plannings en PDF professionnel, prêts à être affichés ou envoyés. Format personnalisable avec votre logo."
              details={["Export PDF haute qualité", "Personnalisation logo", "Envoi automatique par email"]}
              color="bg-[#991B1B]"
            />
          </div>

          {/* Additional features showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="max-w-4xl mx-auto glass border border-border/50 rounded-2xl p-8 backdrop-blur-md shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground text-center">Et bien plus encore...</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <ArrowRight className="h-5 w-5" />, text: "Notifications automatiques par email et SMS" },
                { icon: <ArrowRight className="h-5 w-5" />, text: "Export PDF et iCal pour vos employés" },
                { icon: <ArrowRight className="h-5 w-5" />, text: "Historique complet des plannings" },
                { icon: <ArrowRight className="h-5 w-5" />, text: "Analytics détaillées des heures travaillées" },
                { icon: <ArrowRight className="h-5 w-5" />, text: "Gestion des remplacements et échanges" },
                { icon: <ArrowRight className="h-5 w-5" />, text: "Application mobile pour vos employés" },
                { icon: <ArrowRight className="h-5 w-5" />, text: "Multi-établissements (selon formule)" },
                { icon: <ArrowRight className="h-5 w-5" />, text: "Support prioritaire inclus" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <div className="text-primary">{feature.icon}</div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-muted/30 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium mb-6 text-foreground border border-border/50 backdrop-blur-sm">
              <Users className="h-4 w-4" />
              <span>Témoignages clients</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Utilisé par les meilleurs établissements
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Ce que disent les managers qui nous font confiance. Découvrez comment ShiftPilot transforme leur quotidien.
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.svg
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="w-6 h-6 fill-chart-2 text-chart-2"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </motion.svg>
              ))}
              <span className="ml-2 text-sm font-medium text-foreground">4.9/5 sur 500+ avis</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote:
                  "ShiftPilot nous fait gagner 10h par semaine sur la gestion des plannings. Un gain de sérénité incroyable. L'IA comprend vraiment nos contraintes de service.",
                author: "Marie Dubois",
                role: "Manager - Brasserie Le Central, Paris",
                rating: 5,
                image: "MD",
                stats: "10h/semaine économisées • 15 employés",
              },
              {
                quote:
                  "Fini les conflits d'horaires et les heures sup non comptées. Tout est transparent et automatisé. Mon équipe est plus sereine et moi aussi !",
                author: "Thomas Laurent",
                role: "Propriétaire - Bistrot Moderne, Lyon",
                rating: 5,
                image: "TL",
                stats: "100% de conformité • 25 employés",
              },
              {
                quote:
                  "L'équipe adore pouvoir indiquer ses dispos et recevoir le planning directement. Zéro WhatsApp, zéro stress. C'est exactement ce qu'il nous fallait.",
                author: "Sophie Martin",
                role: "Cheffe de rang - Restaurant Le Jardin, Nice",
                rating: 5,
                image: "SM",
                stats: "98% satisfaction équipe • 12 employés",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="glass border border-border/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group backdrop-blur-md"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500 blur-xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <motion.svg
                        key={j}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.15 + j * 0.1 }}
                        className="w-5 h-5 fill-chart-2 text-chart-2"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </motion.svg>
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed text-lg italic relative">
                    <span className="text-4xl font-bold text-primary/20 absolute -top-2 -left-2">"</span>
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-lg"
                    >
                      {testimonial.image}
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      {testimonial.stats && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-accent-green" />
                          {testimonial.stats}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium mb-6 text-foreground border border-border/50 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Tarification simple</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">Tarifs transparents</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Adapté à la taille de votre établissement. Tous les plans incluent l'essai gratuit de 14 jours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-12">
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-accent-green" />
                <span>Pas de frais cachés</span>
              </div>
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-accent-green" />
                <span>Annulation à tout moment</span>
              </div>
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-accent-green" />
                <span>Mise à niveau gratuite</span>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <PricingCard
              name="Petit Resto"
              price="59"
              description="Idéal pour cafés et petits restaurants"
              features={["Jusqu'à 15 employés", "Planning midi & soir", "Génération IA basique", "Support email"]}
              savings="Économisez 10h/semaine"
              color="bg-[#3b82f6]"
              borderColor="border-[#3b82f6]/50"
            />
            <PricingCard
              name="Brasserie"
              price="129"
              description="Pour établissements moyens"
              features={[
                "Jusqu'à 50 employés",
                "Multi-établissements (2 lieux)",
                "IA avancée + analytics",
                "Support prioritaire",
              ]}
              popular
              savings="Économisez 20h/semaine"
              color="bg-[#FF7849]"
              borderColor="border-[#FF7849]/50"
            />
            <PricingCard
              name="Groupe"
              price="Sur devis"
              description="Pour chaînes et grands groupes"
              features={[
                "Employés illimités",
                "Multi-établissements illimité",
                "IA personnalisée",
                "Support dédié 24/7",
              ]}
              savings="ROI sur mesure"
              color="bg-[#8B5CF6]"
              borderColor="border-[#8B5CF6]/50"
            />
          </div>

          {/* Tableau de comparaison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass border border-border/50 rounded-2xl p-8 backdrop-blur-md max-w-6xl mx-auto overflow-x-auto"
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground text-center">Comparaison détaillée des plans</h3>
            <div className="min-w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Fonctionnalités</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground">Petit Resto</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground bg-[#FF7849]/10 border-2 border-[#FF7849]/30">Brasserie</th>
                    <th className="text-center py-4 px-4 font-semibold text-foreground">Groupe</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Nombre d'employés", starter: "Jusqu'à 15", pro: "Jusqu'à 50", enterprise: "Illimité", proColor: "text-[#FF7849]" },
                    { feature: "Plannings mensuels", starter: "Illimité", pro: "Illimité", enterprise: "Illimité", proColor: "text-[#FF7849]" },
                    { feature: "Génération IA", starter: "Basique", pro: "Avancée", enterprise: "Personnalisée", proColor: "text-[#FF7849] font-semibold" },
                    { feature: "Multi-établissements", starter: "—", pro: "2 lieux", enterprise: "Illimité", proColor: "text-[#FF7849]" },
                    { feature: "Analytics & Rapports", starter: "—", pro: "✓", enterprise: "✓ Premium", proColor: "text-[#3DAD7A]" },
                    { feature: "Export PDF/iCal", starter: "✓", pro: "✓", enterprise: "✓ + Excel", proColor: "text-[#3DAD7A]" },
                    { feature: "Templates de plannings", starter: "3", pro: "Illimité", enterprise: "Illimité", proColor: "text-[#FF7849] font-semibold" },
                    { feature: "Notifications Email/SMS", starter: "✓", pro: "✓", enterprise: "✓ Premium", proColor: "text-[#3DAD7A]" },
                    { feature: "Support", starter: "Email", pro: "Prioritaire", enterprise: "Dédié 24/7", proColor: "text-[#FF7849] font-semibold" },
                    { feature: "Intégrations", starter: "—", pro: "Google Calendar", enterprise: "Toutes les APIs", proColor: "text-[#3b82f6]" },
                  ].map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4 text-foreground font-medium">{row.feature}</td>
                      <td className="py-4 px-4 text-center text-muted-foreground">{row.starter}</td>
                      <td className={`py-4 px-4 text-center font-semibold bg-[#FF7849]/5 ${row.proColor || "text-foreground"}`}>{row.pro}</td>
                      <td className="py-4 px-4 text-center text-foreground">{row.enterprise}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 text-center">
              <MagneticButton strength={0.15}>
                <Button size="lg" className="bg-[#FF7849] hover:bg-[#FF7849]/90 text-white shadow-lg hover:shadow-xl transition-all" asChild>
                  <Link href="/signup">Commencer l'essai gratuit</Link>
                </Button>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <HowItWorks />

      <FAQSection />

      <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-20 left-20 w-64 h-64 border-2 border-current rounded-full"
          />
          <motion.div
            animate={{ 
              rotate: [0, -360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute bottom-40 right-20 w-48 h-48 border-2 border-current rounded-lg"
          />
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-1/2 left-1/3 w-32 h-32 border-2 border-current rounded-full"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold mb-6 text-balance"
            >
              Reprenez le contrôle de vos plannings
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-6 text-balance opacity-90 max-w-2xl mx-auto leading-relaxed"
            >
              Rejoignez les centaines de restaurants qui gagnent du temps chaque semaine avec ShiftPilot
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-10 text-sm opacity-90"
            >
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-primary-foreground/20 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4" />
                <span>500+ restaurants</span>
              </div>
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-primary-foreground/20 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4" />
                <span>10h économisées/semaine</span>
              </div>
              <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-primary-foreground/20 backdrop-blur-sm">
                <CheckCircle className="h-4 w-4" />
                <span>4.9/5 satisfaction</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <MagneticButton strength={0.15}>
                <Button size="lg" className="bg-[#3DAD7A] hover:bg-[#3DAD7A]/90 text-white text-lg px-8 h-14 shadow-lg hover:shadow-xl transition-all" asChild>
                  <Link href="/signup">
                    Essayer 14 jours gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 glass backdrop-blur-md relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <Logo size="sm" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                La planification intelligente pour les professionnels de la restauration.
              </p>
              <div className="flex items-center gap-3">
                {["Twitter", "LinkedIn", "Facebook"].map((social, i) => (
                  <motion.div
                    key={social}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="w-8 h-8 glass border border-border/50 rounded-lg flex items-center justify-center cursor-pointer backdrop-blur-sm"
                  >
                    <span className="text-xs text-muted-foreground">{social[0]}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Produit</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-foreground transition">
                    Démo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Entreprise</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-foreground transition">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-foreground transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="hover:text-foreground transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Légal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#privacy" className="hover:text-foreground transition">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="hover:text-foreground transition">
                    CGU
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground mb-4">2025 ShiftPilot. Conçu pour les restaurants, bars et brasseries.</p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Données sécurisées
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                RGPD conforme
              </span>
              <span>🇫🇷 Made in France</span>
              <span>💚 Éco-responsable</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  details,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  details?: string[]
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.03, rotate: 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="glass border-2 border-border/50 rounded-xl p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ duration: 0.5, type: "tween" }}
          className={`${color} text-white w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg`}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">{description}</p>
        {details && (
          <ul className="space-y-2">
            {details.map((detail, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <CheckCircle className="h-4 w-4 text-accent-green flex-shrink-0 mt-0.5" />
                <span>{detail}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}

function PricingCard({
  name,
  price,
  description,
  features,
  popular,
  savings,
  color = "bg-[#3b82f6]",
  borderColor = "border-[#3b82f6]/50",
}: {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  savings?: string
  color?: string
  borderColor?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: popular ? 1.08 : 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`glass border-2 rounded-2xl p-8 relative transition-all duration-300 overflow-hidden group backdrop-blur-md ${
        popular 
          ? `${borderColor} shadow-2xl scale-105 bg-gradient-to-br ${color}/10 to-card/80` 
          : `${borderColor}`
      }`}
    >
        {popular && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute -top-4 left-1/2 -translate-x-1/2 ${color} text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg`}
        >
          Populaire
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2 text-foreground">{name}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {savings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border"
              style={{ 
                backgroundColor: color.replace('bg-', '').replace('[', '').replace(']', '') + '1A',
                borderColor: borderColor.replace('border-', '').replace('[', '').replace(']', '').replace('/50', ''),
                color: color.replace('bg-', '').replace('[', '').replace(']', '')
              }}
            >
              <Clock className="h-3 w-3" />
              {savings}
            </div>
          </motion.div>
        )}
        <div className="mb-8">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-foreground"
          >
            {price}
          </motion.span>
          {price !== "Sur devis" && <span className="text-muted-foreground">/mois</span>}
        </div>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
                className="h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ 
                  backgroundColor: color.replace('bg-', '').replace('[', '').replace(']', '') + '33',
                  borderColor: borderColor.replace('border-', '').replace('[', '').replace(']', '').replace('/50', '')
                }}
              >
                <CheckCircle 
                  className="h-4 w-4" 
                  style={{ color: color.replace('bg-', '').replace('[', '').replace(']', '') }}
                />
              </motion.div>
              <span className="text-sm text-foreground">{feature}</span>
            </motion.li>
          ))}
        </ul>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className={`w-full ${popular ? "text-white border-0" : ""}`}
            style={popular ? {
              backgroundColor: color.replace('bg-', '').replace('[', '').replace(']', ''),
            } : {
              borderColor: borderColor.replace('border-', '').replace('[', '').replace(']', '').replace('/50', '')
            }}
            variant={popular ? "default" : "outline"}
            asChild
          >
            <Link href="/signup">Commencer</Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
