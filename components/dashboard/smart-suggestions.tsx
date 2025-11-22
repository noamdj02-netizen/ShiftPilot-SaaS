"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, AlertCircle, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface Suggestion {
  id: string
  type: "optimization" | "alert" | "tip"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  action?: {
    label: string
    href: string
  }
}

export function SmartSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    // In production, use AI to generate suggestions
    // Mock suggestions for now
    const mockSuggestions: Suggestion[] = [
      {
        id: "1",
        type: "optimization",
        title: "Optimiser la couverture des shifts",
        description: "Vous pourriez réduire les coûts de 15% en réorganisant les shifts de fin de semaine",
        priority: "high",
        action: { label: "Voir les suggestions", href: "/dashboard/analytics" },
      },
      {
        id: "2",
        type: "tip",
        title: "Astuce : Utiliser les templates",
        description: "Créez des templates de planning pour gagner du temps sur les semaines récurrentes",
        priority: "medium",
        action: { label: "Créer un template", href: "/dashboard/schedules/templates" },
      },
    ]
    setSuggestions(mockSuggestions)
  }, [])

  const getIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "optimization":
        return <TrendingUp className="h-4 w-4 text-accent-green" />
      case "alert":
        return <AlertCircle className="h-4 w-4 text-accent" />
      default:
        return <Sparkles className="h-4 w-4 text-chart-1" />
    }
  }

  const getPriorityColor = (priority: Suggestion["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-accent-green/10 border-accent-green/20"
      case "medium":
        return "bg-chart-1/10 border-chart-1/20"
      default:
        return "bg-muted/50 border-border/50"
    }
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <Card variant="glass" className="backdrop-blur-md border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-chart-1" />
          Suggestions intelligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.slice(0, 3).map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)}`}
          >
            <div className="flex items-start gap-2 mb-2">
              {getIcon(suggestion.type)}
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">{suggestion.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>
                {suggestion.action && (
                  <Link href={suggestion.action.href}>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      {suggestion.action.label}
                    </Button>
                  </Link>
                )}
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${
                  suggestion.priority === "high"
                    ? "border-accent-green/50 text-accent-green"
                    : suggestion.priority === "medium"
                      ? "border-chart-1/50 text-chart-1"
                      : ""
                }`}
              >
                {suggestion.priority === "high" ? "Important" : suggestion.priority === "medium" ? "Moyen" : "Info"}
              </Badge>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

