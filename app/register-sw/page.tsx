"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RegisterSWPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[SW] Service Worker registered:", registration)
          router.push("/dashboard")
        })
        .catch((error) => {
          console.error("[SW] Service Worker registration failed:", error)
          router.push("/dashboard")
        })
    } else {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Enregistrement du Service Worker...</h1>
        <p className="text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  )
}

