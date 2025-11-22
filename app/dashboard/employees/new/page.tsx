import { AddEmployeeForm } from "@/components/employees/add-employee-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewEmployeePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/dashboard/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Ajouter un employé</h1>
          <p className="text-muted-foreground mb-6">Remplissez les informations de votre nouvel employé</p>

          <AddEmployeeForm />
        </div>
      </main>
    </div>
  )
}
