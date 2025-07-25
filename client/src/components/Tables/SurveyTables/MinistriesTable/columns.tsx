import React from "react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Ministries } from "@/types/Ministries";

export const columns: ColumnDef<Ministries>[] = [
  {
    id: "order",
    header: "No.",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: "outreach",
    accessorKey: "outreach",
    header: "Outreach",
  },
  {
    id: "techArts",
    accessorKey: "techArts",
    header: "Tech Arts",
  },
  {
    id: "worship",
    accessorKey: "worship",
    header: "Worship",
  },
  {
    id: "smallGroups",
    accessorKey: "smallGroups",
    header: "Small Groups",
  },
  {
    id: "youth",
    accessorKey: "youth",
    header: "Youth",
  },
  {
    id: "followUp",
    accessorKey: "followUp",
    header: "Follow-Ups",
  },
  {
    id: "impressions",
    accessorKey: "impressions",
    header: "Impressions",
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    header: "Date Uploaded",
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      if (!createdAt) {
        return <p>Unknown</p>;
      }
      const date = new Date(createdAt);
      const formatted = format(date, "MMM do, yyyy 'at' h:mm a");
      return <p>{formatted}</p>;
    },
    filterFn: (row, columnId, filterValue) => {
      const rawDate = row.getValue<string>(columnId);
      if (!rawDate) return false;

      const formatted = format(new Date(rawDate), "MMM do, yyyy 'at' h:mm a")
        .toLowerCase()
        .trim();

      return formatted.includes(filterValue.toLowerCase().trim());
    },
  },
];
