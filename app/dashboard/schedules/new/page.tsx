import { ManualScheduleForm } from "@/components/schedules/manual-schedule-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewSchedulePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/dashboard/schedules">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Créer un planning manuel</h1>
          <p className="text-muted-foreground mb-6">Créez votre planning shift par shift</p>

          <ManualScheduleForm />
        </div>
      </main>
    </div>
  )
}
