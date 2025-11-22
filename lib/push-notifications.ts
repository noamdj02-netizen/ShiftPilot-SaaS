/**
 * Service de gestion des notifications push
 */

let registration: ServiceWorkerRegistration | null = null

export async function initializePushNotifications() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.warn("Service Workers not supported")
    return false
  }

  try {
    // Register service worker
    registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/"
    })

    console.log("[Push] Service Worker registered:", registration.scope)

    // Request notification permission
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        console.log("[Push] Notification permission granted")
        return true
      } else {
        console.log("[Push] Notification permission denied")
        return false
      }
    }

    return false
  } catch (error) {
    console.error("[Push] Error registering service worker:", error)
    return false
  }
}

export async function subscribeToPushNotifications(userId?: string, userType?: "manager" | "employee") {
  if (!registration) {
    const initialized = await initializePushNotifications()
    if (!initialized) {
      throw new Error("Failed to initialize push notifications")
    }
  }

  if (!registration) {
    throw new Error("Service worker not registered")
  }

  try {
    // Get existing subscription or create new one
    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      // Subscribe to push notifications
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
            "BHx8JzV4LzE5KzE5KzE5KzE5KzE5KzE5KzE5KzE5KzE5KzE5KzE5KzE5KzE5KzE5KzE5KzE5KzE5KzE5"
        )
      })
    }

    // Send subscription to server
    const response = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userId,
        userType,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to send subscription to server")
    }

    console.log("[Push] Subscribed to push notifications")
    return subscription
  } catch (error) {
    console.error("[Push] Error subscribing to push:", error)
    throw error
  }
}

export async function unsubscribeFromPushNotifications() {
  if (!registration) {
    return
  }

  try {
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
      
      // Notify server
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      })

      console.log("[Push] Unsubscribed from push notifications")
    }
  } catch (error) {
    console.error("[Push] Error unsubscribing:", error)
  }
}

export async function checkPushPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return "denied"
  }
  return Notification.permission
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
