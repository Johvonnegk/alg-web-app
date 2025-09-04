import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { useGetGroupInvitations } from "@/hooks/groups/useGetGroupInvitations";
import { useUpdateInvites } from "@/hooks/groups/useUpdateInvites";
import { useArchiveInvite } from "@/hooks/groups/useArchiveInvite";
import { DataTable } from "./Table/data-table";
import toast from "react-hot-toast";
import { columns as baseColumns } from "./Table/columns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const GroupInvitations = () => {
  const { invites, loading } = useGetGroupInvitations();
  const { updateInvites, loading: invLoading, error } = useUpdateInvites();
  const { archiveInvite, loading: archLoading } = useArchiveInvite();
  if (loading) return <p>Loading...</p>;

  const handleInvite = async (accepted: boolean, inviteId: number) => {
    const success = await updateInvites({ accepted, inviteId });
    if (success) {
      toast.success(
        `Successfully ${accepted ? "accepted" : "declined"} the invite`
      );
      if (accepted) {
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    } else {
      console.error("Failed to accpet invite: ", error);
    }
  };

  const handleArchive = async (invite_id: number) => {
    const result = await archiveInvite(invite_id);
    if (result.success) {
      toast.success("Archived Invite");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      toast.error("Something went wrong while trying to archive the invite");
    }
  };
  const columns = baseColumns({ handleInvite, handleArchive });
  return (
    <div className="flex flex-col justify-center w-full overflow-x-hidden">
      <div className="overflow-x-scroll">
        <DataTable columns={columns} data={invites ? invites : []} />
      </div>
    </div>
  );
};

export default GroupInvitations;
