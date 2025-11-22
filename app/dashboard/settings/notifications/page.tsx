"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState({
    emailReports: true,
    emailAlerts: true,
    emailScheduleChanges: true,
    emailMarketing: false,
    pushNotifications: true,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch("/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la sauvegarde")
      }

      toast.success("Préférences de notifications mises à jour")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Notifications par email</CardTitle>
          <CardDescription>Configurez les notifications que vous souhaitez recevoir par email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rapports hebdomadaires</Label>
                <p className="text-sm text-muted-foreground">Recevoir un rapport hebdomadaire par email</p>
              </div>
              <Switch
                checked={settings.emailReports}
                onCheckedChange={(checked) => setSettings({ ...settings, emailReports: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertes shifts</Label>
                <p className="text-sm text-muted-foreground">Notifications pour les changements de shifts</p>
              </div>
              <Switch
                checked={settings.emailAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, emailAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Changements de planning</Label>
                <p className="text-sm text-muted-foreground">Notifier les modifications de planning</p>
              </div>
              <Switch
                checked={settings.emailScheduleChanges}
                onCheckedChange={(checked) => setSettings({ ...settings, emailScheduleChanges: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing</Label>
                <p className="text-sm text-muted-foreground">Recevoir nos actualités et offres</p>
              </div>
              <Switch
                checked={settings.emailMarketing}
                onCheckedChange={(checked) => setSettings({ ...settings, emailMarketing: checked })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications en application</CardTitle>
          <CardDescription>Configurer les notifications affichées dans l'application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications push</Label>
              <p className="text-sm text-muted-foreground">Activer les notifications push dans l'application</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

