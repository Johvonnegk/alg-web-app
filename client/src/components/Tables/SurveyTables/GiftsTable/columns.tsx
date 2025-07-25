import React from "react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Gifts } from "@/types/Gifts";
import { format } from "date-fns";

export const columns: ColumnDef<Gifts>[] = [
  {
    id: "order",
    header: "No.",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: "serving",
    accessorKey: "serving",
    header: "Serving",
  },
  {
    id: "administrator",
    accessorKey: "administrator",
    header: "Administrator",
  },
  {
    id: "encouragement",
    accessorKey: "encouragement",
    header: "Encouragement",
  },
  {
    id: "giving",
    accessorKey: "giving",
    header: "Giving",
  },
  {
    id: "mercy",
    accessorKey: "mercy",
    header: "Mercy",
  },
  {
    id: "teaching",
    accessorKey: "teaching",
    header: "Teaching",
  },
  {
    id: "prophecy",
    accessorKey: "prophecy",
    header: "Prophecy",
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
