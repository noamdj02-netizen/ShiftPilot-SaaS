"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { SkeletonCard } from "@/components/animations/skeleton-loader"
import { AddEmployeeForm } from "@/components/employees/add-employee-form"

interface Employee {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  role: string
  contractType?: string
  weeklyHours?: number
  hourlyRate?: number
  startDate?: string
  notes?: string
}

export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [employeeId, setEmployeeId] = useState<string | null>(null)

  useEffect(() => {
    params.then((p) => setEmployeeId(p.id))
  }, [params])

  useEffect(() => {
    if (!employeeId) return

    fetchEmployee()
  }, [employeeId])

  const fetchEmployee = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/employees/${employeeId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement")
      }

      setEmployee(data.employee)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
      toast.error(errorMessage)
      router.push("/dashboard/employees")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6">
          <SkeletonCard />
        </main>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-6">
          <div className="p-12 border-2 border-destructive/20 rounded-xl text-center bg-destructive/5">
            <p className="text-destructive font-medium mb-4">Employé non trouvé</p>
            <Button asChild variant="outline">
              <Link href="/dashboard/employees">Retour aux employés</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href={`/dashboard/employees/${employee.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Link>
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Modifier l'employé</h1>
            <p className="text-muted-foreground">
              Modifiez les informations de {employee.firstName} {employee.lastName}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations de l'employé</CardTitle>
            </CardHeader>
            <CardContent>
              <AddEmployeeForm employeeId={employee.id} existingEmployee={employee} />
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

