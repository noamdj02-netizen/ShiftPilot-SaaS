"use client"
import { useScroll, useTransform, motion } from "framer-motion"
import type React from "react"

import { useRef } from "react"

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  speed?: number
}

export function ParallaxSection({ children, className = "", speed = 100 }: ParallaxSectionProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={className}
      transition={{ type: "tween", duration: 0 }}
    >
      {children}
    </motion.div>
  )
}
