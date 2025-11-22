"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Users, DollarSign, TrendingDown, TrendingUp, Calendar } from "lucide-react"
import { SkeletonCard } from "@/components/animations/skeleton-loader"
import { useAnalytics } from "@/hooks/useAnalytics"
import { MetricCard } from "@/components/analytics/metric-card"
import { ActiveUsersChart } from "@/components/analytics/active-users-chart"
import { RevenueChart } from "@/components/analytics/revenue-chart"
import { FeatureUsageChart } from "@/components/analytics/feature-usage-chart"
import { AcquisitionChart } from "@/components/analytics/acquisition-chart"
import { TopUsersTable } from "@/components/analytics/top-users-table"
import { TransactionsTable } from "@/components/analytics/transactions-table"
import { ChurnPredictionWidget } from "@/components/analytics/churn-prediction-widget"
import { MRRForecastWidget } from "@/components/analytics/mrr-forecast-widget"
import { RetentionCohortWidget } from "@/components/analytics/retention-cohort-widget"
import { useState } from "react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function AnalyticsPage() {
  const { data, isLoading, dateRange, setDateRange, customDateRange, setCustomDateRange } = useAnalytics()
  const [isCustomCalendarOpen, setIsCustomCalendarOpen] = useState(false)

  if (isLoading || !data) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <SkeletonCard />
      </div>
    )
  }

  const handleCustomDateSelect = (from: Date | undefined, to: Date | undefined) => {
    if (from && !to) {
      setCustomDateRange({ from, to: undefined })
    } else if (from && to) {
      setCustomDateRange({ from, to })
      setIsCustomCalendarOpen(false)
      setDateRange("custom")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header with Date Range Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">Statistiques et analyses détaillées de votre activité</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={dateRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("7d")}
            >
              7j
            </Button>
            <Button
              variant={dateRange === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("30d")}
            >
              30j
            </Button>
            <Button
              variant={dateRange === "90d" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("90d")}
            >
              90j
            </Button>
            <Popover open={isCustomCalendarOpen} onOpenChange={setIsCustomCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={dateRange === "custom" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "justify-start text-left font-normal",
                    !customDateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateRange.from ? (
                    customDateRange.to ? (
                      <>
                        {format(customDateRange.from, "d MMM")} - {format(customDateRange.to, "d MMM")}
                      </>
                    ) : (
                      format(customDateRange.from, "d MMM")
                    )
                  ) : (
                    "Personnalisé"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={customDateRange.from}
                  selected={{
                    from: customDateRange.from,
                    to: customDateRange.to,
                  }}
                  onSelect={(range) => handleCustomDateSelect(range?.from, range?.to)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* A) Top Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label={data.metrics.totalUsers.label}
            value={data.metrics.totalUsers.value.toLocaleString()}
            change={`+${data.metrics.totalUsers.change}%`}
            changeType="positive"
            icon={Users}
            delay={0}
          />
          <MetricCard
            label={data.metrics.revenueMRR.label}
            value={`$${data.metrics.revenueMRR.value.toLocaleString()}`}
            change={`+${data.metrics.revenueMRR.change}%`}
            changeType="positive"
            icon={DollarSign}
            delay={0.1}
          />
          <MetricCard
            label={data.metrics.churnRate.label}
            value={`${data.metrics.churnRate.value}%`}
            change={`${data.metrics.churnRate.change > 0 ? "+" : ""}${data.metrics.churnRate.change}%`}
            changeType={data.metrics.churnRate.change > 0 ? "negative" : "positive"}
            icon={TrendingDown}
            delay={0.2}
          />
          <MetricCard
            label={data.metrics.conversionRate.label}
            value={`${data.metrics.conversionRate.value}%`}
            change={`+${data.metrics.conversionRate.change}%`}
            changeType="positive"
            icon={TrendingUp}
            delay={0.3}
          />
        </div>

        {/* C) Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 1. Active Users Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs Actifs</CardTitle>
              <CardDescription>Évolution des utilisateurs actifs sur les 30 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <ActiveUsersChart data={data.chartData.activeUsers} />
            </CardContent>
          </Card>

          {/* 2. Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tendance des Revenus</CardTitle>
              <CardDescription>Évolution des revenus récurrents mensuels (MRR)</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart data={data.chartData.revenue} />
            </CardContent>
          </Card>

          {/* 3. Feature Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisation des Fonctionnalités</CardTitle>
              <CardDescription>Top 5 des fonctionnalités les plus utilisées</CardDescription>
            </CardHeader>
            <CardContent>
              <FeatureUsageChart data={data.chartData.featureUsage} />
            </CardContent>
          </Card>

          {/* 4. Acquisition Channel Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Canaux d'Acquisition</CardTitle>
              <CardDescription>Distribution des nouveaux utilisateurs par source</CardDescription>
            </CardHeader>
            <CardContent>
              <AcquisitionChart data={data.chartData.acquisition} />
            </CardContent>
          </Card>
        </div>

        {/* D) Tables Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Utilisateurs</CardTitle>
              <CardDescription>Utilisateurs les plus actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <TopUsersTable users={data.topUsers} />
            </CardContent>
          </Card>

          {/* Recent Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions Récentes</CardTitle>
              <CardDescription>Historique des dernières transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable transactions={data.transactions as any} />
            </CardContent>
          </Card>
        </div>

        {/* E) Extra Widgets Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <ChurnPredictionWidget prediction={data.widgets.churnPrediction} />
          <MRRForecastWidget forecast={data.widgets.mrrForecast} />
          <RetentionCohortWidget cohorts={(data as any).cohorts || []} />
        </div>
      </motion.div>
    </div>
  )
}
