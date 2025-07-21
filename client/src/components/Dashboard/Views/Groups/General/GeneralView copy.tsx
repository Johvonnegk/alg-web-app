import React from "react";
import { useViewGeneralGroups } from "../../../../../hooks/groups/useViewGeneralGroup";
import { GroupMember } from "../../../../../types/Group";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
interface GeneralViewProps {
  otherGroups?: boolean;
}
import { roleMap, memberMap } from "../Groups";

const GeneralView = ({ otherGroups }: GeneralViewProps) => {
  const { group, loading, error } = useViewGeneralGroups();
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  const groupName = group && group?.length > 0 ? group[0]?.groups?.name : null;

  return (
    <div className="view-group w-full flex justify-center">
      {group ? (
        <Table className="mx-auto border-collapse overflow-hidden rounded-sm">
          <TableCaption>
            Members in{" "}
            <span className="text-accent font-semibold">{groupName}</span>
          </TableCaption>
          <TableHeader>
            <TableRow className=" border-stone-300 font-semibol bg-stone-100">
              <TableHead className="px-4 font-semibold">Member</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Level</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="text-center font-semibold">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group?.map((member: GroupMember, index: number) => (
              <TableRow
                key={index}
                className={`w-full border-stone-300 ${
                  index % 2 === 0 ? "bg-stone-200" : "bg-stone-100"
                }`}
              >
                <TableCell className="px-4">{index + 1}</TableCell>
                <TableCell>
                  {member.users.fname} {member.users.lname}
                </TableCell>
                <TableCell>{roleMap[member.users.role_id]}</TableCell>
                <TableCell>{memberMap[member.role_id - 1]}</TableCell>
                <TableCell className="text-center">
                  {member.users.email ?? ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-stone-500">
          You are not in any {otherGroups ? "other " : ""}groups
        </p>
      )}
    </div>
  );
};

export default GeneralView;
