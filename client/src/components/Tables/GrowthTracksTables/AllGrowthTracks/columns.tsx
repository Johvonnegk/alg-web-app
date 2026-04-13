"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GrowthSummary } from "@/types/Growth";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import AdminProfilePill from "@/components/Profile/AdminProfilePill";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const color_map = { passed: "green", failed: "red", incomplete: "yellow" };

function capitalizeFirst(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const columns: ColumnDef<GrowthSummary>[] = [
  {
    id: "name",
    sortingFn: "alphanumeric",
    accessorFn: (row) => `${row.fname} ${row.lname}`,
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Name
          {sorted === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      console.log(row);
      return <AdminProfilePill profile={row.original} />;
    },
  },
  {
    accessorKey: "class_101",
    header: () => <div className="font-semibold">Class 101</div>,
    cell: ({ row }) => {
      const course = row.original.courses.find((c) => c.course_name === "101");

      const status = course?.status ?? "not_started";

      return (
        <div className={`font-semibold text-${color_map[status]}-500`}>
          {capitalizeFirst(status)}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;

      const course = row.original.courses.find((c) => c.course_name === "101");

      if (filterValue === "passed") return course?.status === "passed";
      if (filterValue === "not_passed") return course?.status !== "passed";

      return true;
    },
  },
  {
    accessorKey: "class_201",
    header: () => <div className="font-semibold">Class 201</div>,
    cell: ({ row }) => {
      const course = row.original.courses.find((c) => c.course_name === "201");

      const status = course?.status ?? "not_started";

      return (
        <div className={`font-semibold text-${color_map[status]}-500`}>
          {capitalizeFirst(status)}
        </div>
      );
    },
    filterFn: (row, _, filterValue) => {
      if (!filterValue || filterValue === "all") return true;

      const course = row.original.courses.find((c) => c.course_name === "201");

      if (filterValue === "passed") return course?.status === "passed";
      if (filterValue === "not_passed") return course?.status !== "passed";

      return true;
    },
  },
  {
    accessorKey: "class_301",
    header: () => <div className="font-semibold">Class 301</div>,
    cell: ({ row }) => {
      const course = row.original.courses.find((c) => c.course_name === "301");

      const status = course?.status ?? "not_started";

      return (
        <div className={`font-semibold text-${color_map[status]}-500`}>
          {capitalizeFirst(status)}
        </div>
      );
    },
    filterFn: (row, _, filterValue) => {
      if (!filterValue || filterValue === "all") return true;

      const course = row.original.courses.find((c) => c.course_name === "301");

      if (filterValue === "passed") return course?.status === "passed";
      if (filterValue === "not_passed") return course?.status !== "passed";

      return true;
    },
  },
  {
    accessorKey: "class_401",
    header: () => <div className="font-semibold">Class 401</div>,
    cell: ({ row }) => {
      const course = row.original.courses.find((c) => c.course_name === "401");

      const status = course?.status ?? "not_started";

      return (
        <div className={`font-semibold text-${color_map[status]}-500`}>
          {capitalizeFirst(status)}
        </div>
      );
    },
    filterFn: (row, _, filterValue) => {
      if (!filterValue || filterValue === "all") return true;

      const course = row.original.courses.find((c) => c.course_name === "401");

      if (filterValue === "passed") return course?.status === "passed";
      if (filterValue === "not_passed") return course?.status !== "passed";

      return true;
    },
  },
  {
    accessorKey: "graduated",
    header: () => <div className="font-semibold">Graduated</div>,
    cell: ({ row }) => {
      const graduated = row.original.courses.every(
        (course) => course.status === "passed",
      );

      return <div>{graduated ? "Yes" : "No"}</div>;
    },
    filterFn: (row, _, filterValue) => {
      const graduated = row.original.courses.every(
        (course) => course.status === "passed",
      );

      if (filterValue === "yes") return graduated;
      if (filterValue === "no") return !graduated;
      return true;
    },
  },
  {
    id: "coursePass",
    header: () => <div className="font-semibold">Course Pass</div>,
    cell: () => null,
    filterFn: (row, _, filterValue) => {
      if (!filterValue || filterValue === "all") return true;

      return row.original.courses.some(
        (course) =>
          course.course_name === filterValue && course.status === "passed",
      );
    },
  },
];
