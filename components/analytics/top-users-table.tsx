"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface TopUser {
  id: string
  name: string
  email: string
  activity: number
  lastActive: string
  status: "active" | "inactive"
}

interface TopUsersTableProps {
  users: TopUser[]
}

export function TopUsersTable({ users }: TopUsersTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Activité</TableHead>
            <TableHead>Dernière connexion</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">{user.activity}</span>
                <span className="text-xs text-muted-foreground ml-1">actions</span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(user.lastActive), "d MMM yyyy à HH:mm")}
              </TableCell>
              <TableCell>
                <Badge variant={user.status === "active" ? "default" : "secondary"}>
                  {user.status === "active" ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

