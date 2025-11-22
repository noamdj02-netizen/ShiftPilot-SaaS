"use client"

import { LoginForm } from "@/components/auth/login-form"
import { Calendar, UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Restaurant illustration */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-current rounded-full" />
          <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-current rounded-lg rotate-45" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-current rounded-full" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 bg-primary-foreground/10 backdrop-blur rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">ShiftPilot</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            <UtensilsCrossed className="h-16 w-16 mb-6" />
            <h2 className="text-4xl font-bold leading-tight">Pensé pour les managers, serveurs et équipes F&B</h2>
            <p className="text-lg opacity-90 leading-relaxed max-w-md">
              Gérez vos plannings de restaurant avec une solution qui comprend vraiment vos contraintes de service.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-2 rounded-lg w-fit">
            <div className="h-2 w-2 bg-accent-green rounded-full animate-pulse" />
            <span className="text-sm font-medium">14 jours gratuits, sans carte</span>
          </div>
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
      <div className="flex-1 flex items-center justify-center bg-background px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">ShiftPilot</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Bon retour</h1>
            <p className="text-muted-foreground">Connectez-vous à votre compte ShiftPilot</p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground mt-6">
            Pas encore de compte ?{" "}
            <Link href="/signup" className="text-accent hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
