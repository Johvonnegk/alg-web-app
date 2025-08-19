import React from "react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Growth } from "@/types/Growth";
import { Button } from "@/components/ui/button";
interface GrowthTrackCompletionProps {
  data: Growth[];
}

const GrowthTrackCompletion: React.FC<GrowthTrackCompletionProps> = ({
  data,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<"all" | string>("all");
  const summary = data.reduce(
    (acc, item) => {
      if (item.status === "passed") acc.completed++;
      else acc.incomplete++;
      return acc;
    },
    { completed: 0, incomplete: 0 }
  );

  const groupedByCourse: Record<
    string,
    { completed: number; incomplete: number }
  > = {};

  data.forEach((item) => {
    const course = item.course_name;
    if (!groupedByCourse[course]) {
      groupedByCourse[course] = { completed: 0, incomplete: 0 };
    }
    if (item.status === "passed") groupedByCourse[course].completed++;
    else groupedByCourse[course].incomplete++;
  });

  const pieData =
    selectedCourse === "all"
      ? [
          { name: "Completed", value: summary.completed },
          { name: "Incomplete", value: summary.incomplete },
        ]
      : [
          {
            name: "Completed",
            value: groupedByCourse[selectedCourse]?.completed || 0,
          },
          {
            name: "Incomplete",
            value: groupedByCourse[selectedCourse]?.incomplete || 0,
          },
        ];
  type TooltipPayload = ReadonlyArray<any>;
  type Coordinate = {
    x: number;
    y: number;
  };

  type PieSectorData = {
    percent?: number;
    name?: string | number;
    midAngle?: number;
    middleRadius?: number;
    tooltipPosition?: Coordinate;
    value?: number;
    paddingAngle?: number;
    dataKey?: string;
    payload?: any;
    tooltipPayload?: ReadonlyArray<TooltipPayload>;
  };

  type GeometrySector = {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
  };

  type PieLabelProps = PieSectorData &
    GeometrySector & {
      tooltipPayload?: any;
    };

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: PieLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <p className="text-center text-muted-foreground mb-4">
        Course:{" "}
        <span className="font-medium">
          {selectedCourse === "all"
            ? "All Courses"
            : `Course ${selectedCourse}`}
        </span>
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={renderCustomizedLabel}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === "Completed" ? "#006162" : "#C0C0C0"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex gap-2 flex-wrap justify-center mt-4">
        <Button
          className={`${
            selectedCourse === "all"
              ? "bg-accent text-white hover:bg-grey-100"
              : "bg-accent/90"
          } hover:bg-accent text-white`}
          onClick={() => setSelectedCourse("all")}
        >
          All
        </Button>
        {Object.keys(groupedByCourse).map((course) => (
          <Button
            className={`${
              selectedCourse === course
                ? "bg-accent text-white hover:bg-grey-100"
                : "bg-accent/80"
            } hover:bg-accent text-white`}
            key={course}
            onClick={() => setSelectedCourse(course)}
          >
            {course}
          </Button>
        ))}
      </div>
    </>
  );
};

export default GrowthTrackCompletion;
