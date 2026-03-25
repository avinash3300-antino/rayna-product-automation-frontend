"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { QueueLengthData } from "@/types/monitoring";

interface QueueLengthsChartProps {
  data: QueueLengthData[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="text-sm font-medium mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs text-muted-foreground">
          <span
            className="inline-block h-2 w-2 rounded-full mr-1.5"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function QueueLengthsChart({ data }: QueueLengthsChartProps) {
  return (
    <Card className="border-border/50 bg-navy-light/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Queue Lengths</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              iconType="circle"
              iconSize={8}
            />
            <Bar
              dataKey="queueA"
              name="Queue A"
              fill="hsl(var(--chart-1))"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="queueB"
              name="Queue B"
              fill="hsl(var(--chart-2))"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="enrichment"
              name="Enrichment"
              fill="hsl(var(--chart-3))"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="error"
              name="Error"
              fill="hsl(var(--chart-5))"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
