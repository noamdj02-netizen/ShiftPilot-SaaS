"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface NotificationPreferencesProps {
  employeeId: string
  email?: string
  phone?: string
}

interface Preferences {
  emailEnabled: boolean
  smsEnabled: boolean
}

export function NotificationPreferences({ employeeId, email, phone }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<Preferences>({
    emailEnabled: true,
    smsEnabled: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [employeeId])

  const fetchPreferences = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/employees/${employeeId}/notifications`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement")
      }

      setPreferences({
        emailEnabled: data.preferences?.emailEnabled ?? true,
        smsEnabled: data.preferences?.smsEnabled ?? true,
      })
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const response = await fetch(`/api/employees/${employeeId}/notifications`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailEnabled: preferences.emailEnabled,
          smsEnabled: preferences.smsEnabled,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la sauvegarde")
      }

      toast.success("Préférences de notification sauvegardées")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Préférences de notification</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
        <CardDescription>
          Choisissez comment vous souhaitez recevoir vos plannings et notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <Label htmlFor="email-notifications" className="text-base font-medium cursor-pointer">
                  Notifications par email
                </Label>
                <p className="text-sm text-muted-foreground">
                  {email || "Aucune adresse email configurée"}
                </p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.emailEnabled}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, emailEnabled: checked }))
              }
              disabled={!email}
            />
          </div>

          {/* SMS */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <Label htmlFor="sms-notifications" className="text-base font-medium cursor-pointer">
                  Notifications par SMS
                </Label>
                <p className="text-sm text-muted-foreground">
                  {phone || "Aucun numéro de téléphone configuré"}
                </p>
              </div>
            </div>
            <Switch
              id="sms-notifications"
              checked={preferences.smsEnabled}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, smsEnabled: checked }))
              }
              disabled={!phone}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              "Sauvegarder les préférences"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

