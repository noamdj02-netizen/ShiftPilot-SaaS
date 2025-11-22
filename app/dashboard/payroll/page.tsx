"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarIcon, Download, DollarSign, Calendar, Filter } from "lucide-react"
import { motion } from "framer-motion"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { PageTransition } from "@/components/animations/page-transition"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function PayrollPage() {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()))
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()))
  const [isExporting, setIsExporting] = useState(false)
  const [payrollData, setPayrollData] = useState<any[]>([])
  const [totalHours, setTotalHours] = useState(0)
  const [totalCost, setTotalCost] = useState(0)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const startDateStr = format(startDate, "yyyy-MM-dd")
      const endDateStr = format(endDate, "yyyy-MM-dd")

      const res = await fetch(
        `/api/payroll/export?startDate=${startDateStr}&endDate=${endDateStr}`
      )

      if (!res.ok) {
        throw new Error("Erreur lors de l'export")
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `payroll-${startDateStr}-to-${endDateStr}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Export réussi")
    } catch (error) {
      toast.error("Erreur lors de l'export")
    } finally {
      setIsExporting(false)
    }
  }

  // In production, fetch actual payroll data
  useEffect(() => {
    // Mock data for demonstration
    const mockData = [
      {
        employeeId: "1",
        employeeName: "Marie Dubois",
        totalHours: 120,
        totalAmount: 1500,
      },
      {
        employeeId: "2",
        employeeName: "Thomas Martin",
        totalHours: 150,
        totalAmount: 2250,
      },
    ]
    setPayrollData(mockData)
    setTotalHours(mockData.reduce((acc, e) => acc + e.totalHours, 0))
    setTotalCost(mockData.reduce((acc, e) => acc + e.totalAmount, 0))
  }, [startDate, endDate])

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedBackground opacity={0.2} />
        <DashboardHeader />

        <main className="container mx-auto px-4 py-6 space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <DollarSign className="h-8 w-8" />
                Paie et pointage
              </h1>
              <p className="text-muted-foreground">
                Exportez les données pour la comptabilité et la paie
              </p>
            </div>
          </motion.div>

          {/* Filters */}
          <Card variant="glass" className="backdrop-blur-md border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Période
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background text-foreground border-border",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Sélectionner"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background text-foreground border-border",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yyyy") : "Sélectionner"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50">
                <Button onClick={handleExport} disabled={isExporting} className="w-full">
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Export en cours...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Exporter en CSV
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass" className="backdrop-blur-md border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg">Employés</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{payrollData.length}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass" className="backdrop-blur-md border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg">Heures totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{totalHours}h</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass" className="backdrop-blur-md border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg">Coût total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{totalCost.toFixed(2)}€</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Payroll Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="glass" className="backdrop-blur-md border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Détail par employé</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Résumé des heures et coûts pour la période sélectionnée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Employé</th>
                        <th className="text-center py-3 px-4 font-semibold text-foreground">Heures</th>
                        <th className="text-right py-3 px-4 font-semibold text-foreground">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollData.map((employee, index) => (
                        <motion.tr
                          key={employee.employeeId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-3 px-4 text-foreground font-medium">{employee.employeeName}</td>
                          <td className="py-3 px-4 text-center text-muted-foreground">{employee.totalHours}h</td>
                          <td className="py-3 px-4 text-right text-foreground font-semibold">
                            {employee.totalAmount.toFixed(2)}€
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border font-bold">
                        <td className="py-3 px-4 text-foreground">Total</td>
                        <td className="py-3 px-4 text-center text-foreground">{totalHours}h</td>
                        <td className="py-3 px-4 text-right text-foreground">{totalCost.toFixed(2)}€</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  )
}

