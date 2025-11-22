"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true)
      return
    }

    if (!deferredPrompt) {
      toast.info("L'application est déjà installée ou ne peut pas être installée sur cet appareil")
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      toast.success("Application installée avec succès !")
      setIsInstalled(true)
    } else {
      toast.info("Installation annulée")
    }

    setDeferredPrompt(null)
  }

  if (isInstalled) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg p-3 flex items-center gap-2 text-sm text-accent-green">
          <CheckCircle2 className="h-4 w-4" />
          <span>Application installée</span>
        </div>
      </motion.div>
    )
  }

  if (!deferredPrompt && !isIOS) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {deferredPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 right-4 z-50 max-w-sm"
          >
            <div className="bg-card border border-border rounded-lg shadow-xl p-4 backdrop-blur-md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Installer ShiftPilot</h3>
                  <p className="text-sm text-muted-foreground">
                    Installez l'application pour un accès rapide et des notifications push
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setDeferredPrompt(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleInstallClick} className="flex-1" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Installer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeferredPrompt(null)}
                  size="sm"
                >
                  Plus tard
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowIOSInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-card border border-border rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Installer sur iOS</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowIOSInstructions(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-foreground">1.</span>
                  <span>Appuyez sur le bouton <strong className="text-foreground">Partager</strong> dans Safari</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-foreground">2.</span>
                  <span>Faites défiler et appuyez sur <strong className="text-foreground">Sur l'écran d'accueil</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-foreground">3.</span>
                  <span>Appuyez sur <strong className="text-foreground">Ajouter</strong></span>
                </li>
              </ol>
              <Button
                onClick={() => setShowIOSInstructions(false)}
                className="w-full mt-6"
              >
                Compris
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

