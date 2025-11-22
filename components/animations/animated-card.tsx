"use client"
import { motion } from "framer-motion"
import type React from "react"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimatedCard({ children, className = "", delay = 0 }: AnimatedCardProps) {
  const cardVariants = {
    initial: {
      scale: 1,
      boxShadow: "var(--shadow-md)",
    },
    hover: {
      scale: 1.02,
      boxShadow: "var(--shadow-xl)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover="hover"
      whileTap="tap"
      className={className}
    >
      {children}
    </motion.div>
  )
}
