"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, DollarSign } from "lucide-react"

interface MRRForecastWidgetProps {
  forecast: number
}

export function MRRForecastWidget({ forecast }: MRRForecastWidgetProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Prévision MRR</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </div>
        <CardDescription className="text-xs">Revenus récurrents mensuels prévus</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div className="text-3xl font-bold">{forecast.toLocaleString()}</div>
          </div>
          <p className="text-xs text-muted-foreground">Pour le mois prochain</p>
        </div>
      </CardContent>
    </Card>
  )
}

