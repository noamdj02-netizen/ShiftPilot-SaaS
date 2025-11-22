"use client"

import { useState } from "react"
import { EmployeeList } from "@/components/employees/employee-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { SearchBar } from "@/components/employees/search-bar"
import { motion } from "framer-motion"

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("active")
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-3 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>
      
      <main className="container mx-auto px-4 py-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Équipe Restaurant</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Gérez votre personnel et leurs compétences</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 min-h-[48px]" asChild>
            <Link href="/dashboard/employees/new">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Ajouter un membre</span>
              <span className="sm:hidden">Ajouter</span>
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <SearchBar
            onSearch={setSearchQuery}
            onRoleFilter={setRoleFilter}
            onStatusFilter={setStatusFilter}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <EmployeeList searchQuery={searchQuery} roleFilter={roleFilter} statusFilter={statusFilter} />
        </motion.div>
      </main>
    </div>
  )
}
