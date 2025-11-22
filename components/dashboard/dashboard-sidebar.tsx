"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  Users,
  LayoutDashboard,
  BarChart3,
  Settings,
  UtensilsCrossed,
  LogOut,
  FileText,
  RefreshCw,
  Clock,
  Building2,
  DollarSign,
  Bell,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Mail,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Planning",
    href: "/dashboard/schedules",
    icon: Calendar,
    badge: 3,
    children: [
      { name: "Tous les plannings", href: "/dashboard/schedules", icon: Calendar },
      { name: "Templates", href: "/dashboard/schedules/templates", icon: FileText },
      { name: "Optimisation", href: "/dashboard/schedules?tab=optimize", icon: Sparkles },
    ],
  },
  {
    name: "Équipe",
    href: "/dashboard/employees",
    icon: Users,
    children: [
      { name: "Tous les employés", href: "/dashboard/employees", icon: Users },
      { name: "Disponibilités", href: "/dashboard/availability", icon: Clock },
      { name: "Échanges de shifts", href: "/dashboard/shifts/exchange", icon: RefreshCw, badge: 2 },
    ],
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    children: [
      { name: "Tableau de bord", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "Paie et pointage", href: "/dashboard/payroll", icon: DollarSign },
      { name: "Rapports", href: "/dashboard/analytics?tab=reports", icon: FileText },
    ],
  },
  {
    name: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
    children: [
      { name: "Profil", href: "/dashboard/settings/profile", icon: Users },
      { name: "Entreprise", href: "/dashboard/settings/company", icon: Building2 },
      { name: "Établissements", href: "/dashboard/settings?tab=locations", icon: Building2 },
      { name: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
      { name: "Sécurité", href: "/dashboard/settings/security", icon: Settings },
      { name: "Intégrations", href: "/dashboard/settings?tab=integrations", icon: Zap },
    ],
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [openSections, setOpenSections] = useState<string[]>(["planning"])

  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((s) => s !== sectionName)
        : [...prev, sectionName]
    )
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:border-border bg-card/50 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-border/50 bg-card/80">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="h-10 w-10 bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 rounded-lg flex items-center justify-center shadow-lg"
        >
          <UtensilsCrossed className="h-5 w-5 text-white" />
        </motion.div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">ShiftPilot</span>
          <span className="text-xs text-muted-foreground">Gestion de planning</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const hasChildren = item.children && item.children.length > 0
          const sectionKey = item.name.toLowerCase().replace(/\s+/g, "-")
          const isOpen = openSections.includes(sectionKey)
          const isItemActive = isActive(item.href)

          if (hasChildren) {
            return (
              <Collapsible
                key={item.name}
                open={isOpen}
                onOpenChange={() => toggleSection(sectionKey)}
              >
                <CollapsibleTrigger
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                    isItemActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "h-5 min-w-5 px-1.5 text-xs",
                          isItemActive
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-primary/20 text-primary"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  </motion.div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-border/30"
                      >
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon
                          const isChildActive = isActive(child.href)

                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group",
                                isChildActive
                                  ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                              )}
                            >
                              <ChildIcon className="h-4 w-4 shrink-0 opacity-70" />
                              <span className="flex-1">{child.name}</span>
                              {child.badge && child.badge > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="h-5 min-w-5 px-1.5 text-xs bg-primary/20 text-primary"
                                >
                                  {child.badge}
                                </Badge>
                              )}
                            </Link>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CollapsibleContent>
              </Collapsible>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                isItemActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.badge && item.badge > 0 && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-5 min-w-5 px-1.5 text-xs",
                    isItemActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/20 text-primary"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
              {isItemActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Quick Actions */}
      <div className="px-3 py-4 border-t border-border/50 space-y-2 bg-card/50">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Actions rapides
          </p>
          <div className="space-y-1">
            <Link
              href="/dashboard/schedules/new"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors group"
            >
              <Zap className="h-4 w-4 text-chart-1 group-hover:scale-110 transition-transform" />
              <span>Nouveau planning</span>
            </Link>
            <Link
              href="/dashboard/employees/new"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors group"
            >
              <Users className="h-4 w-4 text-chart-2 group-hover:scale-110 transition-transform" />
              <span>Ajouter employé</span>
            </Link>
            <Link
              href="/dashboard/shifts/exchange"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted transition-colors group relative"
            >
              <RefreshCw className="h-4 w-4 text-chart-3 group-hover:scale-110 transition-transform" />
              <span>Échanges</span>
              <Badge variant="secondary" className="h-4 min-w-4 px-1 text-xs bg-destructive/20 text-destructive ml-auto">
                2
              </Badge>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border/50 bg-card/80">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted group"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3 group-hover:text-destructive transition-colors" />
          <span>Déconnexion</span>
        </Button>
      </div>
    </div>
  )
}
