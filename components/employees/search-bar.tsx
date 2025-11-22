"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

interface SearchBarProps {
  onSearch?: (query: string) => void
  onRoleFilter?: (role: string) => void
  onStatusFilter?: (status: string) => void
}

export function SearchBar({ onSearch, onRoleFilter, onStatusFilter }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("active")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleRoleChange = (value: string) => {
    setRoleFilter(value)
    onRoleFilter?.(value)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    onStatusFilter?.(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row gap-4 w-full"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un employé..."
          className="pl-9 bg-card"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <Select value={roleFilter} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-full sm:w-48 bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les rôles</SelectItem>
          <SelectItem value="Serveur">Serveur</SelectItem>
          <SelectItem value="Barman">Barman</SelectItem>
          <SelectItem value="Runner">Runner</SelectItem>
          <SelectItem value="Chef de rang">Chef de rang</SelectItem>
          <SelectItem value="Cuisine">Cuisine</SelectItem>
          <SelectItem value="Manager">Manager</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-48 bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Actifs</SelectItem>
          <SelectItem value="inactive">Inactifs</SelectItem>
          <SelectItem value="all">Tous</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  )
}

