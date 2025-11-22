"use client"

import { motion } from "framer-motion"
import type React from "react"

interface HoverLiftProps {
  children: React.ReactNode
  className?: string
  liftAmount?: number
}

export function HoverLift({ children, className = "", liftAmount = -4 }: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ y: liftAmount, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

