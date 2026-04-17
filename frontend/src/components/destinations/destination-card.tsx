"use client";

import { Play, Brain, Pencil, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Destination, IngestionRunStatus } from "@/types/destinations";

interface DestinationCardProps {
  destination: Destination;
  onRunIngestion: (id: string) => void;
  onViewIntelligence: (id: string) => void;
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

function getDaysAgo(isoDate: string | null): string {
  if (!isoDate) return "Never run";
  const days = Math.floor(
    (Date.now() - new Date(isoDate).getTime()) / 86400000
  );
  if (days === 0) return "Last run: today";
  if (days === 1) return "Last run: 1 day ago";
  return `Last run: ${days} days ago`;
}

const ingestionStatusStyles: Record<IngestionRunStatus, string> = {
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  running: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
  queued: "bg-muted text-muted-foreground",
};

const categoryLabels = {
  hotels: "Hotels",
  attractions: "Attractions",
  transfers: "Transfers",
  restaurants: "Restaurants",
} as const;

export function DestinationCard({
  destination,
  onRunIngestion,
  onViewIntelligence,
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
          {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map(
            (cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="text-[10px] h-5 font-normal"
              >
                {categoryLabels[cat]} {destination.productCounts[cat]}
              </Badge>
            )
          )}
        </div>

        {/* Last ingestion */}
        <div className="text-sm">
          <span className="text-muted-foreground">Last fetched: </span>
          {destination.lastIngestionRun ? (
            <span className="inline-flex items-center gap-1.5">
              <span>{formatRelativeTime(destination.lastIngestionRun.date)}</span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] h-5 gap-1",
                  ingestionStatusStyles[destination.lastIngestionRun.status]
                )}
              >
                {destination.lastIngestionRun.status === "running" && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {destination.lastIngestionRun.status}
              </Badge>
            </span>
          ) : (
            <span className="text-muted-foreground">Never</span>
          )}
        </div>

        {/* Intelligence filter */}
        <div className="text-sm text-muted-foreground">
          <span>Intelligence: </span>
          <span>{getDaysAgo(destination.intelligenceFilter.lastRunDate)}</span>
          {destination.intelligenceFilter.keywordsFound > 0 && (
            <span className="ml-1">
              ({destination.intelligenceFilter.keywordsFound} keywords,{" "}
              {destination.intelligenceFilter.sourcesApproved} sources)
            </span>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onRunIngestion(destination.id)}
          >
            <Play className="mr-1 h-3 w-3" />
            Fetch Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onViewIntelligence(destination.id)}
          >
            <Brain className="mr-1 h-3 w-3" />
            Intelligence
          </Button>
          <div className="flex items-center gap-1 ml-auto">
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
        </div>
      </CardContent>
    </Card>
  );
}
