// Service Worker pour ShiftPilot PWA
const CACHE_NAME = 'shiftpilot-v1'
const RUNTIME_CACHE = 'shiftpilot-runtime-v1'

// Assets à mettre en cache au moment de l'installation
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/login',
  '/employee/login',
  '/icon-light-32x32.png',
  '/icon-dark-32x32.png',
  '/apple-icon.png',
]

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching assets')
        return cache.addAll(PRECACHE_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          })
      )
    })
    .then(() => self.clients.claim())
  )
})

// Stratégie de cache : Network First, puis Cache
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return
  }

  // Ignorer les requêtes vers l'API (toujours en ligne)
  if (event.request.url.includes('/api/')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cloner la réponse pour la mettre en cache
        const responseToCache = response.clone()
        
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(event.request, responseToCache)
        })
        
        return response
      })
      .catch(() => {
        // Si le réseau échoue, utiliser le cache
        return caches.match(event.request)
      })
  )
})

// Gestion des notifications push
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'ShiftPilot'
  const options = {
    body: data.body || 'Vous avez une nouvelle notification',
    icon: '/icon-light-32x32.png',
    badge: '/icon-light-32x32.png',
    image: data.image,
    data: data.data || {},
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    vibrate: data.vibrate || [200, 100, 200],
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const data = event.notification.data
  const urlToOpen = data.url || '/dashboard'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si une fenêtre est déjà ouverte, la focus
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        // Sinon, ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Gestion des actions sur les notifications
self.addEventListener('notificationclose', (event) => {
  // Analytics ou logging si nécessaire
  console.log('[SW] Notification closed:', event.notification.tag)
})

// Message depuis le client pour mettre à jour le cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.urls)
      })
    )
  }
})
