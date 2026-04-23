"use client";

import {
  Globe,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Star,
  MessageSquare,
  Link2,
  Building2,
  Ship,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Cruise } from "@/types/cruises";

interface CruiseSourceTabProps {
  cruise: Cruise;
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

export function CruiseSourceTab({ cruise }: CruiseSourceTabProps) {
  const sourceUrls: string[] = cruise.sourceUrls ?? [cruise.sourceUrl];
  const totalRatings =
    cruise.rating5 + cruise.rating4 + cruise.rating3 + cruise.rating2 + cruise.rating1;

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
            label="Source Type"
            value={
              <span className="capitalize">{cruise.sourceType}</span>
            }
          />
          <FieldRow
            label="Verified"
            value={
              <Badge
                variant="secondary"
                className={
                  cruise.verified
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                <ShieldCheck className="h-3 w-3 mr-1" />
                {cruise.verified ? "Verified" : "Not Verified"}
              </Badge>
            }
          />
          <FieldRow
            label="Dedup Hash"
            value={
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono max-w-xs truncate block text-right">
                {cruise.dedupHash}
              </code>
            }
          />
        </CardContent>
      </Card>

      {/* Operator Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Operator Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <FieldRow
            label="Operator Name"
            value={cruise.operatorName || <EmptyField />}
          />
          <FieldRow
            label="Website"
            value={
              cruise.operatorWebsite ? (
                <a
                  href={cruise.operatorWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 underline underline-offset-2"
                >
                  {cruise.operatorWebsite}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <EmptyField />
              )
            }
          />
          <FieldRow
            label="License Body"
            value={cruise.operatorLicenseBody || <EmptyField />}
          />
          <FieldRow
            label="Established Year"
            value={
              cruise.operatorEstablishedYear !== null
                ? cruise.operatorEstablishedYear
                : <EmptyField />
            }
          />
          <FieldRow
            label="Fleet Size"
            value={
              cruise.operatorFleetSize !== null ? (
                <span className="flex items-center gap-1">
                  <Ship className="h-3.5 w-3.5" />
                  {cruise.operatorFleetSize} vessels
                </span>
              ) : (
                <EmptyField />
              )
            }
          />
          {cruise.operatorCertifications &&
            cruise.operatorCertifications.length > 0 && (
              <div className="py-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Certifications
                </p>
                <div className="flex flex-wrap gap-2">
                  {cruise.operatorCertifications.map((cert, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs gap-1"
                    >
                      <Award className="h-3 w-3" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Source URLs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Source URLs ({sourceUrls.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sourceUrls.map((url, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2.5 rounded-md border bg-muted/30"
              >
                <span className="text-xs text-muted-foreground font-mono w-5 shrink-0">
                  {idx + 1}.
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-400 underline underline-offset-2 min-w-0 truncate"
                >
                  {url}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            ))}
          </div>
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
          <FieldRow label="Created At" value={formatDate(cruise.createdAt)} />
          <FieldRow label="Updated At" value={formatDate(cruise.updatedAt)} />
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
                {cruise.rating !== null ? cruise.rating.toFixed(1) : "--"}
              </p>
              <p className="text-xs text-muted-foreground">Overall Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{cruise.reviewCount}</p>
              <p className="text-xs text-muted-foreground">Total Reviews</p>
            </div>
          </div>

          {totalRatings > 0 && (
            <div className="space-y-3">
              <RatingBar
                label="5 stars"
                count={cruise.rating5}
                total={totalRatings}
              />
              <RatingBar
                label="4 stars"
                count={cruise.rating4}
                total={totalRatings}
              />
              <RatingBar
                label="3 stars"
                count={cruise.rating3}
                total={totalRatings}
              />
              <RatingBar
                label="2 stars"
                count={cruise.rating2}
                total={totalRatings}
              />
              <RatingBar
                label="1 star"
                count={cruise.rating1}
                total={totalRatings}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Snippets */}
      {cruise.reviewSnippets && cruise.reviewSnippets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Review Snippets ({cruise.reviewSnippets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cruise.reviewSnippets.map((snippet, idx) => (
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
