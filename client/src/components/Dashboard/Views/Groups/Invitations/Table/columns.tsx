import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Invite } from "../../../../../../types/Invite";
import { Button } from "@/components/ui/button";
import {
  FaCheckCircle,
  FaMinusCircle,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
} from "react-icons/fa";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface ColumnParams {
  handleInvite: (accepted: boolean, inviteId: number) => void;
  handleArchive: (invite_id: number) => void;
}
export const columns = ({
  handleInvite,
  handleArchive,
}: ColumnParams): ColumnDef<Invite>[] => [
  {
    id: "requester",
    sortingFn: "alphanumeric",
    accessorFn: (row) => `${row.sender.fname} ${row.sender.lname}`,
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Requester
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
      `${row.original.sender.fname} ${row.original.sender.lname}`,
  },
  {
    id: "invite",
    accessorKey: "invite",
    header: "Invite",
    cell: ({ row }) => {
      const invite = row.original;
      const senderInitials = `${invite.sender.fname
        .charAt(0)
        .toUpperCase()}.${invite.sender.lname.charAt(0).toUpperCase()}`;
      const recipientInitials = `${invite.recipient.fname
        .charAt(0)
        .toUpperCase()}.${invite.recipient.lname.charAt(0).toUpperCase()}`;
      if (invite.type === "invite")
        return (
          <div className="flex justify-between items-center">
            <span className="font-semibold p-1">{senderInitials}</span>
            <FaLongArrowAltRight className="size-4" />
            <span className="font-semibold p-1">{recipientInitials}</span>
          </div>
        );
      else
        return (
          <div className="flex justify-between items-center">
            <span className="font-semibold p-1">{senderInitials}</span>
            <FaLongArrowAltLeft className="size-4" />
            <span className="font-semibold p-1">{recipientInitials}</span>
          </div>
        );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const invite = row.original;
      return (
        <div
          className={
            invite.status === "pending"
              ? "text-orange-500"
              : invite.status === "accepted"
              ? "text-green-500"
              : "text-red-500"
          }
        >
          <span className="font-semibold tracking-wide">
            {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
          </span>
        </div>
      );
    },
  },
  {
    id: "manage",
    header: "Manage Invite",
    cell: ({ row }) => {
      const invite = row.original;

      return (
        <div>
          <div className="flex justify-evenly">
            <div>
              <Button onClick={() => handleInvite(true, invite.id)}>
                <FaCheckCircle className="text-green-500" />
              </Button>
            </div>
            <div>
              <Button onClick={() => handleInvite(false, invite.id)}>
                <FaMinusCircle className="text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "archive",
    header: "Archive",
    cell: ({ row }) => {
      const invite = row.original;

      return (
        <div>
          <Button
            onClick={() => handleArchive(invite.id)}
            className="text-white bg-red-600 hover:bg-red-700"
          >
            Archive
          </Button>
        </div>
      );
    },
  },
];
