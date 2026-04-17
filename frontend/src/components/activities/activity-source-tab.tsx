"use client";

import {
  Globe,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Star,
  MessageSquare,
  Hash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Activity } from "@/types/activities";

interface ActivitySourceTabProps {
  activity: Activity;
}

function EmptyField() {
  return (
    <span className="text-sm text-muted-foreground italic">Not set</span>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivitySourceTab({ activity }: ActivitySourceTabProps) {
  const totalRatings = activity.rating5 + activity.rating4 + activity.rating3;

  return (
    <div className="space-y-6">
      {/* Source Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Source Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <FieldRow
            label="Source URL"
            value={
              <a
                href={activity.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 underline underline-offset-2 max-w-sm truncate"
              >
                {activity.sourceUrl}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            }
          />
          <FieldRow
            label="Source Type"
            value={
              <span className="capitalize">{activity.sourceType}</span>
            }
          />
          <FieldRow
            label="Operator Name"
            value={activity.operatorName || <EmptyField />}
          />
          <FieldRow
            label="Verified"
            value={
              <Badge
                variant="secondary"
                className={
                  activity.verified
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                <ShieldCheck className="h-3 w-3 mr-1" />
                {activity.verified ? "Verified" : "Not Verified"}
              </Badge>
            }
          />
          <FieldRow
            label="Dedup Hash"
            value={
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono max-w-xs truncate block text-right">
                {activity.dedupHash}
              </code>
            }
          />
        </CardContent>
      </Card>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timestamps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <FieldRow label="Created At" value={formatDate(activity.createdAt)} />
          <FieldRow label="Updated At" value={formatDate(activity.updatedAt)} />
        </CardContent>
      </Card>

      {/* Rating Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4" />
            Rating Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {activity.rating !== null ? activity.rating.toFixed(1) : "--"}
              </p>
              <p className="text-xs text-muted-foreground">Overall Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{activity.reviewCount}</p>
              <p className="text-xs text-muted-foreground">Total Reviews</p>
            </div>
          </div>

          {totalRatings > 0 && (
            <div className="space-y-3">
              <RatingBar
                label="5 stars"
                count={activity.rating5}
                total={totalRatings}
              />
              <RatingBar
                label="4 stars"
                count={activity.rating4}
                total={totalRatings}
              />
              <RatingBar
                label="3 stars"
                count={activity.rating3}
                total={totalRatings}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Snippets */}
      {activity.reviewSnippets && activity.reviewSnippets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Review Snippets ({activity.reviewSnippets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activity.reviewSnippets.map((snippet, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-md border bg-muted/30 text-sm"
                >
                  <span className="text-muted-foreground mr-1">&ldquo;</span>
                  {snippet}
                  <span className="text-muted-foreground ml-1">&rdquo;</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RatingBar({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-14 shrink-0">
        {label}
      </span>
      <Progress value={pct} className="h-2 flex-1" />
      <span className="text-xs text-muted-foreground w-12 text-right shrink-0">
        {count} ({pct}%)
      </span>
    </div>
  );
}
