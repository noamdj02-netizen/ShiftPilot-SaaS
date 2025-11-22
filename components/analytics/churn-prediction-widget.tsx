"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingDown, AlertTriangle } from "lucide-react"

interface ChurnPredictionWidgetProps {
  prediction: number
}

export function ChurnPredictionWidget({ prediction }: ChurnPredictionWidgetProps) {
  const isHigh = prediction > 3
  const isMedium = prediction > 2 && prediction <= 3

  return (
    <Card 
      variant="glass" 
      className="hover:shadow-xl transition-all duration-300 border-l-4" 
      style={{ borderLeftColor: isHigh ? "hsl(var(--destructive))" : isMedium ? "hsl(var(--warning))" : "hsl(var(--primary))" }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">Prédiction de Churn</CardTitle>
          {isHigh ? (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          ) : (
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <CardDescription className="text-xs">Taux de désabonnement prévu</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">{prediction.toFixed(1)}%</div>
          <p className={`text-xs font-medium ${isHigh ? "text-destructive" : isMedium ? "text-warning" : "text-muted-foreground"}`}>
            {isHigh ? "Taux élevé - Action recommandée" : isMedium ? "Surveillance nécessaire" : "Taux stable"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

