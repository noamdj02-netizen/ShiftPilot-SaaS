"use client"

import { useEffect, useState } from "react"
import { requestNotificationPermission, subscribeToNotifications } from "@/lib/push-notifications"
import { toast } from "sonner"

export function useNotificationSubscription(userId?: string) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error("Error checking subscription:", error)
      }
    }
  }

  const subscribe = async () => {
    const granted = await requestNotificationPermission()
    if (granted) {
      setPermission("granted")
      if (userId) {
        subscribeToNotifications(userId)
        setIsSubscribed(true)
        toast.success("Notifications activées")
      }
    } else {
      setPermission("denied")
      toast.error("Permission refusée")
    }
  }

  return { isSubscribed, permission, subscribe }
}

