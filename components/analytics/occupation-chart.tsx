"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface OccupationChartProps {
  data: Array<{
    day: string
    occupancy: number
  }>
}

export function OccupationChart({ data }: OccupationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="day" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          formatter={(value: number) => [`${value}%`, "Occupation"]}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="occupancy"
          stroke="hsl(var(--primary))"
          fillOpacity={1}
          fill="url(#colorOccupancy)"
          name="Taux d'occupation (%)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

