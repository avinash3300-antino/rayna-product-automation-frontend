"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MOCK_FRESHNESS_DATA } from "@/lib/mock-dashboard-data";
import type { DataType, FreshnessLevel } from "@/types/dashboard";

const DATA_TYPE_LABELS: Record<DataType, string> = {
  hotel_pricing: "Hotel Pricing",
  attraction_prices: "Attraction Prices",
  operating_hours: "Operating Hours",
  descriptions: "Descriptions",
  images: "Images",
};

const DATA_TYPES: DataType[] = [
  "hotel_pricing",
  "attraction_prices",
  "operating_hours",
  "descriptions",
  "images",
];

const freshnessColors: Record<FreshnessLevel, string> = {
  fresh: "bg-emerald-500",
  warning: "bg-amber-500",
  stale: "bg-red-500",
};

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "< 1h ago";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function FreshnessHeatmap() {
  return (
    <Card className="h-full border-border/50 bg-navy-light/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Data Freshness</CardTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Fresh
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Warning
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-500" /> Stale
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={100}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-2 pr-3">
                    Destination
                  </th>
                  {DATA_TYPES.map((dt) => (
                    <th
                      key={dt}
                      className="text-center text-xs font-medium text-muted-foreground pb-2 px-1"
                    >
                      <span className="block max-w-[72px] mx-auto truncate">
                        {DATA_TYPE_LABELS[dt]}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_FRESHNESS_DATA.map((row) => (
                  <tr key={row.destination}>
                    <td className="text-sm font-medium py-1.5 pr-3 whitespace-nowrap">
                      {row.destination}
                    </td>
                    {DATA_TYPES.map((dt) => {
                      const cell = row.cells[dt];
                      return (
                        <td key={dt} className="text-center py-1.5 px-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "h-8 w-full rounded-sm cursor-default transition-opacity hover:opacity-80",
                                  freshnessColors[cell.level]
                                )}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs font-medium">
                                {row.destination} — {DATA_TYPE_LABELS[dt]}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {cell.level.charAt(0).toUpperCase() +
                                  cell.level.slice(1)}{" "}
                                · Updated {formatRelativeTime(cell.lastUpdated)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
