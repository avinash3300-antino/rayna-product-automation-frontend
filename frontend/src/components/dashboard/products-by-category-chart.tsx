"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductsByCategory } from "@/types/dashboard";

const ALL_KEY = "__all__";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="text-sm font-medium">{payload[0].name}</p>
      <p className="text-sm text-muted-foreground">
        {payload[0].value.toLocaleString()} products
      </p>
    </div>
  );
}

interface ProductsByCategoryChartProps {
  data: Record<string, ProductsByCategory[]>;
}

export function ProductsByCategoryChart({ data }: ProductsByCategoryChartProps) {
  const cities = Object.keys(data).sort();
  const [selected, setSelected] = useState<string>(ALL_KEY);

  const categoryData = useMemo(() => {
    if (selected !== ALL_KEY) return data[selected] ?? [];

    // Merge all cities
    const merged: Record<string, number> = {};
    for (const cats of Object.values(data)) {
      for (const c of cats) {
        merged[c.category] = (merged[c.category] ?? 0) + c.count;
      }
    }
    return Object.entries(merged)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [data, selected]);

  const total = categoryData.reduce((s, c) => s + c.count, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base">Products by Category</CardTitle>
          {cities.length > 0 && (
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="w-[180px] h-8 text-sm">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_KEY}>All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {categoryData.length === 0 ? (
          <div className="flex items-center justify-center h-[220px] text-muted-foreground">
            No category data yet
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="category"
                    strokeWidth={0}
                  >
                    {categoryData.map((entry, i) => (
                      <Cell
                        key={entry.category}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold">
                  {total.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </div>

            {/* Legend — hidden scrollbar */}
            <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {categoryData.map((entry, i) => (
                <div key={entry.category} className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{
                      backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">{entry.category}</span>
                  <span className="text-sm text-muted-foreground tabular-nums ml-auto">
                    {entry.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
