"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RefreshCw, Send, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { format } from "date-fns"

interface ShiftExchangeRequestProps {
  scheduleId: string
  shiftId: string
  employeeId: string
  date: string
  startTime: string
  endTime: string
  role: string
  employees?: Array<{ id: string; firstName: string; lastName: string; role: string }>
}

export function ShiftExchangeRequest({
  scheduleId,
  shiftId,
  employeeId,
  date,
  startTime,
  endTime,
  role,
  employees = [],
}: ShiftExchangeRequestProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [targetEmployeeId, setTargetEmployeeId] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRequest = async () => {
    if (!targetEmployeeId) {
      toast.error("Sélectionnez un employé")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/shifts/request-exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId,
          shiftId,
          fromEmployeeId: employeeId,
          toEmployeeId: targetEmployeeId,
          message: message || undefined,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Demande d'échange envoyée")
        setIsOpen(false)
        setTargetEmployeeId("")
        setMessage("")
      } else {
        toast.error(data.error || "Erreur lors de la demande")
      }
    } catch (error) {
      toast.error("Erreur lors de la demande d'échange")
    } finally {
      setIsLoading(false)
    }
  }

  const availableEmployees = employees.filter(
    (e) => e.id !== employeeId && (e.role === role || !role)
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Demander un échange
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Demander un échange de shift</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {format(new Date(date), "dd MMMM yyyy")} - {startTime} à {endTime}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee" className="text-foreground">
              Échanger avec <span className="text-destructive">*</span>
            </Label>
            <Select value={targetEmployeeId} onValueChange={setTargetEmployeeId}>
              <SelectTrigger className="bg-background text-foreground border-border">
                <SelectValue placeholder="Sélectionnez un employé" />
              </SelectTrigger>
              <SelectContent>
                {availableEmployees.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Aucun employé disponible
                  </SelectItem>
                ) : (
                  availableEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName} ({employee.role})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground">
              Message (optionnel)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Expliquez pourquoi vous souhaitez échanger ce shift..."
              rows={3}
              className="bg-background text-foreground border-border"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleRequest} disabled={isLoading || !targetEmployeeId}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer la demande
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

