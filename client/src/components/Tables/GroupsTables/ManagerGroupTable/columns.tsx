import React from "react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { GroupMember } from "../../../../types/Group";
import { Button } from "@/components/ui/button";
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import ManagerGroupProfilePill from "@/components/Profile/ManagerGroupProfilePill";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";

interface ColumnParams {
  sessionEmail: string;
  handlePromotion: (promotion: boolean, email: string) => void;
  selectedUsers: string[];
  toggleUserSelection: (userId: string) => void;
}
export const columns = ({
  sessionEmail,
  handlePromotion,
  selectedUsers,
  toggleUserSelection,
}: ColumnParams): ColumnDef<GroupMember>[] => [
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
      return <ManagerGroupProfilePill p={row.original} />;
    },
  },
  {
    accessorKey: "manage",
    header: "Manage Member",
    cell: ({ row }) => {
      const member = row.original;
      const actions: React.JSX.Element[] = [];
      if (sessionEmail !== member.users.email) {
        if (member.role_id > 2) {
          actions.push(
            <div key={`${member.users.email}-promote`}>
              <Button
                type="button"
                onClick={() => handlePromotion(true, member.users.email ?? "")}
                className="hover:cursor-pointer bg-transparent"
              >
                <FaArrowAltCircleUp className="size-5 text-green-500" />
              </Button>
            </div>
          );
        }
        if (member.role_id < 4) {
          actions.push(
            <div key={`${member.users.email}-demote`}>
              <Button
                type="button"
                onClick={() => handlePromotion(false, member.users.email ?? "")}
                className="hover:cursor-pointer bg-transparent"
              >
                <FaArrowAltCircleDown className="size-5 text-red-600" />
              </Button>
            </div>
          );
        }
        return <div className="flex justify-center">{actions}</div>;
      }
    },
  },
  {
    accessorKey: "remove",
    header: "Remove Member",
    cell: ({ row }) => {
      const member = row.original;
      if (sessionEmail !== member.users.email) {
        return (
          <div className="flex justify-center items-center h-full">
            <Checkbox
              checked={selectedUsers.includes(member.users.email ?? "")}
              onCheckedChange={() =>
                toggleUserSelection(member.users.email ?? "")
              }
              className="w-5 h-5 border data-[state=checked]:text-green-500 border-gray-400 rounded"
            >
              <span className="size-5">✔</span>
            </Checkbox>
          </div>
        );
      }
    },
  },
];
