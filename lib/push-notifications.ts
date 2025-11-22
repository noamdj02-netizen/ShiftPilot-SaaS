"use client"

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission === "denied") {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === "granted"
}

export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<Notification | null> {
  if (!("Notification" in window)) {
    return null
  }

  if (Notification.permission !== "granted") {
    const granted = await requestNotificationPermission()
    if (!granted) {
      return null
    }
  }

  const notification = new Notification(title, {
    icon: "/icon.svg",
    badge: "/icon.svg",
    tag: "shiftpilot",
    requireInteraction: false,
    ...options,
  })

  notification.onclick = () => {
    window.focus()
    notification.close()
  }

  return notification
}

export async function subscribeToNotifications(userId: string): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    // Send subscription to server
    const response = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, userId }),
    })

    return response.ok
  } catch (error) {
    console.error("Error subscribing to push notifications:", error)
    return false
  }
}

