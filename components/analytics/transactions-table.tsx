"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "credit" | "debit"
  status: "completed" | "pending" | "failed"
}

interface TransactionsTableProps {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="text-sm">
                {format(new Date(transaction.date), "d MMM yyyy")}
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{transaction.description}</p>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {transaction.type === "credit" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`font-medium ${
                      transaction.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}
                    {transaction.amount.toLocaleString()}€
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={transaction.type === "credit" ? "default" : "secondary"}>
                  {transaction.type === "credit" ? "Crédit" : "Débit"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    transaction.status === "completed"
                      ? "default"
                      : transaction.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {transaction.status === "completed"
                    ? "Terminé"
                    : transaction.status === "pending"
                      ? "En attente"
                      : "Échec"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

