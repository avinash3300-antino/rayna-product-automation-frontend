"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ImageIcon,
  Star,
  Clock,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ActivityCardItem, ActivityStatus } from "@/types/activities";

interface ActivityCardProps {
  activity: ActivityCardItem;
}

const statusStyles: Record<ActivityStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  enriched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  review_ready: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  published: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20",
};

const statusLabels: Record<ActivityStatus, string> = {
  draft: "Draft",
  enriched: "Enriched",
  review_ready: "Review Ready",
  approved: "Approved",
  published: "Published",
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${currency} ${price.toFixed(2)}`;
  }
}

function getQualityScoreColor(score: number): string {
  if (score > 80) return "bg-emerald-500";
  if (score > 60) return "bg-amber-500";
  return "bg-red-500";
}

function getQualityScoreTextColor(score: number): string {
  if (score > 80) return "text-emerald-400";
  if (score > 60) return "text-amber-400";
  return "text-red-400";
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Link href={`/activities/${activity.id}`} className="block group">
      <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow h-full border-border/50 hover:border-border">
        {/* Cover Image */}
        <div className="relative h-[200px] bg-muted flex items-center justify-center overflow-hidden">
          {activity.coverImageUrl ? (
            <Image
              src={activity.coverImageUrl}
              alt={activity.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
          )}

          {/* Status badge overlay */}
          <Badge
            variant="secondary"
            className={cn(
              "absolute top-2 right-2 text-[10px] capitalize",
              statusStyles[activity.status]
            )}
          >
            {statusLabels[activity.status]}
          </Badge>

          {/* Category badge overlay */}
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 text-[10px] capitalize bg-black/60 text-white border-transparent"
          >
            {activity.category.replace("_", " ")}
          </Badge>
        </div>

        <CardContent className="flex-1 flex flex-col gap-2.5 p-4">
          {/* Name */}
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {activity.name}
          </h3>

          {/* City + Duration */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{activity.city}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(activity.durationMinutes)}
            </span>
          </div>

          {/* Price + Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#C9A84C]">
              {formatPrice(activity.priceFrom, activity.currency)}
            </span>
            {activity.rating !== null ? (
              <span className="flex items-center gap-1 text-xs">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{activity.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({activity.reviewCount})
                </span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">No reviews</span>
            )}
          </div>

          {/* Quality Score */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  getQualityScoreColor(activity.qualityScore)
                )}
                style={{ width: `${Math.min(activity.qualityScore, 100)}%` }}
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-mono tabular-nums",
                getQualityScoreTextColor(activity.qualityScore)
              )}
            >
              {activity.qualityScore}
            </span>
          </div>

          {/* Feature Badges */}
          <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-border/50">
            {activity.freeCancellation && (
              <Badge
                variant="outline"
                className="text-[10px] h-5 font-normal gap-1 text-emerald-400 border-emerald-500/20"
              >
                <CheckCircle2 className="h-3 w-3" />
                Free Cancel
              </Badge>
            )}
            {activity.instantConfirmation && (
              <Badge
                variant="outline"
                className="text-[10px] h-5 font-normal gap-1 text-blue-400 border-blue-500/20"
              >
                <Zap className="h-3 w-3" />
                Instant
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export { formatDuration, formatPrice, getQualityScoreColor, getQualityScoreTextColor, statusStyles, statusLabels };
