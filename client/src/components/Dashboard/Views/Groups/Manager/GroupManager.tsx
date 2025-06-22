import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useLeaveGroup } from "@/hooks/groups/useLeaveGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { useTransferOwnership } from "@/hooks/groups/useTransferOwnership";
import { useRemoveGroupMembers } from "@/hooks/groups/useRemoveGroupMembers";
import { RemoveMemberConfirmDialog } from "../RemoveMemberConfirmDialog";
import { useInviteToGroup } from "@/hooks/groups/useInviteToGroup";
import { GroupMember } from "../../../../../types/Group";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "../../../../../context/AuthContext";

const inviteFormSchema = z.object({
  email: z.string().email(),
});

const transferFormSchema = z.object({
  email: z.string().email(),
});

interface GroupManagerProps {
  group: GroupMember[];
  memberMap: string[];
}

const GroupManager = ({ group, memberMap }: GroupManagerProps) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const groupInfo = group[0];
  const groupName = groupInfo?.groups.name;
  const groupId = groupInfo?.groups.id;
  const { transferOwnership: transfer, loading: tansLoading } =
    useTransferOwnership();
  const { removeMembers, loading: removeLoading } = useRemoveGroupMembers();
  const { leaveGroup: leave, loading: leaveLoding } = useLeaveGroup();
  const { inviteToGroup: invite, loading: invLoading } = useInviteToGroup();
  const { email: sessionEmail } = useAuth();

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

  const handlePromotion = async (promotion: boolean, member: GroupMember) => {
    console.log("Handle promotion: ", promotion, "Member: ", member);
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
  return (
    <div className="group-management w-full grid grid-cols-2 gap-2">
      <div className="managed-members flex flex-col">
        <form onSubmit={removeGroupMembers}>
          <Table className="mb-10 bg-stone-100 rounded-sm overflow-hidden">
            <TableCaption>
              Manage Group Members for{" "}
              <span className="font-semibold text-accent">{groupName}</span>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/10 font-semibold">Member</TableHead>
                <TableHead className="w-2/10 font-semibold">Name</TableHead>
                <TableHead className="w-1/10 font-semibold">Role</TableHead>
                <TableHead className="w-2/10 font-semibold">Email</TableHead>
                <TableHead className="w-3/10 text-center font-semibold">
                  Manage Member
                </TableHead>
                <TableHead className="w-1/10 font-semibold">
                  Remove Member
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group?.map((member: GroupMember, index: number) => (
                <TableRow
                  key={index}
                  className={`w-full ${
                    index % 2 === 0 ? "bg-stone-200" : "bg-stone-100"
                  }`}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {member.users.fname} {member.users.lname}
                  </TableCell>
                  <TableCell>{memberMap[member.role_id - 1]}</TableCell>
                  <TableCell>{member.users.email}</TableCell>
                  {member.users.email === sessionEmail ? (
                    <>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="flex justify-around">
                        <div>
                          <Button
                            onClick={() => handlePromotion(true, member)}
                            className="hover:cursor-pointer bg-transparent"
                          >
                            <FaArrowAltCircleUp className="size-5 text-green-500" />
                          </Button>
                        </div>

                        <div>
                          <Button
                            onClick={() => handlePromotion(false, member)}
                            className="hover:cursor-pointer bg-transparent"
                          >
                            <FaArrowAltCircleDown className="size-5 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center items-center h-full">
                          <Checkbox
                            checked={selectedUsers.includes(
                              member.users.email ?? ""
                            )}
                            onCheckedChange={() =>
                              toggleUserSelection(member.users.email ?? "")
                            }
                            className="w-5 h-5 border data-[state=checked]:text-green-500 border-gray-400 rounded"
                          >
                            <span className="size-5">✔</span>
                          </Checkbox>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {selectedUsers.length > 0 && (
            <RemoveMemberConfirmDialog
              onConfirm={() => removeGroupMembers()}
              trigger={
                <Button
                  variant="destructive"
                  className="bg-red-500 text-white font-semibold hover:bg-red-700"
                >
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
              <Button
                type="submit"
                className="border border-stone-300 hover:bg-accent hover:text-white"
              >
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
                  <Button
                    type="submit"
                    className="w-full border border-stone-300 hover:bg-accent hover:text-white"
                  >
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
