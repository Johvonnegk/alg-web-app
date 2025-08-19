import React from "react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { UserProfile } from "@/types/UserProfile";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { roleMap } from "../../Dashboard/Views/Groups/Groups";
import { format } from "date-fns";
import { DeleteUserConfirmDialog } from "../../Dashboard/Views/Admin/DeleteUserConfirmDialog";
import { RoleChanger } from "../../Dashboard/Views/Admin/RoleChanger";

interface ColumnParams {
  userRole: number;
  sessionEmail: string;
  handlePromotion: (newRole: string, email: string) => void;
  handleDelete: (email: string) => void;
}

export const columns = ({
  userRole,
  sessionEmail,
  handlePromotion,
  handleDelete,
}: ColumnParams): ColumnDef<UserProfile>[] => [
  {
    id: "name",
    sortingFn: "alphanumeric",
    accessorFn: (row) => `${row.fname} ${row.lname}`,
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
    cell: ({ row }) => `${row.original.fname} ${row.original.lname}`,
  },
  {
    id: "system level",
    accessorKey: "level",
    header: "System Level",
    cell: ({ row }) => `${roleMap[row.original.role_id]}`,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "confirmed",
    accessorKey: "confirmed",
    header: "Status",
    cell: ({ row }) => {
      if (row.original.confirmed) {
        return <p className="font-semibold text-green-600">Confirmed</p>;
      } else {
        return (
          <p className="font-semibold text-yellow-500">Awaiting Confirmation</p>
        );
      }
    },
  },
  {
    accessorKey: "manage",
    header: "Manage Member",
    cell: ({ row }) => {
      const member = row.original;
      const actions: React.JSX.Element[] = [];
      if (sessionEmail !== member.email && userRole < member.role_id) {
        return (
          <RoleChanger
            member={member}
            email={member.email}
            onChange={(newRole) => handlePromotion(newRole, member.email)}
          />
        );
      }
    },
  },
  {
    accessorKey: "remove",
    header: "Remove Member",
    cell: ({ row }) => {
      const member = row.original;
      if (sessionEmail !== member.email && userRole < member.role_id) {
        return (
          <>
            <DeleteUserConfirmDialog
              email={member.email}
              onConfirm={() => handleDelete(member.email)}
            />
          </>
        );
      }
    },
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Date Joined",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      const formatted = format(date, "MMM do, yyyy '~' h:mm a");
      return (
        <p className="text-gray-600 font-semibold">
          Member since <br />
          {formatted}
        </p>
      );
    },
  },
];
