"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ProgressIndicator } from "@/components/animations/progress-indicator"
import { toast } from "sonner"

export function AIScheduleGenerator() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    minHoursPerEmployee: "",
    maxHoursPerEmployee: "",
    constraints: "",
    respectPreferences: true,
    balanceWorkload: true,
    minimizeCosts: false,
  })

  const progressSteps = [
    { label: "Analyse", status: "pending" as const },
    { label: "Optimisation", status: "pending" as const },
    { label: "Génération", status: "pending" as const },
    { label: "Finalisation", status: "pending" as const },
  ]

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setGenerationStep(0)

    try {
      // Simulate progress steps
      const steps = [
        { delay: 500, step: 0 },
        { delay: 1000, step: 1 },
        { delay: 1500, step: 2 },
        { delay: 2000, step: 3 },
      ]

      for (const { delay, step } of steps) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        setGenerationStep(step)
      }

      const response = await fetch("/api/schedules/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          minHoursPerEmployee: formData.minHoursPerEmployee
            ? Number(formData.minHoursPerEmployee)
            : undefined,
          maxHoursPerEmployee: formData.maxHoursPerEmployee
            ? Number(formData.maxHoursPerEmployee)
            : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur de génération")
      }

      const data = await response.json()
      toast.success("Planning généré avec succès!")
      router.push(`/dashboard/schedules/${data.scheduleId}`)
    } catch (error) {
      console.error("Error generating schedule:", error)
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue lors de la génération"
      )
      setIsGenerating(false)
      setGenerationStep(0)
    }
  }

  const currentProgressSteps = progressSteps.map((step, index) => ({
    ...step,
    status:
      index < generationStep
        ? ("completed" as const)
        : index === generationStep
          ? ("active" as const)
          : ("pending" as const),
  }))

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-6 bg-muted/50 rounded-lg border border-border"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <h3 className="font-semibold">Génération du planning en cours...</h3>
                </div>
                <ProgressIndicator steps={currentProgressSteps} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.form
          onSubmit={handleGenerate}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nom du planning</Label>
            <Input
              id="name"
              placeholder="Planning Semaine 5 - Janvier"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isGenerating}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minHours">Heures min par employé</Label>
              <Input
                id="minHours"
                type="number"
                min="0"
                placeholder="20"
                value={formData.minHoursPerEmployee}
                onChange={(e) => setFormData({ ...formData, minHoursPerEmployee: e.target.value })}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxHours">Heures max par employé</Label>
              <Input
                id="maxHours"
                type="number"
                min="0"
                placeholder="40"
                value={formData.maxHoursPerEmployee}
                onChange={(e) => setFormData({ ...formData, maxHoursPerEmployee: e.target.value })}
                disabled={isGenerating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="constraints">Contraintes supplémentaires</Label>
            <Textarea
              id="constraints"
              placeholder="Ex: Marie ne peut pas travailler le lundi, Thomas doit avoir 2 jours de repos consécutifs..."
              rows={4}
              value={formData.constraints}
              onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-3">
            <Label>Optimisations</Label>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="respectPreferences"
                checked={formData.respectPreferences}
                onCheckedChange={(checked) => setFormData({ ...formData, respectPreferences: checked as boolean })}
                disabled={isGenerating}
              />
              <label
                htmlFor="respectPreferences"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Respecter les préférences des employés
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="balanceWorkload"
                checked={formData.balanceWorkload}
                onCheckedChange={(checked) => setFormData({ ...formData, balanceWorkload: checked as boolean })}
                disabled={isGenerating}
              />
              <label
                htmlFor="balanceWorkload"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Équilibrer la charge de travail
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="minimizeCosts"
                checked={formData.minimizeCosts}
                onCheckedChange={(checked) => setFormData({ ...formData, minimizeCosts: checked as boolean })}
                disabled={isGenerating}
              />
              <label
                htmlFor="minimizeCosts"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Minimiser les coûts
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" disabled={isGenerating} className="gap-2">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Générer le planning
                  </>
                )}
              </Button>
            </motion.div>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isGenerating}>
              Annuler
            </Button>
          </div>
        </motion.form>
      </CardContent>
    </Card>
  )
}
