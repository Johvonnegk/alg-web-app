import React from "react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Discipleship } from "@/types/Discipleship";
import { format } from "date-fns";

const discMap = {
  youth: "Youth",
  babe: "Babe",
  child: "Child",
  wall: "The Wall",
  parent: "Parent",
  grandParent: "Grand Parent",
};

export const columns: ColumnDef<Discipleship>[] = [
  {
    id: "order",
    header: "No.",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: "stage",
    accessorKey: "stage",
    header: "Level",
    cell: ({ row }) => {
      const stage = row.original.stage;
      if (!stage) return <p>Undefined</p>;
      return <p>{discMap[stage as keyof typeof discMap]}</p>;
    },
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
