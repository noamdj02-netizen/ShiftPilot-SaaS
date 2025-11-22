"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface ResetLayoutButtonProps {
  onReset: () => void
}

export function ResetLayoutButton({ onReset }: ResetLayoutButtonProps) {
  const handleReset = () => {
    localStorage.removeItem("dashboard-layout")
    onReset()
    toast.success("Layout réinitialisé")
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="text-xs"
        title="Réinitialiser l'organisation des widgets"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Réinitialiser
      </Button>
    </motion.div>
  )
}

