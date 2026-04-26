"use client";

import { useState } from "react";
import {
  Star,
  MessageSquare,
  RefreshCw,
  Sparkles,
  ExternalLink,
  User,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useActivityReviews, useScrapeReviews, useEnrichReviews } from "@/hooks/api/use-reviews";
import type { Activity, ActivityReview } from "@/types/activities";

interface ActivityReviewsTabProps {
  activity: Activity;
}

const platformColors: Record<string, string> = {
  google: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  tripadvisor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  trustpilot: "bg-green-500/10 text-green-600 border-green-500/20",
};

const platformLabels: Record<string, string> = {
  google: "Google",
  tripadvisor: "TripAdvisor",
  trustpilot: "Trustpilot",
};

function StarRating({ rating }: { rating: number | null }) {
  if (rating == null) return <span className="text-xs text-muted-foreground">No rating</span>;
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i <= stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          )}
        />
      ))}
      <span className="text-xs font-medium ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: ActivityReview }) {
  const [expanded, setExpanded] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const displayName = review.enrichedReviewerName || review.reviewerName;
  const displayText = review.enrichedText || review.reviewText;
  const isLong = displayText.length > 300;
  const hasEnriched = !!review.enrichedText;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* Header: avatar + name + rating | platform badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
            {review.reviewerAvatarUrl ? (
              <img
                src={review.reviewerAvatarUrl}
                alt={displayName}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{displayName}</span>
              {review.verified && (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              )}
              {review.enrichedReviewerName && (
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  was: {review.reviewerName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={review.rating} />
              {review.reviewDate && (
                <span className="text-xs text-muted-foreground">
                  {review.reviewDate}
                </span>
              )}
            </div>
          </div>
        </div>
        <Badge
          variant="secondary"
          className={cn("text-[10px] shrink-0", platformColors[review.sourcePlatform] || "")}
        >
          {platformLabels[review.sourcePlatform] || review.sourcePlatform}
        </Badge>
      </div>

      {review.reviewTitle && (
        <p className="text-sm font-medium">{review.reviewTitle}</p>
      )}

      {/* Review text — show enriched as primary */}
      <div className="space-y-2">
        <p className="text-sm leading-relaxed">
          {isLong && !expanded
            ? displayText.slice(0, 300) + "..."
            : displayText}
        </p>

        {/* Show original toggle — only when enriched version exists */}
        {hasEnriched && showOriginal && (
          <div className="border-l-2 border-muted pl-3 mt-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Original Review
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              {isLong && !expanded
                ? review.reviewText.slice(0, 300) + "..."
                : review.reviewText}
            </p>
          </div>
        )}
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-3">
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
        {hasEnriched && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {showOriginal ? "Hide original" : "View original"}
          </button>
        )}
        {review.sourceUrl && (
          <a
            href={review.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground ml-auto"
          >
            <ExternalLink className="h-3 w-3" />
            {platformLabels[review.sourcePlatform] || review.sourcePlatform}
          </a>
        )}
      </div>
    </div>
  );
}

export function ActivityReviewsTab({ activity }: ActivityReviewsTabProps) {
  const { data: reviewData, isLoading } = useActivityReviews(activity.id);
  const scrapeReviews = useScrapeReviews();
  const enrichReviews = useEnrichReviews();
  const [filter, setFilter] = useState<string>("all");

  const handleScrape = () => {
    scrapeReviews.mutate(
      { activityId: activity.id },
      {
        onSuccess: () => {
          toast.success("Reviews scraped successfully");
        },
        onError: () => {
          toast.error("Failed to scrape reviews");
        },
      }
    );
  };

  const handleEnrich = () => {
    enrichReviews.mutate(activity.id, {
      onSuccess: () => {
        toast.success("Reviews enriched successfully");
      },
      onError: () => {
        toast.error("Failed to enrich reviews");
      },
    });
  };

  const reviews = reviewData?.reviews ?? [];
  const filteredReviews =
    filter === "all" ? reviews : reviews.filter((r) => r.sourcePlatform === filter);

  const platformCounts = reviewData?.platformCounts ?? {};
  const total = reviewData?.total ?? 0;
  const avgRating = reviewData?.avgRating;

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter(
      (r) => r.rating != null && Math.round(r.rating) === star
    ).length,
  }));
  const maxRatingCount = Math.max(...ratingDist.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Header with scrape button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reviews</h3>
          <p className="text-sm text-muted-foreground">
            {total} reviews from {Object.keys(platformCounts).length} platform
            {Object.keys(platformCounts).length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleScrape}
            disabled={scrapeReviews.isPending}
          >
            {scrapeReviews.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            {scrapeReviews.isPending ? "Scraping..." : "Scrape Reviews"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleEnrich}
            disabled={enrichReviews.isPending || total === 0}
          >
            {enrichReviews.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {enrichReviews.isPending ? "Enriching..." : "Enrich Reviews"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : total === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium">No reviews yet</p>
            <p className="text-xs mt-1">
              Click &quot;Scrape Reviews&quot; to fetch reviews from Google, TripAdvisor &amp; Trustpilot
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Average Rating */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {avgRating ? avgRating.toFixed(1) : "—"}
                  </div>
                  <div className="mt-1">
                    <StarRating rating={avgRating ?? null} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on {total} reviews
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Rating Distribution */}
            <Card>
              <CardContent className="pt-6 space-y-1.5">
                {ratingDist.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-right">{star}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <Progress
                      value={(count / maxRatingCount) * 100}
                      className="h-2 flex-1"
                    />
                    <span className="w-6 text-right text-muted-foreground">
                      {count}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Platform Breakdown */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                {Object.entries(platformCounts).map(([platform, count]) => (
                  <div
                    key={platform}
                    className="flex items-center justify-between"
                  >
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        platformColors[platform] || ""
                      )}
                    >
                      {platformLabels[platform] || platform}
                    </Badge>
                    <span className="text-sm font-medium">{count} reviews</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({total})
            </Button>
            {Object.entries(platformCounts).map(([platform, count]) => (
              <Button
                key={platform}
                variant={filter === platform ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(platform)}
              >
                {platformLabels[platform] || platform} ({count})
              </Button>
            ))}
          </div>

          {/* Review List */}
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {filteredReviews.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No reviews for this filter
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
