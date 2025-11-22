"use client"
import { motion, useSpring, useTransform } from "framer-motion"
import { useEffect } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  decimals?: number
}

export function AnimatedCounter({ value, duration = 2, className = "", decimals = 0 }: AnimatedCounterProps) {
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (current) => {
    if (decimals > 0) {
      return current.toFixed(decimals)
    }
    return Math.round(current).toString()
  })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span className={className}>{display}</motion.span>
}
