"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle2, XCircle, Clock, User } from "lucide-react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { PageTransition } from "@/components/animations/page-transition"
import { AnimatedBackground } from "@/components/animations/animated-background"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { toast } from "sonner"

interface ExchangeRequest {
  id: string
  scheduleId: string
  shiftId: string
  fromEmployeeId: string
  toEmployeeId: string
  message?: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  requestedAt: string
  respondedAt?: string
}

export default function ShiftExchangePage() {
  const [requests, setRequests] = useState<ExchangeRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all")

  useEffect(() => {
    fetchExchangeRequests()
  }, [filter])

  const fetchExchangeRequests = async () => {
    try {
      const params = filter !== "all" ? `?status=${filter}` : ""
      const res = await fetch(`/api/shifts/exchange${params}`)
      const data = await res.json()

      if (data.success) {
        setRequests(data.requests || [])
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des demandes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRespond = async (requestId: string, action: "accept" | "reject") => {
    try {
      const res = await fetch(`/api/shifts/exchange/${requestId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(`Demande ${action === "accept" ? "acceptée" : "refusée"}`)
        fetchExchangeRequests()
      } else {
        toast.error(data.error || "Erreur")
      }
    } catch (error) {
      toast.error("Erreur lors de la réponse")
    }
  }

  const getStatusBadge = (status: ExchangeRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-chart-1/10 border-chart-1/20 text-chart-1">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="outline" className="bg-accent-green/10 border-accent-green/20 text-accent-green">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Acceptée
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-destructive/10 border-destructive/20 text-destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Refusée
          </Badge>
        )
      default:
        return null
    }
  }

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
                <RefreshCw className="h-8 w-8" />
                Échanges de shifts
              </h1>
              <p className="text-muted-foreground">Gérez les demandes d'échange de shifts</p>
            </div>
          </motion.div>

          {/* Filters */}
          <div className="flex gap-2">
            {(["all", "pending", "accepted", "rejected"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "Tous" : f === "pending" ? "En attente" : f === "accepted" ? "Acceptées" : "Refusées"}
              </Button>
            ))}
          </div>

          {/* Requests List */}
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <Card variant="glass" className="backdrop-blur-md">
              <CardContent className="p-12 text-center">
                <RefreshCw className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Aucune demande d'échange</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card variant="glass" className="backdrop-blur-md border-border/50 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            {getStatusBadge(request.status)}
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(request.requestedAt), "dd MMMM yyyy à HH:mm", { locale: fr })}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">
                                <strong>{request.fromEmployeeId}</strong> souhaite échanger avec{" "}
                                <strong>{request.toEmployeeId}</strong>
                              </span>
                            </div>

                            {request.message && (
                              <p className="text-sm text-muted-foreground pl-6 italic">
                                "{request.message}"
                              </p>
                            )}
                          </div>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRespond(request.id, "reject")}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Refuser
                            </Button>
                            <Button size="sm" onClick={() => handleRespond(request.id, "accept")}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Accepter
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  )
}

