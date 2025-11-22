"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Building2, Bell, Shield, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const settingsNav = [
  { name: "Overview", href: "/dashboard/settings", icon: Settings },
  { name: "Profil", href: "/dashboard/settings/profile", icon: User },
  { name: "Entreprise", href: "/dashboard/settings/company", icon: Building2 },
  { name: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
  { name: "Sécurité", href: "/dashboard/settings/security", icon: Shield },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos paramètres et préférences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <nav className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-4 space-y-1">
            {settingsNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  )
}

