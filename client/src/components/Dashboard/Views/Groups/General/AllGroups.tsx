import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useJoinGroup } from "@/hooks/groups/useJoinGroup";
import { roleMap } from "../Groups";

const AllGroups = () => {
  const { groups, loading, error } = useViewAllGroups();
  const { join: joinGroup, loading: joinLoading } = useJoinGroup();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number | undefined>(undefined);
  const DEFAULT_PAGE_VALUE = 4;
  const effectivePageSize = pageSize ?? DEFAULT_PAGE_VALUE;
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>(
    {}
  );
  const toggleExpand = (id: number) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const filteredGroups = groups.filter((group) => {
    const leaderName =
      `${group.users.fname} ${group.users.lname}`.toLowerCase();
    return (
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      leaderName.includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredGroups.length / effectivePageSize);
  const startIndex = page * effectivePageSize;
  const currentGroups = filteredGroups.slice(
    startIndex,
    startIndex + effectivePageSize
  );

  const requestToJoin = async (groupId: number, email: string) => {
    const result = await joinGroup(groupId, email);
    if (result.success) {
      toast.success("Successfully requested to join group");
    } else {
      toast.error(`Error joining the group: ${result.error}`);
    }
  };
  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-center items-center gap-x-2 gap-y-5">
        <div className="flex justify-center">
          <Input
            type="text"
            placeholder="Search by group name or leader..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0); // reset to first page when filtering
            }}
            className="w-[300px] border-stone-300 shadow-sm"
          />
        </div>
        <div className="flex justify-center items-center space-x-2 page-controls">
          <Button
            className="hover:text-white border-stone-300 shadow-sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="px-2 py-1">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            className="hover:text-white border-stone-300 shadow-sm"
            variant="outline"
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
          <Select
            value={pageSize ? String(pageSize) : undefined}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[180px] border-stone-300 shadow-sm">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-y-10 mt-10 2xl:grid 2xl:grid-cols-4 2xl:gap-x-10">
        {currentGroups.map((group) => {
          const formattedDate = format(
            new Date(group.created_at),
            "yyyy-MM-dd"
          );
          const isExpanded = expandedGroups[group.id] || false;
          return (
            <Card
              key={group.name}
              className="border-stone-300 w-full max-w-sm mx-auto"
            >
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
              <CardContent>
                <p className={`text-sm  ${isExpanded ? "" : "truncate"}`}>
                  {group.description}
                </p>
                {group.description.length > 100 && (
                  <button
                    onClick={() => toggleExpand(group.id)}
                    className="mt-2 text-accent hover:underline text-sm"
                  >
                    {isExpanded ? "See less" : "See more"}
                  </button>
                )}
              </CardContent>
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
    </div>
  );
};

export default AllGroups;
