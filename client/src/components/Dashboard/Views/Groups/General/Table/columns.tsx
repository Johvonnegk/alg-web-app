import React from "react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { GroupMember } from "../../../../../../types/Group";
import { roleMap, memberMap } from "../../Groups";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface ColumnParams {
  sessionEmail: string;
  handlePromotion: (promotion: boolean, email: string) => void;
  selectedUsers: string[];
  toggleUserSelection: (userId: string) => void;
}
export const columns: ColumnDef<GroupMember>[] = [
  {
    id: "name",
    sortingFn: "alphanumeric",
    accessorFn: (row) => `${row.users.fname} ${row.users.lname}`,
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Name
          {sorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) =>
      `${row.original.users.fname} ${row.original.users.lname}`,
  },
  {
    id: "Group Role",
    accessorKey: "groupRole",
    header: "Group Role",
    cell: ({ row }) => `${memberMap[row.original.role_id - 1]}`,
  },
  {
    id: "level",
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) =>
      row.original.users.role_id !== undefined
        ? `${roleMap[row.original.users.role_id as keyof typeof roleMap]}`
        : "",
  },
  {
    id: "email",
    accessorKey: "users.email",
    header: "Email",
  },
];
