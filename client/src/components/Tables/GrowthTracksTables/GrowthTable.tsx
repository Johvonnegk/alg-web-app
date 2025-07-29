import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Growth } from "@/types/Growth";
import { format } from "date-fns";
interface GrowthTableProps {
  data: Growth[];
}
const GrowthTable: React.FC<GrowthTableProps> = ({ data }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 pb-3 shadow-md">
      <Table className="w-full border-separate border-spacing-0">
        <TableCaption>A list of growth tracks and their statuses.</TableCaption>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="w-[100px] px-4 py-2">Course</TableHead>
            <TableHead className="px-4 py-2">Status</TableHead>
            <TableHead className="px-4 py-2">Date Completed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((growth, idx) => (
            <TableRow
              key={idx}
              className={`
                ${idx !== 0 ? "border-t border-gray-200" : ""}
              `}
            >
              <TableCell className="px-4 py-2 font-semibold">
                {growth.course_name}
              </TableCell>
              <TableCell className="px-4 py-2">{growth.status}</TableCell>
              <TableCell className="px-4 py-2">
                {growth.completed_at
                  ? format(
                      new Date(growth.completed_at),
                      "MMM do, yyyy 'at' h:mm a"
                    )
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GrowthTable;
