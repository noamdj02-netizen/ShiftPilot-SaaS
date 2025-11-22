import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { PWAInstaller } from "@/components/pwa/pwa-installer"
import { CommandPalette } from "@/components/search/command-palette"
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShiftPilot - Gestion intelligente de plannings",
  description:
    "Automatisez la création de plannings pour vos employés avec l'intelligence artificielle. Gagnez du temps et optimisez vos ressources.",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#1A1A1A",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShiftPilot",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ServiceWorkerRegister />
          {children}
          <Toaster />
          <Analytics />
          <PWAInstaller />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  )
}
