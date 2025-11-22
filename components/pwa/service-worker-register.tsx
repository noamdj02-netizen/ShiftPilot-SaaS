"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[SW] Service Worker registered:", registration.scope)
            
            // Vérifier les mises à jour toutes les heures
            setInterval(() => {
              registration.update()
            }, 60 * 60 * 1000)
          })
          .catch((error) => {
            console.error("[SW] Service Worker registration failed:", error)
          })
      })
    }
  }, [])

  return null
}

