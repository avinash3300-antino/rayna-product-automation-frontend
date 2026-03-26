"use client";

import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SOURCE_STATUS_CONFIG } from "@/types/monitoring";
import type { SourceHealthEntry } from "@/types/monitoring";

interface SourceHealthCardsProps {
  sources: SourceHealthEntry[];
  onCheckNow: (sourceId: string) => void;
}

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function SourceHealthCards({
  sources,
  onCheckNow,
}: SourceHealthCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {sources.map((source) => {
        const config = SOURCE_STATUS_CONFIG[source.status];
        return (
          <Card
            key={source.id}
            className={cn(
              "border-border/50 bg-navy-light/30 p-4 transition-colors",
              config.bgColor
            )}
          >
            <div className="space-y-3">
              {/* Status + Name */}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full shrink-0",
                    config.dotColor
                  )}
                />
                <span className="text-sm font-medium text-foreground truncate">
                  {source.name}
                </span>
              </div>

              {/* Metrics */}
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span
                    className={cn(
                      "font-medium",
                      source.status === "healthy" && "text-emerald-400",
                      source.status === "degraded" && "text-amber-400",
                      source.status === "down" && "text-red-400"
                    )}
                  >
                    {config.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last check</span>
                  <span>{formatRelativeTime(source.lastCheckTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Response</span>
                  <span className="font-mono">
                    {source.responseMs > 0 ? `${source.responseMs}ms` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime</span>
                  <span className="font-mono">{source.uptime}%</span>
                </div>
              </div>

              {/* Action */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCheckNow(source.id)}
                className="w-full h-7 text-xs text-muted-foreground hover:text-gold"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Check Now
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
