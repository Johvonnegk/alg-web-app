import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type GiftRow = {
  period: string;
  user_id: string | null;
  serving: number;
  administrator: number;
  encouragement: number;
  giving: number;
  mercy: number;
  teaching: number;
  prophecy: number;
  is_total: boolean;
};

export default function GiftsOverTime({
  gifts,
  granularity,
}: {
  gifts: GiftRow[];
  granularity: string;
}) {
  if (!gifts.length) return <p>No data available</p>;

  const isTotals = gifts[0].is_total;

  return (
    <div className="w-full">
      <h2 className="text-center font-semibold text-lg">
        Gifts over time: ({granularity})
      </h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={gifts}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            align="center"
            layout="horizontal"
            wrapperStyle={{
              paddingTop: 20,
              whiteSpace: "normal",
              width: "100%",
              lineHeight: "24px", // more vertical space
            }}
          />

          {/* Always plot all gift categories */}
          <Line
            type="monotone"
            dataKey="serving"
            stroke="#8884d8"
            name="Serving"
          />
          <Line
            type="monotone"
            dataKey="administrator"
            stroke="#82ca9d"
            name="Administrator"
          />
          <Line
            type="monotone"
            dataKey="encouragement"
            stroke="#ffc658"
            name="Encouragement"
          />
          <Line
            type="monotone"
            dataKey="giving"
            stroke="#d88484"
            name="Giving"
          />
          <Line type="monotone" dataKey="mercy" stroke="#84d8d2" name="Mercy" />
          <Line
            type="monotone"
            dataKey="teaching"
            stroke="#a784d8"
            name="Teaching"
          />
          <Line
            type="monotone"
            dataKey="prophecy"
            stroke="#84d884"
            name="Prophecy"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
