"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { toast } from "sonner"

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true)
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error("Error checking subscription:", error)
    }
  }

  const subscribeToPush = async () => {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready

      // Demander la permission
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        toast.error("Permission de notification refusée")
        setIsLoading(false)
        return
      }

      // Générer les clés VAPID (en production, utiliser les vraies clés depuis le serveur)
      const response = await fetch("/api/push/vapid-public-key")
      const { publicKey } = await response.json()

      // Convertir la clé publique en format Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(publicKey)

      // S'abonner
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })

      // Envoyer la subscription au serveur
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })

      setIsSubscribed(true)
      toast.success("Notifications push activées !")
    } catch (error) {
      console.error("Error subscribing to push:", error)
      toast.error("Erreur lors de l'activation des notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribeFromPush = async () => {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
        setIsSubscribed(false)
        toast.success("Notifications push désactivées")
      }
    } catch (error) {
      console.error("Error unsubscribing from push:", error)
      toast.error("Erreur lors de la désactivation")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
      disabled={isLoading}
    >
      {isSubscribed ? (
        <>
          <BellOff className="mr-2 h-4 w-4" />
          Désactiver notifications
        </>
      ) : (
        <>
          <Bell className="mr-2 h-4 w-4" />
          Activer notifications
        </>
      )}
    </Button>
  )
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

