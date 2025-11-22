"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export interface AnalyticsMetrics {
  totalUsers: { value: number; change: number; label: string }
  revenueMRR: { value: number; change: number; label: string }
  churnRate: { value: number; change: number; label: string }
  conversionRate: { value: number; change: number; label: string }
}

export interface ChartData {
  activeUsers: Array<{ date: string; users: number }>
  revenue: Array<{ date: string; revenue: number }>
  featureUsage: Array<{ name: string; usage: number }>
  acquisition: Array<{ name: string; value: number }>
}

export interface TopUser {
  id: string
  name: string
  email: string
  activity: number
  lastActive: string
  status: "active" | "inactive"
}

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "credit" | "debit"
}

export interface AnalyticsWidgets {
  churnPrediction: number
  mrrForecast: number
}

export interface AnalyticsData {
  metrics: AnalyticsMetrics
  chartData: ChartData
  topUsers: TopUser[]
  transactions: Transaction[]
  widgets: AnalyticsWidgets
}

export type DateRange = "7d" | "30d" | "90d" | "custom"

interface UseAnalyticsReturn {
  data: AnalyticsData | null
  isLoading: boolean
  error: string | null
  dateRange: DateRange
  customDateRange: { from?: Date; to?: Date }
  fetchAnalytics: () => Promise<void>
  setDateRange: (range: DateRange) => void
  setCustomDateRange: (range: { from?: Date; to?: Date }) => void
}

export function useAnalytics(): UseAnalyticsReturn {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>("30d")
  const [customDateRange, setCustomDateRange] = useState<{ from?: Date; to?: Date }>({})

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        period: dateRange,
        ...(dateRange === "custom" && customDateRange.from && customDateRange.to
          ? {
              from: customDateRange.from.toISOString(),
              to: customDateRange.to.toISOString(),
            }
          : {}),
      })

      const response = await fetch(`/api/analytics/full?${params.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors du chargement des analytics")
      }

      setData(result.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [dateRange, customDateRange])

  useEffect(() => {
    if (dateRange !== "custom" || (customDateRange.from && customDateRange.to)) {
      fetchAnalytics()
    }
  }, [dateRange, customDateRange, fetchAnalytics])

  return {
    data,
    isLoading,
    error,
    dateRange,
    customDateRange,
    fetchAnalytics,
    setDateRange,
    setCustomDateRange,
  }
}

