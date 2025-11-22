"use client"

import { LoginForm } from "@/components/auth/login-form"
import { UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { Logo } from "@/components/logo/logo"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Effects - Même style que le hero */}
      <AnimatedBackground opacity={0.3} />

      {/* Left side - Restaurant illustration */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 relative z-10 p-12 flex-col justify-between overflow-hidden"
      >
        {/* Glass overlay avec couleurs du planning */}
        <div className="absolute inset-0 bg-gradient-to-br from-chart-1/30 via-chart-2/25 to-chart-3/30 backdrop-blur-md border-r border-border/30" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-accent/20 to-transparent" />
        <div className="absolute inset-0 bg-background/20 backdrop-blur-sm" />
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-current rounded-full" />
          <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-current rounded-lg rotate-45" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-current rounded-full" />
        </div>

        <div className="relative z-10">
          <Logo textClassName="text-primary-foreground" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <UtensilsCrossed className="h-16 w-16 mb-6 text-primary-foreground" />
            </motion.div>
            <h2 className="text-4xl font-bold leading-tight text-primary-foreground">Pensé pour les managers, serveurs et équipes F&B</h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed max-w-md">
              Gérez vos plannings de restaurant avec une solution qui comprend vraiment vos contraintes de service.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 glass border border-primary-foreground/20 backdrop-blur-md px-4 py-2 rounded-lg w-fit shadow-lg"
          >
            <div className="h-2 w-2 bg-accent-green rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">14 jours gratuits, sans carte</span>
          </motion.div>
        </div>

        {/* Restaurant floor plan illustration */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <rect x="20" y="20" width="30" height="30" fill="currentColor" rx="4" />
            <rect x="60" y="20" width="30" height="30" fill="currentColor" rx="4" />
            <rect x="100" y="20" width="30" height="30" fill="currentColor" rx="4" />
            <rect x="20" y="60" width="30" height="30" fill="currentColor" rx="4" />
            <rect x="60" y="60" width="30" height="30" fill="currentColor" rx="4" />
            <rect x="100" y="60" width="30" height="30" fill="currentColor" rx="4" />
            <circle cx="155" cy="35" r="15" fill="currentColor" />
            <circle cx="155" cy="75" r="15" fill="currentColor" />
          </svg>
        </div>
      </motion.div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center bg-background/95 backdrop-blur-md px-4 py-12 relative z-10">
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
            <h1 className="text-3xl font-bold mb-2 text-foreground">Bon retour</h1>
            <p className="text-muted-foreground">Connectez-vous à votre compte ShiftPilot</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <LoginForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-3 mt-6"
          >
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-accent hover:underline font-medium">
                Créer un compte
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
                Choisir un autre profil (Employé)
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
