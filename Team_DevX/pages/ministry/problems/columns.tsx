"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export type Problem = {
  id: string
  title: string
  status: "reported" | "under_review" | "approved" | "in_progress" | "completed" | "rejected"
  category: string
  created_at: string
}

// This type will be used to pass the function to open the modal
export type ProblemTableMeta = {
  openStatusModal: (problem: Problem) => void
}

export const columns: ColumnDef<Problem>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = {
        reported: "default",
        under_review: "secondary",
        approved: "outline",
        in_progress: "destructive",
        completed: "default",
        rejected: "destructive",
      }[status] ?? "default"

      return <Badge variant={variant as any}>{status}</Badge>
    }
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "created_at",
    header: "Reported On",
    cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return date.toLocaleDateString()
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const problem = row.original
      const meta = table.options.meta as ProblemTableMeta
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(problem.id)}
            >
              Copy problem ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.openStatusModal(problem)}>
              Change status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
