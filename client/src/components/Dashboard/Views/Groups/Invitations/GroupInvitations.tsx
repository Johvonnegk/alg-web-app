import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { useGetGroupInvitations } from "@/hooks/groups/useGetGroupInvitations";
import { useUpdateInvites } from "@/hooks/groups/useUpdateInvites";
import { useArchiveInvite } from "@/hooks/groups/useArchiveInvite";
import { DataTable } from "@/components/Tables/GroupsTables/GroupInvitations/data-table";
import toast from "react-hot-toast";
import { columns as baseColumns } from "@/components/Tables/GroupsTables/GroupInvitations/columns";
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
      console.error("Failed to accept invite: ", error);
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
  return invites && invites.length > 0 ? (
    <div className="flex flex-col justify-center w-full overflow-x-hidden">
      <h3 className="self-center text-xl mb-2 xl:self-start">Manage Invites</h3>
      <hr className="mb-2 w-full xl:mb-10 text-stone-300 xl:w-7/8" />
      <div className="overflow-x-scroll">
        <DataTable columns={columns} data={invites} />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center text-stone-500">
      You have no group invites
    </div>
  );
};

export default GroupInvitations;
