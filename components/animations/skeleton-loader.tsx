"use client"

import { motion } from "framer-motion"

interface SkeletonLoaderProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
  animate?: boolean
}

export function SkeletonLoader({
  className = "",
  variant = "rectangular",
  width,
  height,
  animate = true,
}: SkeletonLoaderProps) {
  const baseClasses = "bg-muted rounded"
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  }

  const animation = animate
    ? {
        opacity: [0.5, 1, 0.5],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }
    : {}

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      animate={animation}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonLoader variant="text" width="40%" height={20} />
        <SkeletonLoader variant="circular" width={40} height={40} />
      </div>
      <SkeletonLoader variant="text" width="60%" height={32} />
      <SkeletonLoader variant="text" width="80%" height={16} />
      <SkeletonLoader variant="text" width="50%" height={16} />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <SkeletonLoader variant="text" width="30%" height={20} />
          <SkeletonLoader variant="text" width="25%" height={20} />
          <SkeletonLoader variant="text" width="25%" height={20} />
          <SkeletonLoader variant="text" width="20%" height={20} />
        </div>
      ))}
    </div>
  )
}

