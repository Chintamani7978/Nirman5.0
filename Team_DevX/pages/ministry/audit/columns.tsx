"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// This type is based on the data returned from the fetchAuditLogs query
export type AuditLog = {
  id: string;
  created_at: string;
  action: string;
  details: string;
  target_id: string;
  target_type: string;
  profiles: {
    full_name: string | null;
    email?: string | null;
  } | null;
};

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
  },
  {
    accessorKey: "profiles.full_name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.profiles;
      if (!user) return "System";
      const email = user.email ? ` (${user.email})` : "";
      return `${user.full_name}${email}`;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "details",
    header: "Details",
  },
  {
    accessorKey: "target_type",
    header: "Target Type",
  },
  {
    accessorKey: "target_id",
    header: "Target ID",
  },
];
