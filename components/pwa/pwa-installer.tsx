"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Vérifier si l'app a été installée
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      toast.success("ShiftPilot a été installé avec succès !")
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error("L'installation n'est pas disponible sur votre appareil")
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        toast.success("Installation en cours...")
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
      } else {
        toast.info("Installation annulée")
      }
    } catch (error) {
      console.error("Erreur lors de l'installation:", error)
      toast.error("Erreur lors de l'installation")
    }
  }

  if (isInstalled || !showInstallPrompt) {
    return null
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="glass border border-border/50 rounded-xl p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Installer ShiftPilot
                </h3>
                <p className="text-sm text-muted-foreground">
                  Installez l'application pour un accès rapide et une meilleure expérience
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => setShowInstallPrompt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleInstallClick}
                className="flex-1"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Installer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInstallPrompt(false)}
              >
                Plus tard
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

