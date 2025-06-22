import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { useGetGroupInvitations } from "../../../../hooks/groups/useGetGroupInvitations";
import { useUpdateInvites } from "../../../../hooks/groups/useUpdateInvites";
import { useArchiveInvite } from "@/hooks/groups/useArchiveInvite";
import toast from "react-hot-toast";
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

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Table className="mx-auto bg-transparent border-collapse overflow-hidden rounded-sm">
        <TableCaption className="">Manage your group invites</TableCaption>
        <TableHeader className="rounded-lg">
          <TableRow className="border-stone-300 bg-stone-100">
            <TableHead className="px-4 w-2/10 rounded-tl-sm font-semibold">
              Inviter
            </TableHead>
            <TableHead className="w-2/10 font-semibold">Group</TableHead>
            <TableHead className="w-1/10 font-semibold">Status</TableHead>
            <TableHead className="w-3/10 text-center font-semibold">
              Accept/Decline
            </TableHead>
            <TableHead className="w-2/10 font-semibold">Archive</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites && invites.length > 0 ? (
            invites?.map((invite, index) => {
              return (
                <TableRow
                  className={`w-full border-b-2 border-blue-500 font-semibold ${
                    index % 2 === 0 ? "bg-stone-200" : "bg-stone-100"
                  }`}
                >
                  <TableCell className="px-4 rounded-bl-sm">
                    {invite.sender.fname} {invite.sender.lname}
                  </TableCell>
                  <TableCell>{invite.groups.name}</TableCell>
                  <TableCell
                    className={
                      invite.status === "pending"
                        ? "text-orange-500"
                        : invite.status === "accepted"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {invite.status.charAt(0).toUpperCase() +
                      invite.status.slice(1)}
                  </TableCell>
                  <TableCell className="">
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
                  </TableCell>
                  <TableCell className="rounded-br-sm">
                    <Button
                      onClick={() => handleArchive(invite.id)}
                      className="text-white bg-red-600 hover:bg-red-700"
                    >
                      Archive
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow className="">
              <TableCell
                className="font-semibold text-xl text-center bg-stone-200 rounded-br-sm rounded-bl-sm"
                colSpan={5}
              >
                You have no group invites...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default GroupInvitations;
