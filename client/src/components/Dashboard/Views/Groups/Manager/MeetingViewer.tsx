import React from "react";
import MeetingCard from "./MeetingCard";
import { useGetMeetings } from "@/hooks/groups/useGetMeetings";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MeetingViewer = ({ groupId }) => {
  const { meetings, loading, error } = useGetMeetings(groupId, "group_leader");
  const [sortOrder, setSortOrder] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number | undefined>(undefined);
  const DEFAULT_PAGE_VALUE = 4;
  const effectivePageSize = pageSize ?? DEFAULT_PAGE_VALUE;

  const filteredMeetings = meetings.filter((meeting) => {
    const madeBy =
      `${meeting.users?.fname} ${meeting.users?.lname}`.toLowerCase();
    const titleMatch = meeting.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const madeByMatch = madeBy.includes(search.toLowerCase());
    const date = new Date(meeting.date ? meeting.date : 0);
    const dateFormats = [
      date.toLocaleDateString("en-US", { month: "short", year: "numeric" }), // "Oct 2025"
      date.toLocaleDateString("en-US", { month: "long", day: "numeric" }), // "October 5"
      date.toLocaleDateString("en-US"), // "10/31/2025" (based on US locale)
      date.toLocaleDateString("en-GB"), // "31/10/2025"
      date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }), // "October 5, 2025"
    ].map((d) => d.toLowerCase());

    const dateMatch = dateFormats.some((d) => d.includes(search.toLowerCase()));
    return titleMatch || madeByMatch || dateMatch;
  });
  const sortedMeetings = [...filteredMeetings].sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();

    return sortOrder === "newest" ? db - da : da - db;
  });
  const totalPages = Math.ceil(filteredMeetings.length / effectivePageSize);
  const startIndex = page * effectivePageSize;
  const currentMeetings = sortedMeetings.slice(
    startIndex,
    startIndex + effectivePageSize
  );

  if (loading) return <p>Loading...</p>;
  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold">Meeting Viewer</h2>
        <p className="text-xs font-bold text-stone-500">
          *You can search for meetings by title, date, or who created the
          meeting*{" "}
        </p>
      </div>
      <div className="flex flex-wrap flex-col lg:flex-row justify-center items-center gap-x-2 gap-y-5">
        <div className="flex justify-center">
          <Input
            type="text"
            placeholder="Search by meeting title or date..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-[300px] border-stone-300 shadow-sm"
          />
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2 page-controls">
          <Button
            className="hover:text-white border-stone-300 shadow-sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="text-center text-sm font-semibold px-1 py-1">
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
            <SelectTrigger className="w-auto border-stone-300 shadow-sm">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent className="bg-white border-stone-300">
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="24">24</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap">
          <Select
            value={sortOrder}
            onValueChange={(val) => setSortOrder(val as "newest" | "oldest")}
          >
            <SelectTrigger className="w-auto border-stone-300">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border-stone-300">
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {meetings.length <= 0 ? (
        <div>This group has no recorded meetings</div>
      ) : (
        <div className="flex flex-col gap-y-5 lg:grid lg:grid-cols-2 lg:gap-x-10">
          {currentMeetings.map((m) => (
            <MeetingCard key={m.id} info={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingViewer;
