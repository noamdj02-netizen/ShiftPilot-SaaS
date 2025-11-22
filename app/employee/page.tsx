"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Clock,
  TrendingUp,
  CalendarDays,
  FileText,
  LogOut,
  User,
  Plus,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  Clock3,
  Bell,
  Download,
  Settings,
  Award,
  Target,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { PageTransition } from "@/components/animations/page-transition"
import { toast } from "sonner"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

interface LeaveRequest {
  id: string
  startDate: string
  endDate: string
  type: "paid" | "unpaid" | "sick" | "other"
  reason?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

interface Shift {
  id: string
  date: string
  startTime: string
  endTime: string
  role: string
  scheduleName: string
  employeeId: string
}

export default function EmployeeDashboardPage() {
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shifts, setShifts] = useState<Shift[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [stats, setStats] = useState({
    totalHours: 0,
    thisMonth: 0,
    thisWeek: 0,
    upcomingShifts: 0,
    leaveDays: 0,
    completedShifts: 0,
    averageHoursPerWeek: 0,
  })
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false)
  const [leaveForm, setLeaveForm] = useState({
    startDate: "",
    endDate: "",
    type: "paid" as "paid" | "unpaid" | "sick" | "other",
    reason: "",
  })

  useEffect(() => {
    fetchEmployeeData()
  }, [])

  useEffect(() => {
    if (employee) {
      fetchShifts()
      fetchLeaveRequests()
    }
  }, [employee])

  const fetchEmployeeData = async () => {
    try {
      const res = await fetch("/api/auth/employee/me")
      const data = await res.json()

      if (data.success) {
        setEmployee(data.employee)
      } else {
        router.push("/employee/login")
      }
    } catch (error) {
      router.push("/employee/login")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchShifts = async () => {
    if (!employee) return

    try {
      const res = await fetch("/api/schedules")
      const data = await res.json()

      if (data.success) {
        const allShifts: Shift[] = []
        data.schedules.forEach((schedule: any) => {
          if (schedule.shifts) {
            schedule.shifts.forEach((shift: any) => {
              if (shift.employeeId === employee.id) {
                allShifts.push({
                  ...shift,
                  scheduleName: schedule.name,
                })
              }
            })
          }
        })

        setShifts(allShifts)
        calculateStats(allShifts)
      }
    } catch (error) {
      console.error("Error fetching shifts:", error)
    }
  }

  const calculateStats = (allShifts: Shift[]) => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const thisWeekStart = startOfWeek(now, { locale: fr })
    const thisWeekEnd = endOfWeek(now, { locale: fr })

    let totalHours = 0
    let thisMonthHours = 0
    let thisWeekHours = 0
    let upcoming = 0
    let completed = 0

    allShifts.forEach((shift) => {
      const start = parseInt(shift.startTime?.split(":")[0] || "0")
      const end = parseInt(shift.endTime?.split(":")[0] || "0")
      const hours = Math.max(0, end - start)
      totalHours += hours

      const shiftDate = parseISO(shift.date)

      if (shiftDate.getMonth() === thisMonth && shiftDate.getFullYear() === thisYear) {
        thisMonthHours += hours
      }

      if (shiftDate >= thisWeekStart && shiftDate <= thisWeekEnd) {
        thisWeekHours += hours
      }

      if (shiftDate >= now) {
        upcoming++
      } else {
        completed++
      }
    })

    // Calculate average hours per week (last 4 weeks)
    const fourWeeksAgo = new Date(now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000)
    const recentShifts = allShifts.filter((shift) => parseISO(shift.date) >= fourWeeksAgo)
    const recentHours = recentShifts.reduce((total, shift) => {
      const start = parseInt(shift.startTime?.split(":")[0] || "0")
      const end = parseInt(shift.endTime?.split(":")[0] || "0")
      return total + Math.max(0, end - start)
    }, 0)
    const averageHoursPerWeek = recentHours / 4

    setStats({
      totalHours,
      thisMonth: thisMonthHours,
      thisWeek: thisWeekHours,
      upcomingShifts: upcoming,
      leaveDays: 0, // Will be updated by fetchLeaveRequests
      completedShifts: completed,
      averageHoursPerWeek: Math.round(averageHoursPerWeek * 10) / 10,
    })
  }

  const fetchLeaveRequests = async () => {
    if (!employee) return

    try {
      const res = await fetch(`/api/employee/leave-requests?employeeId=${employee.id}`)
      const data = await res.json()

      if (data.success) {
        setLeaveRequests(data.requests || [])
        const approvedDays = data.requests
          .filter((r: LeaveRequest) => r.status === "approved")
          .reduce((total: number, r: LeaveRequest) => {
            const start = parseISO(r.startDate)
            const end = parseISO(r.endDate)
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
            return total + days
          }, 0)
        setStats((prev) => ({ ...prev, leaveDays: approvedDays }))
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error)
    }
  }

  const handleSubmitLeaveRequest = async () => {
    if (!employee) return

    setIsSubmittingLeave(true)
    try {
      const res = await fetch("/api/employee/leave-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leaveForm,
          employeeId: employee.id,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Demande de congé envoyée")
        setIsLeaveDialogOpen(false)
        setLeaveForm({
          startDate: "",
          endDate: "",
          type: "paid",
          reason: "",
        })
        fetchLeaveRequests()
      } else {
        toast.error(data.error || "Erreur lors de la demande")
      }
    } catch (error) {
      toast.error("Erreur lors de la demande")
    } finally {
      setIsSubmittingLeave(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/employee/logout", { method: "POST" })
    router.push("/employee/login")
  }

  const getStatusBadge = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-accent-green/10 text-accent-green border-accent-green/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approuvé
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="h-3 w-3 mr-1" />
            Refusé
          </Badge>
        )
      default:
        return (
          <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        )
    }
  }

