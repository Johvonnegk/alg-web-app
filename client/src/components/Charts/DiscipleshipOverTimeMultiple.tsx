import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DiscipleshipRow = {
  period: string;
  user_id: string | null;
  stage: string;
  count: number;
  is_total: boolean;
};

export function DiscipleshipGroupChart({
  data,
  granularity,
}: {
  data: DiscipleshipRow[];
  granularity: string;
}) {
  if (!data.length) return <p>No data available</p>;

  // Pivot into { period, youth: X, babe: Y, ... }
  const grouped = Object.values(
    data.reduce((acc: any, row) => {
      if (!acc[row.period]) acc[row.period] = { period: row.period };
      acc[row.period][row.stage] = row.count;
      return acc;
    }, {})
  );

  return (
    <div>
      <h2 className="text-center font-semibold text-lg">
        Discipleship Stage Distribution ({granularity})
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={grouped}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend verticalAlign="bottom" wrapperStyle={{ marginTop: 10 }} />

          {/* Stacked bars for each stage */}
          <Bar dataKey="youth" stackId="a" fill="#8884d8" />
          <Bar dataKey="babe" stackId="a" fill="#82ca9d" />
          <Bar dataKey="child" stackId="a" fill="#ffc658" />
          <Bar dataKey="wall" stackId="a" fill="#d88484" />
          <Bar dataKey="parent" stackId="a" fill="#84d8d2" />
          <Bar dataKey="grandParent" stackId="a" fill="#a784d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
