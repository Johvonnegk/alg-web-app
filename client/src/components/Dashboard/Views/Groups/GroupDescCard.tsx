import React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CustomAvatar from "@/components/Profile/CustomAvatar";
import { GroupMember } from "@/types/Group";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUpdateGroup } from "@/hooks/groups/useUpdateGroup";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "The mininmum group name length is 4 characters" })
    .max(24, { message: "The maximum group name length is 24 characters" }),
  description: z
    .string()
    .max(500, { message: "Maximum description length is 500 characters." })
    .optional(),
});

const GroupDescCard = ({
  group,
  edit,
}: {
  group: GroupMember[];
  edit: Boolean;
}) => {
  const [editMode, setEdit] = useState(false);
  const [error, setError] = useState("");
  const groupName = group[0].groups.name;
  const groupDesc = group[0].groups.description;
  const groupId = group[0].groups.id ?? 0;

  const { updateGroup, loading } = useUpdateGroup();
  const handleUpdateGroup = async (values: z.infer<typeof formSchema>) => {
    setError("");
    const result = await updateGroup({
      name: values.name,
      description: values.description ?? "",
      id: groupId,
    });
    if (result.success) {
      toast.success("Successfully created group, reloading to see changes.");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      console.error("Error creating group:", result.error);
      setError(
        `An nerror occurred while creating the group please try again: ${result.error}`
      );
    }
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: groupName,
      description: groupDesc,
    },
  });
  let groupLeader;
  for (let member of group) {
    if (member.role_id === 1) {
      groupLeader = member.users;
    }
  }

  return (
    <Card className="w-full h-fit max-w-sm border-stone-300 shadow-xl">
      <CardHeader>
        <div className="flex gap-x-5 items-center">
          <div className="flex flex-col items-center min-w-0 justify-center">
            <CustomAvatar profile={groupLeader} />
            <div>
              <span className="text-xs truncate">
                Leader: {groupLeader?.fname}
              </span>
            </div>
          </div>

          <CardTitle>Group Description</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {editMode ? (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateGroup)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-semibold">
                            Group Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="border border-stone-300"
                              placeholder="Group Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2 ">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-semibold">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="border border-stone-300"
                              placeholder="Max 500 characters"
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
                    className="w-full border border-stone-300 btn-primary"
                  >
                    Update Group
                  </Button>
                </div>
              </form>
            </Form>
            <CardFooter className="flex-col gap-2">
              {/* {error ? <p className="text-sm text-red-500">{error}</p> : ""} */}
            </CardFooter>
          </>
        ) : (
          <p>{groupDesc || "No description available"}</p>
        )}
      </CardContent>
      {edit && (
        <CardFooter className="flex justify-center">
          <Button
            className={`${editMode ? "btn-danger" : ""}`}
            onClick={() => setEdit(!editMode)}
          >
            {editMode ? "Cancel Edit" : "Edit Description"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default GroupDescCard;
