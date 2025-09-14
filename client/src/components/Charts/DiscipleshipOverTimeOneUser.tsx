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

const stageMap: Record<string, number> = {
  babe: 1,
  child: 2,
  youth: 3,
  wall: 4,
  parent: 5,
  grandParent: 6,
};

const stageColors: Record<string, string> = {
  youth: "#8884d8",
  babe: "#82ca9d",
  child: "#ffc658",
  wall: "#d88484",
  parent: "#84d8d2",
  grandParent: "#a784d8",
};

type DiscipleshipRow = {
  period: string;
  user_id: string | null;
  stage: string;
  count: number;
  is_total: boolean;
};

export function DiscipleshipOneUserChart({
  discipleship,
  granularity,
}: {
  discipleship: DiscipleshipRow[];
  granularity: string;
}) {
  if (!discipleship.length) return <p>No data available</p>;

  // Transform stages → numbers
  const transformed = discipleship.map((row) => ({
    ...row,
    stageValue: stageMap[row.stage] ?? 0,
  }));

  return (
    <div>
      <h2 className="text-center font-semibold text-lg">
        Discipleship Stage Progression ({granularity})
      </h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={transformed}
          margin={{ top: 20, right: 30, left: 10, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" tickMargin={20} />
          <YAxis
            width={100}
            ticks={Object.values(stageMap)}
            domain={[1, Object.keys(stageMap).length]}
            allowDecimals={false}
            tickFormatter={(val) =>
              Object.keys(stageMap).find((key) => stageMap[key] === val) || val
            }
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Stage") {
                return [
                  Object.keys(stageMap).find((key) => stageMap[key] === value),
                  "Stage",
                ];
              }
              return [value, name];
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            layout="horizontal"
            wrapperStyle={{
              paddingTop: 20,
              whiteSpace: "normal",
              width: "100%",
              lineHeight: "24px",
            }}
          />
          <Line
            type="monotone"
            dataKey="stageValue"
            stroke="#8884d8"
            name="Stage"
            dot={{ r: 5 }}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
