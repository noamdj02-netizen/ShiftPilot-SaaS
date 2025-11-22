"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ShortcutConfig {
  keys: string[]
  action: () => void
  description?: string
  preventDefault?: boolean
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      for (const shortcut of shortcuts) {
        const keys = shortcut.keys.map((k) => k.toLowerCase())
        const pressedKeys: string[] = []

        if (e.metaKey || e.ctrlKey) pressedKeys.push("meta")
        if (e.altKey) pressedKeys.push("alt")
        if (e.shiftKey) pressedKeys.push("shift")
        pressedKeys.push(e.key.toLowerCase())

        const matches =
          keys.length === pressedKeys.length &&
          keys.every((key) => pressedKeys.includes(key))

        if (matches) {
          if (shortcut.preventDefault !== false) {
            e.preventDefault()
          }
          shortcut.action()
          if (shortcut.description) {
            toast.info(shortcut.description, { duration: 2000 })
          }
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts, router])
}

// Hook spécifique pour les raccourcis globaux
export function useGlobalShortcuts() {
  const router = useRouter()

  useKeyboardShortcuts([
    {
      keys: ["Meta", "K"],
      description: "Recherche",
      action: () => {
        // Focus search input or open search modal
        const searchInput = document.querySelector<HTMLInputElement>('input[type="search"]')
        if (searchInput) {
          searchInput.focus()
        } else {
          toast.info("Utilisez la barre de recherche dans le header")
        }
      },
    },
    {
      keys: ["Meta", "N"],
      description: "Nouveau planning",
      action: () => {
        router.push("/dashboard/schedules/new")
      },
    },
    {
      keys: ["Meta", "E"],
      description: "Nouvel employé",
      action: () => {
        router.push("/dashboard/employees/new")
      },
    },
    {
      keys: ["Meta", "D"],
      description: "Dashboard",
      action: () => {
        router.push("/dashboard")
      },
    },
    {
      keys: ["Escape"],
      action: () => {
        // Close any open modals
        const modals = document.querySelectorAll('[role="dialog"]')
        modals.forEach((modal) => {
          const closeButton = modal.querySelector('button[aria-label="Close"]')
          if (closeButton) {
            ;(closeButton as HTMLButtonElement).click()
          }
        })
      },
    },
  ])
}

