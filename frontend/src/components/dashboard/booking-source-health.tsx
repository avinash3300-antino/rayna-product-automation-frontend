"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MOCK_BOOKING_SOURCES } from "@/lib/mock-dashboard-data";
import type { HealthStatus } from "@/types/dashboard";

const statusDot: Record<HealthStatus, string> = {
  healthy: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
};

const statusLabel: Record<HealthStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
};

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function BookingSourceHealth() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Booking Source Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {MOCK_BOOKING_SOURCES.map((source, i) => (
          <div key={source.id}>
            <div
              className={cn(
                "flex items-center gap-3 py-3 rounded-md px-2 -mx-2",
                source.status === "degraded" && "bg-amber-500/5",
                source.status === "down" && "bg-red-500/5"
              )}
            >
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full shrink-0",
                  statusDot[source.status]
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{source.name}</p>
                <p className="text-xs text-muted-foreground">
                  {statusLabel[source.status]} · Last ping{" "}
                  {formatRelativeTime(source.lastPing)}
                </p>
              </div>
              <span className="text-sm tabular-nums font-mono text-muted-foreground">
                {source.responseMs}ms
              </span>
            </div>
            {i < MOCK_BOOKING_SOURCES.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
