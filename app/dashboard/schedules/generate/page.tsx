import { AIScheduleGenerator } from "@/components/schedules/ai-schedule-generator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GenerateSchedulePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/dashboard/schedules">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <div className="max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Générer un planning avec l'IA</h1>
            <p className="text-muted-foreground">
              L'intelligence artificielle créera un planning optimisé en fonction de vos contraintes
            </p>
          </div>

          <AIScheduleGenerator />
        </div>
      </main>
    </div>
  )
}
