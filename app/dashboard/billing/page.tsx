"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { CreditCard, Download, Check, ArrowUp, Calendar } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Pour les petits restaurants",
    features: ["Jusqu'à 10 employés", "Plannings illimités", "Support email"],
    current: false,
  },
  {
    name: "Pro",
    price: 79,
    description: "Pour les restaurants établis",
    features: ["Jusqu'à 50 employés", "Génération IA", "Export PDF/iCal", "Support prioritaire"],
    current: true,
  },
  {
    name: "Enterprise",
    price: 199,
    description: "Pour les chaînes de restaurants",
    features: ["Employés illimités", "Multi-locations", "API", "Support dédié"],
    current: false,
  },
]

const invoices = [
  { id: 1, date: new Date("2024-01-01"), description: "Abonnement Pro - Janvier 2024", amount: 79, status: "paid" },
  { id: 2, date: new Date("2023-12-01"), description: "Abonnement Pro - Décembre 2023", amount: 79, status: "paid" },
  { id: 3, date: new Date("2023-11-01"), description: "Abonnement Pro - Novembre 2023", amount: 79, status: "paid" },
]

export default function BillingPage() {
  const currentPlan = plans.find((p) => p.current) || plans[1]
  const nextBillingDate = new Date()
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Facturation</h1>
          <p className="text-muted-foreground">Gérez votre abonnement et vos factures</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: "spring" }}
          >
            <Card variant="glass" className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-foreground">Plan actuel</CardTitle>
                <CardDescription>Votre abonnement actuel</CardDescription>
              </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-foreground">{currentPlan.name}</h3>
                  <Badge variant="default">Actif</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{currentPlan.description}</p>
                <div className="text-3xl font-bold mb-2 text-foreground">
                  {currentPlan.price}€<span className="text-lg text-muted-foreground">/mois</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Fonctionnalités incluses :</p>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Prochain renouvellement</span>
                  <span className="font-medium flex items-center gap-1 text-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(nextBillingDate, "d MMMM yyyy")}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    toast.info("Fonctionnalité de changement de plan à venir")
                  }}
                >
                  Modifier le plan
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    if (confirm("Êtes-vous sûr de vouloir annuler votre abonnement ?")) {
                      toast.info("Fonctionnalité d'annulation d'abonnement à venir")
                    }
                  }}
                >
                  Annuler l'abonnement
                </Button>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Card variant="glass" className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-foreground">Méthode de paiement</CardTitle>
                <CardDescription>Gérez votre méthode de paiement</CardDescription>
              </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Carte •••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expire le 12/25</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast.info("Fonctionnalité de modification de carte à venir")
                  }}
                >
                  Modifier
                </Button>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast.info("Fonctionnalité d'ajout de carte à venir")
                }}
              >
                Ajouter une nouvelle carte
              </Button>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Adresse de facturation</p>
                <p className="text-sm text-muted-foreground">
                  123 Rue de la Paix<br />
                  75001 Paris, France
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    toast.info("Fonctionnalité de modification d'adresse à venir")
                  }}
                >
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Card variant="glass" className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-foreground">Historique des factures</CardTitle>
              <CardDescription>Consultez et téléchargez vos factures précédentes</CardDescription>
            </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Download className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{invoice.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(invoice.date, "d MMMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-foreground">{invoice.amount}€</p>
                      <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                        {invoice.status === "paid" ? "Payé" : "En attente"}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Simulate download
                        toast.success("Téléchargement de la facture en cours...")
                        // In a real app, this would trigger a download
                        setTimeout(() => {
                          toast.success("Facture téléchargée avec succès")
                        }, 1500)
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring" }}
        >
          <Card variant="glass" className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-foreground">Utilisation</CardTitle>
              <CardDescription>Votre utilisation actuelle</CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Employés</span>
                <span className="font-medium text-foreground">8 / 50</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "16%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Plannings</span>
                <span className="font-medium text-foreground">Illimité</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

