"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

interface ActiveUsersChartProps {
  data: Array<{
    date: string
    users: number
  }>
}

export function ActiveUsersChart({ data }: ActiveUsersChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    dateFormatted: format(new Date(item.date), "d MMM"),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="dateFormatted" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          labelFormatter={(label) => `Date: ${label}`}
          formatter={(value: number) => [`${value} utilisateurs`, "Utilisateurs actifs"]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="users"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="Utilisateurs actifs"
          dot={{ fill: "hsl(var(--primary))", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

