import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useLeaveGroup } from "@/hooks/groups/useLeaveGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { useTransferOwnership } from "@/hooks/groups/useTransferOwnership";
import { useRemoveGroupMembers } from "@/hooks/groups/useRemoveGroupMembers";
import { RemoveMemberConfirmDialog } from "../RemoveMemberConfirmDialog";
import { useInviteToGroup } from "@/hooks/groups/useInviteToGroup";
import { useManageGroupRoles } from "@/hooks/groups/useManageGroupRoles";
import { GroupMember } from "../../../../../types/Group";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeaveGroupDialog } from "../LeaveGroupDialog";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns as baseColumns } from "./Table/columns";
import { DataTable } from "./Table/data-table";
import { useAuth } from "../../../../../context/AuthContext";

const inviteFormSchema = z.object({
  email: z.string().email(),
});

const transferFormSchema = z.object({
  email: z.string().email(),
});

interface GroupManagerProps {
  group: GroupMember[];
}

const GroupManager = ({ group }: GroupManagerProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const groupInfo = group[0];
  const groupName = groupInfo?.groups.name;
  const groupId = groupInfo?.groups.id;
  const { transferOwnership: transfer, loading: tansLoading } =
    useTransferOwnership();
  const { handlePromotion: promote, loading: promoteLoading } =
    useManageGroupRoles();
  const { removeMembers, loading: removeLoading } = useRemoveGroupMembers();
  const { leaveGroup: leave, loading: leaveLoding } = useLeaveGroup();
  const { inviteToGroup: invite, loading: invLoading } = useInviteToGroup();
  const { email: sessionEmail } = useAuth();
  const roleId = (() => {
    for (const member of group) {
      if (member.users.email && member.users.email === sessionEmail) {
        return member.role_id;
      }
    }
    return Infinity;
  })();

  const transferForm = useForm<z.infer<typeof transferFormSchema>>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const inviteForm = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const leaveGroup = async () => {
    const id = groupId ?? 0;
    const result = await leave(id);
    if (!result.success) toast.error(`An error occured: ${result.error ?? ""}`);
    else {
      toast.success("You have left the group");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  const removeGroupMembers = async () => {
    if (selectedUsers.length === 0) return;
    const id = groupId ?? 0;
    const result = await removeMembers(id, selectedUsers);
    if (!result.success) toast.error(`An error occured: ${result.error ?? ""}`);
    else {
      toast.success("Removed users from the group");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  const handlePromotion = async (promotion: boolean, email: string) => {
    const id = groupId ?? 0;
    const result = await promote(id, promotion, email);
    if (result.success && promotion) {
      toast.success("Successfully promoted user");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else if (result.success && !promotion) {
      toast.success("Successfully demoted user");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      toast.error("Could not manage members, please try again.");
    }
  };

  const transferOwnership = async (
    values: z.infer<typeof transferFormSchema>
  ) => {
    const id = groupId ?? 0;
    const result = await transfer(id, values.email.toLowerCase());
    if (result.success) {
      toast.success("Successfully transfered ownership");
    } else {
      toast.error(
        `An error occurred while transfering ownership: ${result.error ?? ""}`
      );
    }
  };

  const sendInvite = async (values: z.infer<typeof inviteFormSchema>) => {
    if (!groupId) {
      return;
    }
    const result = await invite(groupId, values.email.toLowerCase());
    if (result.success) {
      toast.success("Invite sent successfully");
      inviteForm.reset();
    } else {
      toast.error(
        `An error occurerd while sending the invite: ${result.error ?? ""}`
      );
    }
  };

  const columns = baseColumns({
    sessionEmail: sessionEmail ?? "",
    handlePromotion,
    selectedUsers,
    toggleUserSelection,
  });
  return (
    <div className="group-management w-full grid grid-cols-2 gap-2">
      <div className="managed-members flex flex-col">
        <form className="mb-5" onSubmit={removeGroupMembers}>
          <DataTable columns={columns} data={group} />
          {selectedUsers.length > 0 && (
            <RemoveMemberConfirmDialog
              onConfirm={() => removeGroupMembers()}
              trigger={
                <Button variant="destructive" className="btn-danger">
                  Remove
                </Button>
              }
              title="Remove this member?"
              description={`Are you sure you want to remove ${selectedUsers.join(
                ", "
              )} from the group?`}
              confirmText="Yes, remove"
              cancelText="Cancel"
            />
          )}
        </form>
        <div className="flex-1 flex justify-center">
          <LeaveGroupDialog
            groupName={groupName}
            onConfirm={() => {
              leaveGroup();
            }}
          />
        </div>

        <hr className="w-full border-2 text-stone-200 mb-5" />
        <Form {...transferForm}>
          <form
            onSubmit={transferForm.handleSubmit(transferOwnership)}
            className="w-full flex justify-start gap-8"
          >
            <div>
              <FormField
                control={transferForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email" className="font-semibold">
                      Users email address
                    </FormLabel>
                    <FormDescription>
                      Enter the email of the user you wish to transfer ownership
                      to for{" "}
                      <strong className="text-accent">{groupName}</strong>
                    </FormDescription>
                    <FormMessage className="text-sm text-red-500" />
                    <FormControl>
                      <Input
                        placeholder="mail@example.com"
                        className="border-stone-300"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="btn-primary">
                Transfer group ownership
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="add-member flex justify-center">
        <Card className="w-full max-w-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg">
              Invite user to <span className="text-accent">{groupName}</span>
            </CardTitle>
            <CardDescription>
              Enter the persons email that you would like to invite to your
              group.
            </CardDescription>
            <CardDescription className="text-stone-400">
              Enter the users email to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...inviteForm}>
              <form onSubmit={inviteForm.handleSubmit(sendInvite)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={inviteForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-semibold">Email</FormLabel>
                          <FormControl>
                            <Input
                              className="border border-stone-300"
                              placeholder="mail@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full btn-primary">
                    Invite
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupManager;
