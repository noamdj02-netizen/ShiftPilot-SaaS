"use client"

import { useEffect } from "react"
import { PWAInstaller } from "@/components/pwa/pwa-installer"
import { initializePushNotifications } from "@/lib/push-notifications"

export function PWAInstallProvider() {
  useEffect(() => {
    // Initialize PWA and push notifications
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      initializePushNotifications().catch(console.error)
    }
  }, [])

  return <PWAInstaller />
}

