"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles, TrendingDown, AlertCircle, CheckCircle2, Loader2, Zap } from "lucide-react"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Link from "next/link"

interface OptimizationResult {
  optimized: boolean
  improvements: string[]
  costSavings?: number
  hoursOptimized?: number
  conflictsResolved?: number
  suggestions: string[]
}

interface OptimizationPanelProps {
  scheduleId: string
}

export function OptimizationPanel({ scheduleId }: OptimizationPanelProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [constraints, setConstraints] = useState({
    respectAvailabilities: true,
    balanceWorkload: true,
    minimizeCosts: true,
  })

  const handleOptimize = async () => {
    setIsOptimizing(true)
    try {
      const res = await fetch("/api/schedules/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId,
          constraints,
        }),
      })

      const data = await res.json()

      if (data.success) {
        setResult(data.result)
        if (data.result.conflictsResolved && data.result.conflictsResolved > 0) {
          toast.success(`${data.result.conflictsResolved} conflits résolus`)
        }
      } else {
        toast.error(data.error || "Erreur lors de l'optimisation")
      }
    } catch (error) {
      toast.error("Erreur lors de l'optimisation")
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <Card variant="glass" className="backdrop-blur-md border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-chart-1" />
          Optimisation intelligente
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Analysez et optimisez votre planning avec l'IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Constraints */}
        <div className="space-y-3">
          <Label className="text-foreground text-sm font-medium">Contraintes d'optimisation</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={constraints.respectAvailabilities}
                onChange={(e) =>
                  setConstraints({ ...constraints, respectAvailabilities: e.target.checked })
                }
                className="rounded border-border"
              />
              Respecter les disponibilités
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={constraints.balanceWorkload}
                onChange={(e) =>
                  setConstraints({ ...constraints, balanceWorkload: e.target.checked })
                }
                className="rounded border-border"
              />
              Équilibrer la charge de travail
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={constraints.minimizeCosts}
                onChange={(e) =>
                  setConstraints({ ...constraints, minimizeCosts: e.target.checked })
                }
                className="rounded border-border"
              />
              Minimiser les coûts
            </label>
          </div>
        </div>

        {/* Optimize Button */}
        <Button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="w-full"
          variant="default"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Optimisation en cours...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Optimiser le planning
            </>
          )}
        </Button>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 pt-4 border-t border-border/50"
          >
            <div className="flex items-center gap-2">
              {result.optimized ? (
                <CheckCircle2 className="h-5 w-5 text-accent-green" />
              ) : (
                <AlertCircle className="h-5 w-5 text-accent" />
              )}
              <span className="font-medium text-foreground">
                {result.optimized ? "Planning optimisé" : "Optimisations disponibles"}
              </span>
            </div>

            {result.conflictsResolved !== undefined && result.conflictsResolved > 0 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-foreground">
                  <strong>{result.conflictsResolved}</strong> conflit(s) détecté(s)
                </p>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Suggestions :</p>
                <ul className="space-y-1">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-chart-1 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.costSavings !== undefined && result.costSavings > 0 && (
              <div className="p-3 rounded-lg bg-accent-green/10 border border-accent-green/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="h-4 w-4 text-accent-green" />
                  <span className="font-medium text-accent-green">
                    Économies potentielles : {result.costSavings.toFixed(2)}€
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

