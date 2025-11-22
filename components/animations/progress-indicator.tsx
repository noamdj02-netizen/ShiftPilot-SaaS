"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Loader2 } from "lucide-react"

interface ProgressStep {
  label: string
  status: "pending" | "active" | "completed"
}

interface ProgressIndicatorProps {
  steps: ProgressStep[]
  className?: string
}

export function ProgressIndicator({ steps, className = "" }: ProgressIndicatorProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step.status === "completed"
                ? "bg-accent-green border-accent-green text-white"
                : step.status === "active"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-muted-foreground/30 text-muted-foreground"
            }`}
          >
            {step.status === "completed" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : step.status === "active" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="text-xs font-semibold">{index + 1}</span>
            )}
          </motion.div>
          <span
            className={`text-sm font-medium ${
              step.status === "completed"
                ? "text-foreground"
                : step.status === "active"
                  ? "text-accent"
                  : "text-muted-foreground"
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: step.status === "completed" ? 1 : 0 }}
              className={`h-0.5 w-12 ${
                step.status === "completed" ? "bg-accent-green" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

