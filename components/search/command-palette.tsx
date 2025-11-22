"use client"

import { useState, useEffect } from "react"
import { Command } from "cmdk"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Search, Calendar, Users, BarChart3, Settings, FileText, User, LogOut, Plus, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface CommandItem {
  id: string
  label: string
  icon: React.ElementType
  keywords: string[]
  action: () => void
  group: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const router = useRouter()

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: Search,
      keywords: ["dashboard", "accueil", "home"],
      action: () => router.push("/dashboard"),
      group: "Navigation",
    },
    {
      id: "schedules",
      label: "Plannings",
      icon: Calendar,
      keywords: ["planning", "schedules", "shifts", "horaires"],
      action: () => router.push("/dashboard/schedules"),
      group: "Navigation",
    },
    {
      id: "employees",
      label: "Équipe",
      icon: Users,
      keywords: ["employés", "équipe", "team", "employees"],
      action: () => router.push("/dashboard/employees"),
      group: "Navigation",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      keywords: ["analytics", "statistiques", "stats", "rapports"],
      action: () => router.push("/dashboard/analytics"),
      group: "Navigation",
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: Settings,
      keywords: ["settings", "paramètres", "config"],
      action: () => router.push("/dashboard/settings"),
      group: "Navigation",
    },
    // Actions
    {
      id: "new-schedule",
      label: "Nouveau planning",
      icon: Plus,
      keywords: ["nouveau", "créer", "new", "planning"],
      action: () => router.push("/dashboard/schedules/new"),
      group: "Actions",
    },
    {
      id: "new-employee",
      label: "Ajouter un employé",
      icon: User,
      keywords: ["ajouter", "nouveau", "employé", "add"],
      action: () => router.push("/dashboard/employees/new"),
      group: "Actions",
    },
    {
      id: "templates",
      label: "Templates de planning",
      icon: FileText,
      keywords: ["template", "modèle", "templates"],
      action: () => router.push("/dashboard/schedules/templates"),
      group: "Actions",
    },
    // Autres
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      keywords: ["notifications", "alertes", "notifs"],
      action: () => router.push("/dashboard/settings/notifications"),
      group: "Autres",
    },
    {
      id: "logout",
      label: "Déconnexion",
      icon: LogOut,
      keywords: ["logout", "déconnexion", "quitter"],
      action: async () => {
        await fetch("/api/auth/logout", { method: "POST" })
        router.push("/login")
        toast.success("Déconnexion réussie")
      },
      group: "Autres",
    },
  ]

  // Filtrer les commandes selon la recherche
  const filteredCommands = commands.filter((cmd) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.keywords.some((keyword) => keyword.toLowerCase().includes(searchLower))
    )
  })

  // Grouper les commandes
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.group]) {
      acc[cmd.group] = []
    }
    acc[cmd.group].push(cmd)
    return acc
  }, {} as Record<string, CommandItem[]>)

  // Raccourci clavier Cmd+K ou Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <Command className="rounded-lg">
            <div className="flex items-center border-b border-border px-4">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder="Rechercher une commande, une page, une action... (Cmd+K)"
                value={search}
                onValueChange={setSearch}
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Command.List className="max-h-[400px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                Aucun résultat trouvé.
              </Command.Empty>
              {Object.entries(groupedCommands).map(([group, items]) => (
                <div key={group}>
                  <Command.Group heading={group} className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {items.map((cmd) => {
                      const Icon = cmd.icon
                      return (
                        <Command.Item
                          key={cmd.id}
                          value={cmd.id}
                          onSelect={() => {
                            cmd.action()
                            setOpen(false)
                            setSearch("")
                          }}
                          className="flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{cmd.label}</span>
                        </Command.Item>
                      )
                    })}
                  </Command.Group>
                </div>
              ))}
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}

