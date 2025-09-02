import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface GrowthPoint {
  period: string;
  total_users: number;
}

interface Props {
  data: GrowthPoint[];
  granularity: string;
  setGranularity: (value: string) => void;
  cumulative: boolean;
  setCumulative: (value: boolean) => void;
}
const TotalUsers: React.FC<Props> = ({
  data,
  granularity,
  setGranularity,
  cumulative,
  setCumulative,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-6 space-y-6">
      <h2 className="text-center font-semibold text-lg">
        User Growth Over Time ({granularity},{" "}
        {cumulative ? "Cumulative" : "Non-Cumulative"})
      </h2>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total_users"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-3"></div>
    </div>
  );
};

export default TotalUsers;
