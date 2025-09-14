import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type PivotedRoleChangeStat = {
  period: string;
  [key: string]: number | string;
};

interface RoleChangeChartProps {
  data: PivotedRoleChangeStat[];
}

const RoleChangeChart: React.FC<RoleChangeChartProps> = ({ data }) => {
  const roles = [1, 2, 3, 4, 5]; // 5 tiers including Admin

  const tierColors: Record<number, { promotions: string; demotions: string }> =
    {
      1: { promotions: "#16a34a", demotions: "#964B00" }, // Tier 1
      2: { promotions: "#2563eb", demotions: "#9333ea" }, // Tier 2
      3: { promotions: "#f59e0b", demotions: "#d946ef" }, // Tier 3
      4: { promotions: "#0ea5e9", demotions: "#ea580c" }, // Tier 4
      5: { promotions: "#64748b", demotions: "#e11d48" }, // Admin
    };

  const tierLabels: Record<number, string> = {
    1: "Tier 1",
    2: "Tier 2",
    3: "Tier 3",
    4: "Tier 4",
    5: "Admin",
  };

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <XAxis dataKey="period" tickMargin={10} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend verticalAlign="top" wrapperStyle={{ marginBottom: 20 }} />

          {roles.map((role) => (
            <React.Fragment key={role}>
              <Bar
                dataKey={`role${role}_promotions`}
                fill={tierColors[role].promotions}
                name={`${tierLabels[role]} Promotions`}
                stackId={`tier${role}`}
              />
              <Bar
                dataKey={`role${role}_demotions`}
                fill={tierColors[role].demotions}
                name={`${tierLabels[role]} Demotions`}
                stackId={`tier${role}`}
              />
            </React.Fragment>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoleChangeChart;
