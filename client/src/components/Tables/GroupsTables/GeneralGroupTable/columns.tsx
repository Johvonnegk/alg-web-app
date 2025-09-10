import React from "react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { GroupMember } from "@/types/Group";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import GroupProfilePill from "@/components/Profile/GroupProfilePill";

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
            <ArrowUp className="h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      return <GroupProfilePill p={row.original} />;
    },
  },
];
