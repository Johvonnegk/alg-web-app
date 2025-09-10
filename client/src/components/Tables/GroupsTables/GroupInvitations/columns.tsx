import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Invite } from "@/types/Invite";
import { Button } from "@/components/ui/button";
import {
  FaCheckCircle,
  FaMinusCircle,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
} from "react-icons/fa";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import CustomAvatar from "@/components/Profile/CustomAvatar";
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
            <ArrowUp className="h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
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
      if (invite.type === "invite")
        return (
          <div className="flex justify-between  items-center">
            <div className="flex flex-col items-center min-w-0 justify-center text-stone-600 text-sm font-semibold px-5">
              <CustomAvatar profile={invite.sender} />
              <span className="truncate">{invite.sender.fname}</span>
            </div>
            <FaLongArrowAltRight className="size-5" />
            <div className="flex flex-col items-center justify-center text-stone-600 text-sm font-semibold px-5">
              <CustomAvatar profile={invite.recipient} />
              <span>{invite.recipient.fname}</span>
            </div>
          </div>
        );
      else
        return (
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center text-stone-600 text-sm font-semibold px-5">
              <CustomAvatar profile={invite.recipient} />
              <span>{invite.recipient.fname}</span>
            </div>
            <FaLongArrowAltLeft className="size-5" />
            <div className="flex flex-col items-center text-stone-600 text-sm font-semibold px-5">
              <CustomAvatar profile={invite.sender} />
              <span>{invite.sender.fname}</span>
            </div>
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
            {invite.status === "pending" ? (
              <>
                {" "}
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
              </>
            ) : (
              <></>
            )}
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
