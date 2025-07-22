import React from "react";
import { useViewAllGroups } from "@/hooks/groups/useViewAllGroups";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useJoinGroup } from "@/hooks/groups/useJoinGroup";
import { roleMap } from "../Groups";

const AllGroups = () => {
  const { groups, loading, error } = useViewAllGroups();
  const { join: joinGroup, loading: joinLoading } = useJoinGroup();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const requestToJoin = async (groupId: number, email: string) => {
    const result = await joinGroup(groupId, email);
    if (result.success) {
      toast.success("Successfully requested to join group");
    } else {
      toast.error(`Error joining the group: ${result.error}`);
    }
  };
  return (
    <div className="grid grid-cols-4 gap-x-10">
      {groups?.map((group) => {
        const formattedDate = format(new Date(group.created_at), "yyyy-MM-dd");
        return (
          <Card key={group.name} className="border-stone-300">
            <CardHeader>
              <CardTitle>Group Name: {group.name}</CardTitle>
              <CardDescription>
                <strong>Group leader: </strong>
                {group.users.fname} {group.users.lname}
              </CardDescription>
              <CardDescription className="text-stone-500">
                <strong>{roleMap[group.users.role_id]}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>{group.description}</CardContent>
            <CardFooter className="flex justify-center space-x-5">
              <div>
                <Button
                  onClick={() =>
                    group.id &&
                    group.users.email &&
                    requestToJoin(group.id, group.users.email)
                  }
                  className="btn-primary"
                >
                  Join Group
                </Button>
              </div>
              <div>Since: {formattedDate}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default AllGroups;
