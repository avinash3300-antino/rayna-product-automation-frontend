"use client";

import {
  ImageIcon,
  Star,
  ListChecks,
  CheckCircle2,
  XCircle,
  Clock,
  Ship,
  UtensilsCrossed,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Cruise, CruiseStatus } from "@/types/cruises";

interface CruiseOverviewTabProps {
  cruise: Cruise;
}

const statusStyles: Record<CruiseStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  enriched: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  review_ready: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  published: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20",
};

function getQualityScoreStyle(score: number): string {
  if (score > 80) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (score > 60) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-red-500/10 text-red-600 border-red-500/20";
}

function formatDuration(hours: number | null, days: number | null): string {
  if (days !== null && days > 0) return `${days} day${days !== 1 ? "s" : ""}`;
  if (hours !== null) {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }
  return "N/A";
}

export function CruiseOverviewTab({ cruise }: CruiseOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cover Image + Quick Stats */}
      <Card className="lg:col-span-1">
        <CardContent className="p-4">
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            {cruise.coverImageUrl ? (
              <img
                src={cruise.coverImageUrl}
                alt={cruise.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-10 w-10" />
                <span className="text-xs">No cover image</span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                variant="secondary"
                className={cn("text-xs capitalize", statusStyles[cruise.status])}
              >
                {cruise.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Category</span>
              <Badge variant="outline" className="text-xs capitalize">
                {cruise.category}
              </Badge>
            </div>
            {cruise.cruiseType && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cruise Type</span>
                <span className="text-sm font-medium capitalize">
                  {cruise.cruiseType}
                </span>
              </div>
            )}
            {cruise.vesselType && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vessel Type</span>
                <span className="text-sm font-medium capitalize flex items-center gap-1">
                  <Ship className="h-3.5 w-3.5" />
                  {cruise.vesselType}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Quality Score</span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  getQualityScoreStyle(cruise.qualityScore)
                )}
              >
                {cruise.qualityScore}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(cruise.durationHours, cruise.durationDays)}
              </span>
            </div>
            {cruise.rating !== null && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-sm font-medium">{cruise.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({cruise.reviewCount} reviews)
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Meal Included</span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  cruise.mealIncluded
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <UtensilsCrossed className="h-3 w-3 mr-1" />
                {cruise.mealIncluded ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Highlights */}
        {cruise.highlights && cruise.highlights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {cruise.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Star className="h-3.5 w-3.5 mt-0.5 text-[#C9A84C] shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Included / Excluded */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cruise.included && cruise.included.length > 0 ? (
                <ul className="space-y-2">
                  {cruise.included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-emerald-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No items listed
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Excluded
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cruise.excluded && cruise.excluded.length > 0 ? (
                <ul className="space-y-2">
                  {cruise.excluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-3.5 w-3.5 mt-0.5 text-red-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No items listed
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
