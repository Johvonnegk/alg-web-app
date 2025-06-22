import React from "react";
import { useViewAllGroups } from "@/hooks/groups/useViewAllGroups";
import { Groups } from "@/types/Group";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
const AllGroups = () => {
  const { groups, loading, error } = useViewAllGroups();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div className="grid grid-cols-4">
      {groups?.map((group) => {
        const formattedDate = format(new Date(group.created_at), "yyyy-MM-dd");
        return (
          <Card key={group.name} className="border-stone-300">
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
              <CardDescription>
                Group leader: {group.users.fname} {group.users.lname}
              </CardDescription>
              <CardDescription>Level: {group.users.role_id}</CardDescription>
            </CardHeader>
            <CardContent>{group.description}</CardContent>
            <CardFooter>Since: {formattedDate}</CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default AllGroups;
