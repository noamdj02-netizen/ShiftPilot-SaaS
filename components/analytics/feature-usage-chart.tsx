"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface FeatureUsageChartProps {
  data: Array<{
    name: string
    usage: number
  }>
}

export function FeatureUsageChart({ data }: FeatureUsageChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis type="number" className="text-xs" />
        <YAxis type="category" dataKey="name" className="text-xs" width={80} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          formatter={(value: number) => [`${value} utilisations`, "Usage"]}
        />
        <Legend />
        <Bar dataKey="usage" fill="hsl(var(--primary))" name="Utilisations" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

