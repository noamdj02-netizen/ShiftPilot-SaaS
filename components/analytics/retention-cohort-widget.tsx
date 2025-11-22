"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users } from "lucide-react"

interface RetentionCohortWidgetProps {
  cohorts: Array<{
    month: string
    retention: number
  }>
}

export function RetentionCohortWidget({ cohorts }: RetentionCohortWidgetProps) {
  const avgRetention = cohorts.length > 0 
    ? cohorts.reduce((sum, c) => sum + c.retention, 0) / cohorts.length 
    : 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Cohorte de Rétention</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription className="text-xs">Taux de rétention moyen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-3xl font-bold">{avgRetention.toFixed(1)}%</div>
          <div className="space-y-1">
            {cohorts.slice(0, 3).map((cohort, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{cohort.month}</span>
                <span className="font-medium">{cohort.retention.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