  const getWeekShifts = () => {
    const now = new Date()
    const weekStart = startOfWeek(now, { locale: fr })
    const weekEnd = endOfWeek(now, { locale: fr })
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return weekDays.map((day) => {
      const dayShifts = shifts.filter((shift) => {
        const shiftDate = parseISO(shift.date)
        return isSameDay(shiftDate, day)
      })

      return {
        date: day,
        shifts: dayShifts,
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  if (!employee) {
    return null
  }

  const upcomingShifts = shifts
    .filter((shift) => parseISO(shift.date) >= new Date())
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 10)

  const weekShifts = getWeekShifts()

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedBackground opacity={0.2} />

        {/* Header */}
        <header className="relative z-10 border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 flex items-center justify-center shadow-lg cursor-pointer"
                >
                  <User className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="font-bold text-foreground text-lg">
                    {employee.firstName} {employee.lastName}
                  </h1>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6 relative z-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass" className="backdrop-blur-md border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Heures totales</p>
                      <p className="text-3xl font-bold text-foreground">{stats.totalHours}h</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Moyenne: {stats.averageHoursPerWeek}h/semaine
                      </p>
                    </div>
                    <Clock className="h-10 w-10 text-chart-1 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass" className="backdrop-blur-md border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ce mois</p>
                      <p className="text-3xl font-bold text-foreground">{stats.thisMonth}h</p>
                      <p className="text-xs text-muted-foreground mt-1">Cette semaine: {stats.thisWeek}h</p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-chart-2 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass" className="backdrop-blur-md border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Prochains shifts</p>
                      <p className="text-3xl font-bold text-foreground">{stats.upcomingShifts}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stats.completedShifts} complétés
                      </p>
                    </div>
                    <CalendarDays className="h-10 w-10 text-chart-3 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="glass" className="backdrop-blur-md border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Congés</p>
                      <p className="text-3xl font-bold text-foreground">{stats.leaveDays}</p>
                      <p className="text-xs text-muted-foreground mt-1">Jours approuvés</p>
                    </div>
                    <Calendar className="h-10 w-10 text-accent-green opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs defaultValue="calendar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calendar">Semaine</TabsTrigger>
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="leave">Congés</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>

            {/* Weekly Calendar */}
            <TabsContent value="calendar" className="space-y-4">
              <Card variant="glass" className="backdrop-blur-md border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Planning de la semaine
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {format(startOfWeek(new Date(), { locale: fr }), "d MMMM", { locale: fr })} -{" "}
                    {format(endOfWeek(new Date(), { locale: fr }), "d MMMM yyyy", { locale: fr })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {weekShifts.map((day, index) => (
                      <motion.div
                        key={day.date.toISOString()}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "p-4 rounded-lg border border-border/50",
                          isSameDay(day.date, new Date())
                            ? "bg-primary/10 border-primary/30"
                            : "bg-muted/30"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-semibold text-foreground">
                                {format(day.date, "EEEE d", { locale: fr })}
                              </p>
                              {isSameDay(day.date, new Date()) && (
                                <Badge variant="outline" className="bg-primary/20 text-primary">
                                  Aujourd'hui
                                </Badge>
                              )}
                            </div>
                            {day.shifts.length === 0 ? (
                              <p className="text-sm text-muted-foreground">Aucun shift</p>
                            ) : (
                              <div className="space-y-2">
                                {day.shifts.map((shift) => (
                                  <div
                                    key={shift.id}
                                    className="flex items-center gap-3 p-2 rounded bg-background/50"
                                  >
                                    <div className="h-2 w-2 rounded-full bg-chart-1" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-foreground">
                                        {shift.startTime} - {shift.endTime}
                                      </p>
                                      <p className="text-xs text-muted-foreground">{shift.role}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Upcoming Shifts */}
            <TabsContent value="upcoming" className="space-y-4">
              <Card variant="glass" className="backdrop-blur-md border-border/50">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Mes prochains shifts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingShifts.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">Aucun shift à venir</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingShifts.map((shift, index) => (
                        <motion.div
                          key={shift.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-lg border border-border/50 bg-muted/30 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground mb-1">
                                {format(parseISO(shift.date), "EEEE d MMMM", { locale: fr })}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {shift.startTime} - {shift.endTime}
                                </div>
                                <Badge variant="outline">{shift.role}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                {shift.scheduleName}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leave Requests */}
            <TabsContent value="leave" className="space-y-4">
              <Card variant="glass" className="backdrop-blur-md border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Mes demandes de congés
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Gérez vos demandes de congés payés et autres absences
                      </CardDescription>
                    </div>
                    <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Nouvelle demande
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Demande de congé</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Remplissez le formulaire pour demander un congé
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-foreground">Date de début</Label>
                              <Input
                                type="date"
                                value={leaveForm.startDate}
                                onChange={(e) =>
                                  setLeaveForm({ ...leaveForm, startDate: e.target.value })
                                }
                                className="bg-background text-foreground border-border"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-foreground">Date de fin</Label>
                              <Input
                                type="date"
                                value={leaveForm.endDate}
                                onChange={(e) =>
                                  setLeaveForm({ ...leaveForm, endDate: e.target.value })
                                }
                                className="bg-background text-foreground border-border"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-foreground">Type de congé</Label>
                            <Select
                              value={leaveForm.type}
                              onValueChange={(value: any) =>
                                setLeaveForm({ ...leaveForm, type: value })
                              }
                            >
                              <SelectTrigger className="bg-background text-foreground border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="paid">Congés payés</SelectItem>
                                <SelectItem value="unpaid">Congés sans solde</SelectItem>
                                <SelectItem value="sick">Arrêt maladie</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-foreground">Raison (optionnel)</Label>
                            <Textarea
                              value={leaveForm.reason}
                              onChange={(e) =>
                                setLeaveForm({ ...leaveForm, reason: e.target.value })
                              }
                              placeholder="Expliquez la raison de votre demande..."
                              rows={3}
                              className="bg-background text-foreground border-border"
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsLeaveDialogOpen(false)}
                            disabled={isSubmittingLeave}
                          >
                            Annuler
                          </Button>
                          <Button onClick={handleSubmitLeaveRequest} disabled={isSubmittingLeave}>
                            {isSubmittingLeave ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Envoi...
                              </>
                            ) : (
                              "Envoyer la demande"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {leaveRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground mb-4">Aucune demande de congé</p>
                      <Button onClick={() => setIsLeaveDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Créer une demande
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leaveRequests.map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-lg border border-border/50 bg-muted/30 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">{getStatusBadge(request.status)}</div>
                              <p className="font-semibold text-foreground text-sm mb-1">
                                {format(parseISO(request.startDate), "d MMM", { locale: fr })} -{" "}
                                {format(parseISO(request.endDate), "d MMM yyyy", { locale: fr })}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize mb-2">
                                {request.type === "paid"
                                  ? "Congés payés"
                                  : request.type === "unpaid"
                                    ? "Congés sans solde"
                                    : request.type === "sick"
                                      ? "Arrêt maladie"
                                      : "Autre"}
                              </p>
                              {request.reason && (
                                <p className="text-xs text-muted-foreground italic">
                                  "{request.reason}"
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-2">
                                Demandé le {format(parseISO(request.createdAt), "d MMM yyyy", { locale: fr })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics */}
            <TabsContent value="stats" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card variant="glass" className="backdrop-blur-md border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Répartition des heures
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Ce mois</span>
                        <span className="text-sm font-semibold text-foreground">{stats.thisMonth}h</span>
                      </div>
                      <Progress value={(stats.thisMonth / 160) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Objectif: 160h/mois
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Cette semaine</span>
                        <span className="text-sm font-semibold text-foreground">{stats.thisWeek}h</span>
                      </div>
                      <Progress value={(stats.thisWeek / 40) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Objectif: 40h/semaine
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="glass" className="backdrop-blur-md border-border/50">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Performances
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-chart-1" />
                          <span className="text-sm text-foreground">Shifts complétés</span>
                        </div>
                        <span className="font-bold text-foreground">{stats.completedShifts}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-chart-2" />
                          <span className="text-sm text-foreground">Moyenne heures/semaine</span>
                        </div>
                        <span className="font-bold text-foreground">{stats.averageHoursPerWeek}h</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-accent-green" />
                          <span className="text-sm text-foreground">Jours de congé</span>
                        </div>
                        <span className="font-bold text-foreground">{stats.leaveDays} jours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PageTransition>
  )
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}
