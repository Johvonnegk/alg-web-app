import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/supabaseClient";

type RoleChangeStat = {
  period: string;
  role: number;
  promotions: number;
  demotions: number;
};

const RoleChangeChart: React.FC = () => {
  const [data, setData] = useState<RoleChangeStat[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.rpc("get_role_change_stats", {
        granularity: "month",
      });

      if (error) {
        console.error(error);
      } else {
        setData(data || []);
      }
    };

    fetchData();
  }, []);
  console.log(data);
  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <XAxis
            dataKey="period"
            tickMargin={10}
            label={{ value: "Period", position: "bottom", offset: 0 }}
          />
          <YAxis
            allowDecimals={false}
            label={{
              value: "Events",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ marginBottom: 20 }} />

          {/* Promotions bar (green) */}
          <Bar dataKey="promotions" fill="#22c55e" name="Promotions" />

          {/* Demotions bar (red) */}
          <Bar dataKey="demotions" fill="#ef4444" name="Demotions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoleChangeChart;
