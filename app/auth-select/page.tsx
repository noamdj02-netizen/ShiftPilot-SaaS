"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Building2, User, ArrowRight, Briefcase, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { Logo } from "@/components/logo/logo"

export default function AuthSelectPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      <AnimatedBackground opacity={0.3} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-6"
          >
            <Logo size="lg" />
          </motion.div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Bienvenue sur ShiftPilot
          </h1>
          <p className="text-lg text-muted-foreground">
            Choisissez votre profil pour continuer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Entreprise */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass" className="backdrop-blur-md border-border/50 h-full hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="mx-auto mb-4 h-20 w-20 rounded-2xl bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 flex items-center justify-center shadow-lg group-hover:shadow-xl"
                >
                  <Building2 className="h-10 w-10 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  Gestionnaire / Entreprise
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Gérez vos plannings, équipes et établissements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Briefcase className="h-5 w-5 text-chart-1 shrink-0 mt-0.5" />
                    <span>Créer et gérer les plannings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-chart-2 shrink-0 mt-0.5" />
                    <span>Gérer votre équipe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Briefcase className="h-5 w-5 text-chart-3 shrink-0 mt-0.5" />
                    <span>Analytics et rapports</span>
                  </li>
                </ul>
                <Button asChild className="w-full mt-6 group" size="lg">
                  <Link href="/login">
                    Se connecter en tant que gestionnaire
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Pas encore de compte ?{" "}
                  <Link href="/signup" className="text-primary hover:underline font-medium">
                    Créer un compte
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Employé */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="glass" className="backdrop-blur-md border-border/50 h-full hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="mx-auto mb-4 h-20 w-20 rounded-2xl bg-gradient-to-br from-accent-green via-chart-1 to-chart-2 flex items-center justify-center shadow-lg group-hover:shadow-xl"
                >
                  <User className="h-10 w-10 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  Employé
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Consultez votre planning et gérez vos demandes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Briefcase className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
                    <span>Consulter mon planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Briefcase className="h-5 w-5 text-chart-1 shrink-0 mt-0.5" />
                    <span>Demander des congés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Briefcase className="h-5 w-5 text-chart-2 shrink-0 mt-0.5" />
                    <span>Voir mes heures et statistiques</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full mt-6 group border-2" size="lg">
                  <Link href="/employee/login">
                    Se connecter en tant qu'employé
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Votre employeur vous enverra vos identifiants
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

