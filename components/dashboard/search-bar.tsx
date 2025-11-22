"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Users, Calendar, Clock, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface SearchResult {
  id: string
  type: "employee" | "schedule" | "action"
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load data when search opens
    if (open) {
      Promise.all([
        fetch("/api/employees").then((r) => r.json()),
        fetch("/api/schedules").then((r) => r.json()),
      ]).then(([empData, schedData]) => {
        setEmployees(empData.employees || [])
        setSchedules(schedData.schedules || [])
      })
    }
  }, [open])

  useEffect(() => {
    // Global shortcut: Ctrl/Cmd + K
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchQuery = query.toLowerCase()
    const newResults: SearchResult[] = []

    // Search employees
    employees
      .filter(
        (emp) =>
          emp.firstName?.toLowerCase().includes(searchQuery) ||
          emp.lastName?.toLowerCase().includes(searchQuery) ||
          emp.email?.toLowerCase().includes(searchQuery)
      )
      .slice(0, 5)
      .forEach((emp) => {
        newResults.push({
          id: `emp-${emp.id}`,
          type: "employee",
          title: `${emp.firstName} ${emp.lastName}`,
          description: emp.email || emp.role || "Employé",
          icon: <User className="h-4 w-4" />,
          href: `/dashboard/employees/${emp.id}`,
        })
      })

    // Search schedules
    schedules
      .filter(
        (sched) =>
          sched.name?.toLowerCase().includes(searchQuery) ||
          sched.status?.toLowerCase().includes(searchQuery)
      )
      .slice(0, 5)
      .forEach((sched) => {
        newResults.push({
          id: `sched-${sched.id}`,
          type: "schedule",
          title: sched.name || "Planning sans nom",
          description: `Statut: ${sched.status || "draft"}`,
          icon: <Calendar className="h-4 w-4" />,
          href: `/dashboard/schedules/${sched.id}`,
        })
      })

    // Quick actions
    const quickActions = [
      {
        id: "new-employee",
        query: ["nouveau employé", "ajouter employé", "créer employé"],
        title: "Ajouter un employé",
        description: "Créer un nouvel employé",
        icon: <Users className="h-4 w-4" />,
        href: "/dashboard/employees/new",
      },
      {
        id: "new-schedule",
        query: ["nouveau planning", "créer planning", "générer planning"],
        title: "Créer un planning",
        description: "Créer ou générer un nouveau planning",
        icon: <Calendar className="h-4 w-4" />,
        href: "/dashboard/schedules/new",
      },
      {
        id: "generate-schedule",
        query: ["générer ia", "planning ia", "ia planning"],
        title: "Générer avec l'IA",
        description: "Générer un planning automatiquement avec l'IA",
        icon: <Clock className="h-4 w-4" />,
        href: "/dashboard/schedules/generate",
      },
    ]

    quickActions.forEach((action) => {
      if (action.query.some((q) => searchQuery.includes(q))) {
        newResults.push({
          id: action.id,
          type: "action",
          title: action.title,
          description: action.description,
          icon: action.icon,
          href: action.href,
        })
      }
    })

    setResults(newResults)
  }, [query, employees, schedules])

  const handleSelect = (result: SearchResult) => {
    router.push(result.href)
    setOpen(false)
    setQuery("")
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative hidden sm:flex h-9 w-full max-w-sm items-center justify-between gap-2 text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Rechercher...</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          ⌘K
        </Badge>
      </Button>

      <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setOpen(true)}>
        <Search className="h-5 w-5" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Rechercher un employé, un planning..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Résultats">
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="flex-shrink-0">{result.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-xs text-muted-foreground">{result.description}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {result.type === "employee" ? "Employé" : result.type === "schedule" ? "Planning" : "Action"}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

