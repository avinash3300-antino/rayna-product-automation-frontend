"use client";

import {
  ImageIcon,
  MapPin,
  Clock,
  Star,
  Tag,
  ListChecks,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Activity, ActivityStatus } from "@/types/activities";

interface ActivityOverviewTabProps {
  activity: Activity;
}

const statusStyles: Record<ActivityStatus, string> = {
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

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours}h`;
  return `${hours}h ${remaining}m`;
}

export function ActivityOverviewTab({ activity }: ActivityOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cover Image + Quick Stats */}
      <Card className="lg:col-span-1">
        <CardContent className="p-4">
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            {activity.coverImageUrl ? (
              <img
                src={activity.coverImageUrl}
                alt={activity.name}
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
                className={cn("text-xs capitalize", statusStyles[activity.status])}
              >
                {activity.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Category</span>
              <Badge variant="outline" className="text-xs capitalize">
                {activity.category}
              </Badge>
            </div>
            {activity.subCategory && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subcategory</span>
                <span className="text-sm font-medium capitalize">
                  {activity.subCategory}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Activity Type</span>
              <span className="text-sm font-medium capitalize">
                {activity.activityType}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Quality Score</span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  getQualityScoreStyle(activity.qualityScore)
                )}
              >
                {activity.qualityScore}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <span className="text-sm font-medium">
                {formatDuration(activity.durationMinutes)}
              </span>
            </div>
            {activity.rating !== null && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-sm font-medium">{activity.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({activity.reviewCount} reviews)
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Tags */}
        {activity.tags && activity.tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activity.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Highlights */}
        {activity.highlights && activity.highlights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {activity.highlights.map((highlight, idx) => (
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
              {activity.included && activity.included.length > 0 ? (
                <ul className="space-y-2">
                  {activity.included.map((item, idx) => (
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
              {activity.excluded && activity.excluded.length > 0 ? (
                <ul className="space-y-2">
                  {activity.excluded.map((item, idx) => (
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
