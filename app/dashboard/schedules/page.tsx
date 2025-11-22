"use client"

import { Button } from "@/components/ui/button"
import { Plus, Wand2, Filter, Download, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { ScheduleList } from "@/components/schedules/schedule-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

export default function SchedulesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Planning Restaurant</h1>
            <p className="text-muted-foreground">Organisez vos services midi et soir</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 bg-transparent" asChild>
              <Link href="/dashboard/schedules/generate">
                <Wand2 className="mr-2 h-4 w-4" />
                Générer avec l'IA
              </Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/dashboard/schedules/new">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau planning
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48 bg-card">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les périodes</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="custom">Personnalisé</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48 bg-card">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les services</SelectItem>
              <SelectItem value="midi">Service Midi</SelectItem>
              <SelectItem value="soir">Service Soir</SelectItem>
              <SelectItem value="brunch">Brunch Weekend</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-48 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="ml-auto bg-card">
            <Download className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ScheduleList />
        </motion.div>
      </main>
    </div>
  )
}
