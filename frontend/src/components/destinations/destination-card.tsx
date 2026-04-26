"use client";

import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Destination } from "@/types/destinations";

interface DestinationCardProps {
  destination: Destination;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

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

const ingestionStatusStyles: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  running: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
  queued: "bg-muted text-muted-foreground",
};

const categoryLabels: Record<string, string> = {
  activities: "Activities",
  cruises: "Cruises",
  hotels: "Hotels",
  attractions: "Attractions",
  transfers: "Transfers",
  restaurants: "Restaurants",
};

export function DestinationCard({
  destination,
  onEdit,
  onDelete,
}: DestinationCardProps) {
  const isActive = destination.status === "active";

  return (
    <Card className="relative overflow-hidden flex flex-col">
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1",
          isActive ? "bg-gold" : "bg-muted"
        )}
      />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{destination.countryFlag}</span>
            <h3 className="font-semibold truncate">{destination.name}</h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="outline" className="text-xs">
              {destination.region}
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                isActive
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {destination.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pt-0">
        {/* Product counts */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(destination.productCounts)
            .filter(([, count]) => count > 0)
            .map(([cat, count]) => (
              <Badge
                key={cat}
                variant="secondary"
                className="text-[10px] h-5 font-normal"
              >
                {categoryLabels[cat] || cat} {count}
              </Badge>
            ))}
          {Object.values(destination.productCounts).every((c) => c === 0) && (
            <span className="text-xs text-muted-foreground">No products yet</span>
          )}
        </div>

        {/* Last fetched */}
        <div className="text-sm">
          <span className="text-muted-foreground">Last fetched: </span>
          {(destination.lastIngestionRun || destination.lastScrapeRun) ? (
            <span className="inline-flex items-center gap-1.5">
              <span>
                {formatRelativeTime(
                  (destination.lastIngestionRun?.date ?? destination.lastScrapeRun?.date) as string
                )}
              </span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] h-5 gap-1",
                  ingestionStatusStyles[
                    destination.lastIngestionRun?.status ?? destination.lastScrapeRun?.status ?? "queued"
                  ]
                )}
              >
                {(destination.lastIngestionRun?.status ?? destination.lastScrapeRun?.status) === "running" && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {destination.lastIngestionRun?.status ?? destination.lastScrapeRun?.status}
              </Badge>
            </span>
          ) : (
            <span className="text-muted-foreground">Never</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onEdit(destination.id)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(destination.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
