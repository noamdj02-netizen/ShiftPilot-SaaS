"use client"

import { motion } from "framer-motion"
import type React from "react"

interface ShimmerEffectProps {
  children: React.ReactNode
  className?: string
}

export function ShimmerEffect({ children, className = "" }: ShimmerEffectProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}

