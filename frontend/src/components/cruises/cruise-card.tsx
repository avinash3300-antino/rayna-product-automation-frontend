"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ImageIcon,
  Star,
  Clock,
  Ship,
  UtensilsCrossed,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CruiseCardItem, CruiseStatus } from "@/types/cruises";

interface CruiseCardProps {
  cruise: CruiseCardItem;
}

const statusStyles: Record<CruiseStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  enriched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  review_ready: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  published: "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20",
};

const statusLabels: Record<CruiseStatus, string> = {
  draft: "Draft",
  enriched: "Enriched",
  review_ready: "Review Ready",
  approved: "Approved",
  published: "Published",
};

function formatDuration(hours: number | null): string {
  if (hours === null) return "N/A";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
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

export function CruiseCard({ cruise }: CruiseCardProps) {
  return (
    <Link href={`/cruises/${cruise.id}`} className="block group">
      <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow h-full border-border/50 hover:border-border">
        {/* Cover Image */}
        <div className="relative h-[200px] bg-muted flex items-center justify-center overflow-hidden">
          {cruise.coverImageUrl ? (
            <Image
              src={cruise.coverImageUrl}
              alt={cruise.name}
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
              statusStyles[cruise.status]
            )}
          >
            {statusLabels[cruise.status]}
          </Badge>

          {/* Cruise type badge overlay */}
          {cruise.cruiseType && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 text-[10px] capitalize bg-black/60 text-white border-transparent"
            >
              {cruise.cruiseType}
            </Badge>
          )}
        </div>

        <CardContent className="flex-1 flex flex-col gap-2.5 p-4">
          {/* Name */}
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {cruise.name}
          </h3>

          {/* City + Duration */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{cruise.city}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(cruise.durationHours)}
            </span>
          </div>

          {/* Price + Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#C9A84C]">
              {formatPrice(cruise.priceFrom, cruise.currency)}
            </span>
            {cruise.rating !== null ? (
              <span className="flex items-center gap-1 text-xs">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium">{cruise.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({cruise.reviewCount})
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
                  getQualityScoreColor(cruise.qualityScore)
                )}
                style={{ width: `${Math.min(cruise.qualityScore, 100)}%` }}
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-mono tabular-nums",
                getQualityScoreTextColor(cruise.qualityScore)
              )}
            >
              {cruise.qualityScore}
            </span>
          </div>

          {/* Feature Badges */}
          <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-border/50">
            {cruise.vesselType && (
              <Badge
                variant="outline"
                className="text-[10px] h-5 font-normal gap-1 text-blue-400 border-blue-500/20"
              >
                <Ship className="h-3 w-3" />
                {cruise.vesselType}
              </Badge>
            )}
            {cruise.mealIncluded && (
              <Badge
                variant="outline"
                className="text-[10px] h-5 font-normal gap-1 text-emerald-400 border-emerald-500/20"
              >
                <UtensilsCrossed className="h-3 w-3" />
                Meal
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export {
  formatDuration,
  formatPrice,
  getQualityScoreColor,
  getQualityScoreTextColor,
  statusStyles,
  statusLabels,
};
