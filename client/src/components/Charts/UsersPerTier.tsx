import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  Legend,
} from "recharts";
import { UserProfile } from "@/types/UserProfile";
import { rolesSelect } from "@/types/SystemRoles";
import { parseISO, startOfMonth, endOfMonth, subMonths } from "date-fns";

// shadcn/ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Mode = "total" | "monthCompare";

interface UsersPerTierProps {
  data: UserProfile[];
  defaultMode?: Mode; // optional: set initial mode from parent
  onModeChange?: (mode: Mode) => void; // optional: notify parent if needed
}

const UsersPerTier: React.FC<UsersPerTierProps> = ({
  data,
  defaultMode = "total",
  onModeChange,
}) => {
  const [mode, setMode] = useState<Mode>(defaultMode);

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthDate = subMonths(now, 1);
  const lastMonthStart = startOfMonth(lastMonthDate);
  const lastMonthEnd = endOfMonth(lastMonthDate);

  const toDate = (d: string | Date | undefined) =>
    d instanceof Date ? d : d ? parseISO(d) : undefined;

  const chartData = useMemo(() => {
    // Build a role->count map depending on mode
    const totalCounts: Record<number, number> = {};
    const thisMonthCounts: Record<number, number> = {};
    const lastMonthCounts: Record<number, number> = {};

    for (const user of data) {
      const role = (user as any).role_id as number;
      const created = toDate((user as any).created_at);

      if (mode === "total") {
        totalCounts[role] = (totalCounts[role] || 0) + 1;
      } else {
        if (created && created >= thisMonthStart && created <= thisMonthEnd) {
          thisMonthCounts[role] = (thisMonthCounts[role] || 0) + 1;
        }
        if (created && created >= lastMonthStart && created <= lastMonthEnd) {
          lastMonthCounts[role] = (lastMonthCounts[role] || 0) + 1;
        }
      }
    }

    return rolesSelect.map(({ value, display }) =>
      mode === "total"
        ? { display, count: totalCounts[value] || 0 }
        : {
            display,
            thisMonth: thisMonthCounts[value] || 0,
            lastMonth: lastMonthCounts[value] || 0,
          }
    );
  }, [data, mode, thisMonthStart, thisMonthEnd, lastMonthStart, lastMonthEnd]);

  const handleModeChange = (val: string) => {
    const m = (val as Mode) || "total";
    setMode(m);
    onModeChange?.(m);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Users per Tier</h3>

        <Select value={mode} onValueChange={handleModeChange}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="total">Total (All Time)</SelectItem>
            <SelectItem value="monthCompare">This vs Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-80 overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 16, right: 20, left: 20, bottom: 4 }} // extra bottom room
          >
            {mode !== "total" && (
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ marginBottom: 8 }}
              />
            )}

            <XAxis dataKey="display" height={48} tickMargin={10}>
              <Label value="Tiers" position="bottom" offset={14} />
            </XAxis>

            <YAxis allowDecimals={false}>
              <Label
                value={mode === "total" ? "Users" : "New Users"}
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>

            <Tooltip />

            {mode === "total" ? (
              <Bar dataKey="count" name="Total Users" fill="#006162" />
            ) : (
              <>
                <Bar dataKey="lastMonth" name="Last Month" fill="#6fd1ab" />
                <Bar dataKey="thisMonth" name="This Month" fill="#006162" />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsersPerTier;
