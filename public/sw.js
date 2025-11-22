// Service Worker for ShiftPilot PWA
const CACHE_NAME = "shiftpilot-v1"
const urlsToCache = [
  "/",
  "/login",
  "/dashboard",
  "/employee",
  "/manifest.json",
  "/offline.html"
]

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell")
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
  return self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request).catch(() => {
        // If offline and page request, return offline page
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html")
        }
      })
    })
  )
})

// Push notification event
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Nouvelle notification ShiftPilot",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [200, 100, 200],
    tag: "shiftpilot-notification",
    requireInteraction: false,
    actions: [
      {
        action: "view",
        title: "Voir",
        icon: "/icon-192x192.png"
      },
      {
        action: "close",
        title: "Fermer"
      }
    ],
    data: {
      url: "/",
      ...(event.data ? JSON.parse(event.data.text()) : {})
    }
  }

  event.waitUntil(
    self.registration.showNotification("ShiftPilot", options)
  )
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const action = event.action || "view"
  const urlToOpen = event.notification.data?.url || "/"

  if (action === "view") {
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        // Check if there's already a window/tab open
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus()
          }
        }
        // Otherwise, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
    )
  }
})

// Background sync event (for offline actions)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-shifts") {
    event.waitUntil(
      // Sync shifts when back online
      syncShifts()
    )
  }
})

async function syncShifts() {
  // Implementation for syncing shifts when back online
  console.log("[Service Worker] Syncing shifts...")
}
