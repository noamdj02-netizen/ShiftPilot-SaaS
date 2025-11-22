"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import {
  Calendar,
  Users,
  BarChart3,
  Settings,
  Plus,
  Search,
  FileText,
  Clock,
  DollarSign,
  Bell,
  LayoutDashboard,
  LogOut,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CommandAction {
  id: string
  title: string
  description?: string
  icon: React.ElementType
  keywords: string[]
  action: () => void
  category: "navigation" | "actions" | "employees" | "schedules" | "settings"
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const actions: CommandAction[] = [
    // Navigation
    {
      id: "dashboard",
      title: "Tableau de bord",
      description: "Accéder au tableau de bord principal",
      icon: LayoutDashboard,
      keywords: ["dashboard", "accueil", "home"],
      category: "navigation",
      action: () => router.push("/dashboard"),
    },
    {
      id: "schedules",
      title: "Plannings",
      description: "Voir tous les plannings",
      icon: Calendar,
      keywords: ["planning", "schedule", "plannings", "calendrier"],
      category: "navigation",
      action: () => router.push("/dashboard/schedules"),
    },
    {
      id: "employees",
      title: "Équipe",
      description: "Gérer les employés",
      icon: Users,
      keywords: ["employé", "employee", "équipe", "team", "staff"],
      category: "navigation",
      action: () => router.push("/dashboard/employees"),
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "Voir les statistiques et analyses",
      icon: BarChart3,
      keywords: ["analytics", "stats", "statistiques", "graphique"],
      category: "navigation",
      action: () => router.push("/dashboard/analytics"),
    },
    {
      id: "settings",
      title: "Paramètres",
      description: "Accéder aux paramètres",
      icon: Settings,
      keywords: ["settings", "paramètres", "config", "configuration"],
      category: "navigation",
      action: () => router.push("/dashboard/settings"),
    },
    // Actions rapides
    {
      id: "new-schedule",
      title: "Nouveau planning",
      description: "Créer un nouveau planning",
      icon: Plus,
      keywords: ["nouveau", "new", "créer", "create", "planning"],
      category: "actions",
      action: () => router.push("/dashboard/schedules/new"),
    },
    {
      id: "new-employee",
      title: "Nouvel employé",
      description: "Ajouter un nouvel employé",
      icon: User,
      keywords: ["nouvel", "new", "ajouter", "add", "employé"],
      category: "actions",
      action: () => router.push("/dashboard/employees/new"),
    },
    {
      id: "generate-schedule",
      title: "Générer un planning",
      description: "Générer automatiquement un planning avec l'IA",
      icon: Sparkles,
      keywords: ["générer", "generate", "ia", "ai", "automatique"],
      category: "actions",
      action: () => router.push("/dashboard/schedules/generate"),
    },
    // Employés
    {
      id: "availability",
      title: "Disponibilités",
      description: "Gérer les disponibilités des employés",
      icon: Clock,
      keywords: ["disponibilité", "availability", "horaires"],
      category: "employees",
      action: () => router.push("/dashboard/availability"),
    },
    {
      id: "shift-exchange",
      title: "Échanges de shifts",
      description: "Gérer les demandes d'échange",
      icon: ArrowRight,
      keywords: ["échange", "exchange", "swap", "shift"],
      category: "employees",
      action: () => router.push("/dashboard/shifts/exchange"),
    },
    // Plannings
    {
      id: "templates",
      title: "Templates de plannings",
      description: "Voir et gérer les templates",
      icon: FileText,
      keywords: ["template", "modèle", "planning"],
      category: "schedules",
      action: () => router.push("/dashboard/schedules/templates"),
    },
    // Paramètres
    {
      id: "profile",
      title: "Mon profil",
      description: "Modifier mon profil",
      icon: User,
      keywords: ["profil", "profile", "compte", "account"],
      category: "settings",
      action: () => router.push("/dashboard/settings/profile"),
    },
    {
      id: "company",
      title: "Informations entreprise",
      description: "Gérer les informations de l'entreprise",
      icon: Settings,
      keywords: ["entreprise", "company", "société"],
      category: "settings",
      action: () => router.push("/dashboard/settings/company"),
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configurer les notifications",
      icon: Bell,
      keywords: ["notification", "alert", "alerte"],
      category: "settings",
      action: () => router.push("/dashboard/settings/notifications"),
    },
    {
      id: "billing",
      title: "Facturation",
      description: "Gérer l'abonnement et la facturation",
      icon: DollarSign,
      keywords: ["facturation", "billing", "abonnement", "subscription"],
      category: "settings",
      action: () => router.push("/dashboard/billing"),
    },
  ]

  const filteredActions = actions.filter((action) => {
    const searchLower = search.toLowerCase()
    return (
      action.title.toLowerCase().includes(searchLower) ||
      action.description?.toLowerCase().includes(searchLower) ||
      action.keywords.some((keyword) => keyword.toLowerCase().includes(searchLower))
    )
  })

  const groupedActions = filteredActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = []
    }
    acc[action.category].push(action)
    return acc
  }, {} as Record<string, CommandAction[]>)

  const categoryLabels: Record<string, string> = {
    navigation: "Navigation",
    actions: "Actions rapides",
    employees: "Équipe",
    schedules: "Plannings",
    settings: "Paramètres",
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }

      if (open) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, filteredActions.length - 1))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
        } else if (e.key === "Enter") {
          e.preventDefault()
          if (filteredActions[selectedIndex]) {
            filteredActions[selectedIndex].action()
            onOpenChange(false)
            setSearch("")
            setSelectedIndex(0)
          }
        } else if (e.key === "Escape") {
          e.preventDefault()
          onOpenChange(false)
          setSearch("")
          setSelectedIndex(0)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, filteredActions, selectedIndex, onOpenChange])

  useEffect(() => {
    if (open) {
      setSearch("")
      setSelectedIndex(0)
    }
  }, [open])

  const handleAction = (action: CommandAction) => {
    action.action()
    onOpenChange(false)
    setSearch("")
    setSelectedIndex(0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <Command className="rounded-lg border-0">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Rechercher une commande, page, ou action..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setSelectedIndex(0)
              }}
              className="flex h-11 w-full rounded-md border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              autoFocus
            />
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          <CommandList>
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            {Object.entries(groupedActions).map(([category, categoryActions]) => (
              <CommandGroup key={category} heading={categoryLabels[category]}>
                {categoryActions.map((action, index) => {
                  const globalIndex = filteredActions.findIndex((a) => a.id === action.id)
                  const isSelected = globalIndex === selectedIndex
                  const Icon = action.icon

                  return (
                    <CommandItem
                      key={action.id}
                      value={action.id}
                      onSelect={() => handleAction(action)}
                      className={cn(
                        "cursor-pointer flex items-center gap-3 px-3 py-2",
                        isSelected && "bg-accent"
                      )}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{action.title}</div>
                        {action.description && (
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        )}
                      </div>
                      {isSelected && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

