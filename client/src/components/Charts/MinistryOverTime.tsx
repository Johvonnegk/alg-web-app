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

type MinistryRow = {
  period: string;
  user_id: string | null;
  outreach: number;
  tech_arts: number;
  worship: number;
  small_groups: number;
  children_youth: number;
  follow_up: number;
  impressions: number;
  is_total: boolean;
};

export default function MinistryOverTime({
  ministries,
  granularity,
}: {
  ministries: MinistryRow[];
  granularity: string;
}) {
  if (!ministries || ministries.length === 0) return <p>No data available</p>;

  const isTotals = ministries[0].is_total;

  return (
    <div>
      <h2 className="text-center font-semibold text-lg">
        Ministries over time: ({granularity})
      </h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={ministries}
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
              lineHeight: "24px",
            }}
          />

          {/* Ministry categories */}
          <Line
            type="monotone"
            dataKey="outreach"
            stroke="#8884d8"
            name="Outreach"
          />
          <Line
            type="monotone"
            dataKey="tech_arts"
            stroke="#82ca9d"
            name="Tech Arts"
          />
          <Line
            type="monotone"
            dataKey="worship"
            stroke="#ffc658"
            name="Worship"
          />
          <Line
            type="monotone"
            dataKey="small_groups"
            stroke="#d88484"
            name="Small Groups"
          />
          <Line
            type="monotone"
            dataKey="children_youth"
            stroke="#84d8d2"
            name="Children & Youth"
          />
          <Line
            type="monotone"
            dataKey="follow_up"
            stroke="#a784d8"
            name="Follow Up"
          />
          <Line
            type="monotone"
            dataKey="impressions"
            stroke="#84d884"
            name="Impressions"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
