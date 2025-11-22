"use client"

import { SignupForm } from "@/components/auth/signup-form"
import { Calendar, Clock, Users, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Benefits */}
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

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight mx-[] border-foreground shadow-xl">Rejoignez les restaurants qui gagnent du temps</h2>
            <p className="text-lg opacity-90 leading-relaxed max-w-md">
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
                  <benefit.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{benefit.text}</span>
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
            <h1 className="text-3xl font-bold mb-2 text-foreground">Créer votre compte</h1>
            <p className="text-muted-foreground">Commencez votre essai gratuit de 14 jours</p>
          </div>

          <SignupForm />

          <p className="text-center text-sm text-muted-foreground mt-6">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="text-accent hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
