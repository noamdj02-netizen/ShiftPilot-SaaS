"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Users, UserCheck, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

const emailTemplates = [
  {
    id: "schedule",
    name: "Planning publié",
    subject: "Votre planning est disponible",
    message: "Bonjour {{employeeName}},\n\nVotre planning a été publié. Consultez-le sur votre espace ShiftPilot.\n\nCordialement,\n{{companyName}}",
  },
  {
    id: "reminder",
    name: "Rappel de shift",
    subject: "Rappel : Votre shift arrive bientôt",
    message: "Bonjour {{employeeName}},\n\nRappel : Vous avez un shift prévu demain. Veuillez confirmer votre présence.\n\nCordialement,\n{{companyName}}",
  },
  {
    id: "meeting",
    name: "Réunion d'équipe",
    subject: "Réunion d'équipe programmée",
    message: "Bonjour {{employeeName}},\n\nUne réunion d'équipe est programmée. Nous comptons sur votre présence.\n\nCordialement,\n{{companyName}}",
  },
  {
    id: "custom",
    name: "Message personnalisé",
    subject: "",
    message: "",
  },
]

export function EmployeeEmailComposer() {
  const [isOpen, setIsOpen] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [sendToAll, setSendToAll] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("custom")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingEmployees, setIsFetchingEmployees] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchEmployees()
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedTemplate !== "custom") {
      const template = emailTemplates.find((t) => t.id === selectedTemplate)
      if (template) {
        setSubject(template.subject)
        setMessage(template.message)
      }
    }
  }, [selectedTemplate])

  const fetchEmployees = async () => {
    setIsFetchingEmployees(true)
    try {
      const res = await fetch("/api/employees")
      const data = await res.json()
      if (data.employees) {
        setEmployees(data.employees.filter((e: Employee) => e.email))
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des employés")
    } finally {
      setIsFetchingEmployees(false)
    }
  }

  const handleToggleEmployee = (employeeId: string) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId))
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId])
    }
    setSendToAll(false)
  }

  const handleSendToAll = (checked: boolean) => {
    setSendToAll(checked)
    if (checked) {
      setSelectedEmployees([])
    }
  }

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Le sujet et le message sont requis")
      return
    }

    if (!sendToAll && selectedEmployees.length === 0) {
      toast.error("Sélectionnez au moins un employé")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/employees/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeIds: sendToAll ? null : selectedEmployees,
          subject,
          message,
          template: selectedTemplate,
          sendToAll,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(`${data.sent} email(s) envoyé(s) avec succès`)
        setIsOpen(false)
        setSubject("")
        setMessage("")
        setSelectedEmployees([])
        setSendToAll(false)
        setSelectedTemplate("custom")
      } else {
        toast.error(data.error || "Erreur lors de l'envoi")
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi des emails")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCount = sendToAll ? employees.length : selectedEmployees.length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Envoyer un email
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Envoyer un email aux employés
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Envoyez un email à un ou plusieurs employés
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selector */}
          <div className="space-y-2">
            <Label className="text-foreground">Template de message</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="bg-background text-foreground border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Destinataires</Label>
              <Badge variant="outline" className="bg-muted/50 text-foreground">
                {selectedCount} sélectionné(s)
              </Badge>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 bg-muted/30">
              <Checkbox
                id="sendToAll"
                checked={sendToAll}
                onCheckedChange={handleSendToAll}
              />
              <Label htmlFor="sendToAll" className="font-medium text-foreground cursor-pointer">
                Envoyer à tous les employés ({employees.length})
              </Label>
            </div>

            {!sendToAll && (
              <div className="max-h-48 overflow-y-auto space-y-2 border border-border/50 rounded-lg p-3 bg-muted/20">
                {isFetchingEmployees ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : employees.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun employé avec email disponible
                  </p>
                ) : (
                  employees.map((employee) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={employee.id}
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={() => handleToggleEmployee(employee.id)}
                      />
                      <Label
                        htmlFor={employee.id}
                        className="flex-1 cursor-pointer text-foreground"
                      >
                        <span className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">({employee.email})</span>
                        {employee.role && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {employee.role}
                          </Badge>
                        )}
                      </Label>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-foreground">
              Sujet <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Sujet de l'email"
              className="bg-background text-foreground border-border"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message..."
              rows={8}
              className="bg-background text-foreground border-border resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Variables disponibles : {"{{employeeName}}"}, {"{{companyName}}"}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSend} disabled={isLoading || selectedCount === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer ({selectedCount})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

