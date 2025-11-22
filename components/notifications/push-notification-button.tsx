"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, CheckCircle } from "lucide-react"
import { requestNotificationPermission, subscribeToNotifications } from "@/lib/push-notifications"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface PushNotificationButtonProps {
  userId?: string
}

export function PushNotificationButton({ userId }: PushNotificationButtonProps) {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    }
  }

  const handleEnable = async () => {
    if (!("Notification" in window)) {
      toast.error("Votre navigateur ne supporte pas les notifications")
      return
    }

    const granted = await requestNotificationPermission()
    if (granted) {
      setPermission("granted")
      if (userId && "serviceWorker" in navigator) {
        subscribeToNotifications(userId)
        setIsSubscribed(true)
        toast.success("Notifications activées")
      }
    } else {
      setPermission("denied")
      toast.error("Permission de notification refusée")
    }
  }

  const handleDisable = async () => {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        setIsSubscribed(false)
        toast.success("Notifications désactivées")
      }
    }
  }

  if (!("Notification" in window)) {
    return null
  }

  if (permission === "granted" || isSubscribed) {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="outline" onClick={handleDisable} className="w-full">
          <CheckCircle className="mr-2 h-4 w-4 text-accent-green" />
          Notifications activées
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button onClick={handleEnable} className="w-full">
        <Bell className="mr-2 h-4 w-4" />
        Activer les notifications
      </Button>
    </motion.div>
  )
}

