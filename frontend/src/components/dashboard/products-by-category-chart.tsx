"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PRODUCTS_BY_CATEGORY } from "@/lib/mock-dashboard-data";

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

const total = MOCK_PRODUCTS_BY_CATEGORY.reduce((s, c) => s + c.count, 0);

export function ProductsByCategoryChart() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Products by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <Pie
                  data={MOCK_PRODUCTS_BY_CATEGORY}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="category"
                  strokeWidth={0}
                >
                  {MOCK_PRODUCTS_BY_CATEGORY.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
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

          {/* Legend */}
          <div className="flex flex-col gap-3">
            {MOCK_PRODUCTS_BY_CATEGORY.map((entry) => (
              <div key={entry.category} className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium">{entry.category}</span>
                <span className="text-sm text-muted-foreground tabular-nums ml-auto">
                  {entry.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
