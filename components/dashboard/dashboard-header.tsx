"use client"

import { useState, useEffect } from "react"
import { Bell, Search, Sun, LogOut } from "lucide-react"
import { MobileSidebar } from "./mobile-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchBar } from "./search-bar"
import { CommandPalette } from "@/components/command-palette/command-palette"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  companyName: string
}

export function DashboardHeader() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useEffect(() => {
    // Get user info from session
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {
        // If not authenticated, redirect to login
        router.push("/login")
      })
      .finally(() => setIsLoading(false))
  }, [router])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Déconnexion réussie")
        router.push("/login")
      }
    } catch (error) {
      toast.error("Erreur lors de la déconnexion")
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  const currentHour = new Date().getHours()
  const currentService =
    currentHour >= 12 && currentHour < 15
      ? "Service Midi"
      : currentHour >= 19 && currentHour < 23
        ? "Service Soir"
        : "Hors service"
  const serviceColor =
    currentService === "Service Midi" ? "bg-chart-1" : currentService === "Service Soir" ? "bg-chart-2" : "bg-muted"

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <MobileSidebar />

          <div className="hidden md:flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {user?.companyName || "Chargement..."}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={`${serviceColor} text-white text-xs`}>
                  <Sun className="h-3 w-3 mr-1" />
                  {currentService}
                </Badge>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex flex-1 max-w-md ml-auto">
            <SearchBar />
          </div>
          <div className="sm:hidden">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full animate-pulse" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2" disabled={isLoading}>
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user ? getInitials(user.companyName) : "..."}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">
                  {user?.companyName || "Chargement..."}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.companyName || "Chargement..."}</span>
                  <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings/profile">Profil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Paramètres</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing">Facturation</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
