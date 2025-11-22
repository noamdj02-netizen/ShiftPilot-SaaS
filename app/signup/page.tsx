"use client"

import { SignupForm } from "@/components/auth/signup-form"
import { Clock, Users, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { Logo } from "@/components/logo/logo"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Effects - Même style que le hero */}
      <AnimatedBackground opacity={0.3} />

      {/* Left side - Benefits */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 relative z-10 p-12 flex-col justify-between overflow-hidden"
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm border-r border-border/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-accent/20" />
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-current rounded-full" />
          <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-current rounded-lg rotate-45" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-current rounded-full" />
        </div>

        <div className="relative z-10">
          <Logo textClassName="text-primary-foreground" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight text-primary-foreground">Rejoignez les restaurants qui gagnent du temps</h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed max-w-md">
              Plus de 500 établissements utilisent ShiftPilot pour gérer leurs plannings en quelques clics.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Sparkles, text: "Planning généré en 5 secondes avec l'IA" },
              { icon: Clock, text: "Conformité légale automatique (repos, coupures)" },
              { icon: Users, text: "Équipe notifiée instantanément" },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="h-10 w-10 bg-primary-foreground/10 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-primary-foreground">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect x="10" y="10" width="40" height="40" fill="currentColor" rx="6" />
            <rect x="60" y="10" width="40" height="40" fill="currentColor" rx="6" />
            <rect x="110" y="10" width="40" height="40" fill="currentColor" rx="6" />
            <rect x="10" y="60" width="40" height="40" fill="currentColor" rx="6" />
            <rect x="60" y="60" width="40" height="40" fill="currentColor" rx="6" />
          </svg>
        </div>
      </motion.div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-8">
            <div className="mb-6">
              <Logo />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2 text-foreground">Créer votre compte</h1>
            <p className="text-muted-foreground">Commencez votre essai gratuit de 14 jours</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <SignupForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-3 mt-6"
          >
            <p className="text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-accent hover:underline font-medium">
                Se connecter
              </Link>
            </p>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>
            <Link href="/auth-select">
              <Button variant="outline" className="w-full">
                Vous êtes employé ? Se connecter ici
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
