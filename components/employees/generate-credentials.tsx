"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Key, Mail, Copy, CheckCircle2, Loader2, Send } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email?: string
  role: string
  phone?: string
}

interface GeneratedCredentials {
  employeeId: string
  email: string
  password: string
  loginUrl: string
}

interface GenerateCredentialsProps {
  employee: Employee
  onCredentialsGenerated?: (credentials: GeneratedCredentials) => void
}

export function GenerateCredentials({ employee, onCredentialsGenerated }: GenerateCredentialsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [credentials, setCredentials] = useState<GeneratedCredentials | null>(null)
  const [email, setEmail] = useState(employee.email || "")

  const generatePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }

  const handleGenerate = async () => {
    if (!email) {
      toast.error("Veuillez entrer un email")
      return
    }

    setIsGenerating(true)
    try {
      const password = generatePassword()
      const loginEmail = email.toLowerCase().trim()

      const res = await fetch(`/api/employees/${employee.id}/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password,
        }),
      })

      const data = await res.json()

      if (data.success) {
        const generatedCredentials: GeneratedCredentials = {
          employeeId: employee.id,
          email: loginEmail,
          password,
          loginUrl: `${window.location.origin}/employee/login`,
        }
        setCredentials(generatedCredentials)
        toast.success("Identifiants générés avec succès")
        onCredentialsGenerated?.(generatedCredentials)
      } else {
        toast.error(data.error || "Erreur lors de la génération")
      }
    } catch (error) {
      toast.error("Erreur lors de la génération des identifiants")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copié dans le presse-papiers`)
    } catch (error) {
      toast.error("Erreur lors de la copie")
    }
  }

  const handleSendEmail = async () => {
    if (!credentials) return

    setIsSending(true)
    try {
      const res = await fetch("/api/employees/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: [employee.id],
          subject: "Vos identifiants ShiftPilot",
          template: "credentials",
          templateData: {
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: credentials.email,
            password: credentials.password,
            loginUrl: credentials.loginUrl,
          },
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Email envoyé avec succès")
        setIsOpen(false)
      } else {
        toast.error(data.error || "Erreur lors de l'envoi")
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Key className="mr-2 h-4 w-4" />
          Générer identifiants
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Key className="h-5 w-5 text-chart-1" />
            Générer des identifiants
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Pour {employee.firstName} {employee.lastName}
          </DialogDescription>
        </DialogHeader>

        {!credentials ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email de connexion <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="employe@restaurant.com"
                className="bg-background text-foreground border-border"
              />
              <p className="text-xs text-muted-foreground">
                L'employé utilisera cet email pour se connecter à son dashboard
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isGenerating}>
                Annuler
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Générer
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-accent-green/10 border border-accent-green/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-accent-green" />
                <span className="font-semibold text-foreground">Identifiants générés avec succès</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Copiez ces identifiants ou envoyez-les par email à l'employé
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium">Email de connexion</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={credentials.email}
                    readOnly
                    className="bg-muted text-foreground border-border font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(credentials.email, "Email")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium">Mot de passe</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={credentials.password}
                    readOnly
                    type="password"
                    className="bg-muted text-foreground border-border font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(credentials.password, "Mot de passe")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Notez ce mot de passe, il ne sera plus visible après fermeture
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium">URL de connexion</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={credentials.loginUrl}
                    readOnly
                    className="bg-muted text-foreground border-border text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(credentials.loginUrl, "URL")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSending}>
                Fermer
              </Button>
              <Button onClick={handleSendEmail} disabled={isSending} className="w-full sm:w-auto">
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer par email
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

