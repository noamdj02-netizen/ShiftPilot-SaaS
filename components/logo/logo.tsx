"use client"

import { Calendar } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
  href?: string
  textClassName?: string
}

export function Logo({ size = "md", showText = true, className = "", href = "/", textClassName = "" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }

  const logoContent = (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={cn(
          sizeClasses[size],
          "rounded-lg flex items-center justify-center shadow-lg overflow-hidden relative group"
        )}
      >
        {/* Gradient background avec les couleurs du planning */}
        <div className="absolute inset-0 bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 opacity-90 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-tr from-chart-3/50 to-transparent" />
        <Calendar className={cn(iconSizes[size], "text-white relative z-10 drop-shadow-sm")} />
      </motion.div>
      {showText && (
        <span className={cn(textSizes[size], "font-bold text-foreground", textClassName)}>ShiftPilot</span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

