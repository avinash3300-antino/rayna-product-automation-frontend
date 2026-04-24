"use client";

import { useState } from "react";
import {
  DollarSign,
  Users,
  Calendar,
  ShieldCheck,
  BadgePercent,
  RefreshCw,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScrapePricing } from "@/hooks/api/use-activities";
import type { Activity } from "@/types/activities";

interface ActivityPricingTabProps {
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

function formatPrice(amount: number | null, currency: string): string {
  if (amount === null || amount === undefined) return "--";
  return `${currency} ${amount.toFixed(2)}`;
}

function DualPrice({
  amount,
  currency,
  localAmount,
  localCurrency,
}: {
  amount: number | null;
  currency: string;
  localAmount: number | null;
  localCurrency: string | null;
}) {
  if (amount === null || amount === undefined) return <span>--</span>;
  return (
    <div className="text-right">
      <div>{formatPrice(amount, currency)}</div>
      {localCurrency && localCurrency !== currency && localAmount != null && (
        <div className="text-xs text-muted-foreground">
          ~ {formatPrice(localAmount, localCurrency)}
        </div>
      )}
    </div>
  );
}

export function ActivityPricingTab({ activity }: ActivityPricingTabProps) {
  const scrapePricing = useScrapePricing();

  const handleScrape = () => {
    scrapePricing.mutate(activity.id, {
      onSuccess: () => {
        toast.success("Pricing scraped successfully");
      },
      onError: () => {
        toast.error("Failed to scrape pricing");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Price Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <FieldRow
            label="Price (Adult)"
            value={
              <DualPrice
                amount={activity.priceAdult}
                currency={activity.currency}
                localAmount={activity.priceLocal}
                localCurrency={activity.localCurrency}
              />
            }
          />
          <FieldRow
            label="Price (Child)"
            value={formatPrice(activity.priceChild, activity.currency)}
          />
          <FieldRow
            label="Price (Infant)"
            value={formatPrice(activity.priceInfant, activity.currency)}
          />
          <FieldRow
            label="Price (Group)"
            value={formatPrice(activity.priceGroup, activity.currency)}
          />
          <FieldRow
            label="Original Price"
            value={formatPrice(activity.priceOriginal, activity.currency)}
          />
          <FieldRow
            label="Price From"
            value={
              <DualPrice
                amount={activity.priceFrom}
                currency={activity.currency}
                localAmount={activity.priceLocal}
                localCurrency={activity.localCurrency}
              />
            }
          />
          <FieldRow label="Currency" value={activity.currency} />
          {activity.localCurrency && activity.localCurrency !== activity.currency && (
            <FieldRow label="Local Currency" value={activity.localCurrency} />
          )}
          <FieldRow
            label="Price Type"
            value={
              <span className="capitalize">{activity.priceType}</span>
            }
          />
          {activity.discountPct !== null && (
            <FieldRow
              label="Discount"
              value={
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                >
                  <BadgePercent className="h-3 w-3 mr-1" />
                  {activity.discountPct}% off
                </Badge>
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Scraped Prices from Sources */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Scraped Prices
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleScrape}
            disabled={scrapePricing.isPending || !activity.sourceUrls?.length}
          >
            {scrapePricing.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            {scrapePricing.isPending ? "Scraping..." : "Scrape Pricing"}
          </Button>
        </CardHeader>
        <CardContent>
          {activity.scrapedPrices && activity.scrapedPrices.length > 0 ? (
            <div className="space-y-3">
              {activity.scrapedPrices.map((sp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant="outline" className="text-xs shrink-0">
                      {sp.source}
                    </Badge>
                    <a
                      href={sp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground truncate"
                    >
                      <ExternalLink className="h-3 w-3 inline mr-1" />
                      {sp.url.replace(/^https?:\/\//, "").slice(0, 40)}...
                    </a>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#C9A84C]">
                        AED {sp.aedPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sp.localCurrency} {sp.localPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <DollarSign className="h-8 w-8 mb-2" />
              <p className="text-sm">No scraped prices yet</p>
              <p className="text-xs mt-1">
                Click &quot;Scrape Pricing&quot; to fetch prices from source URLs
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Cancellation Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <FieldRow
            label="Free Cancellation"
            value={
              <Badge
                variant="secondary"
                className={
                  activity.freeCancellation
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                {activity.freeCancellation ? "Yes" : "No"}
              </Badge>
            }
          />
          <FieldRow
            label="Cancellation Hours"
            value={
              activity.cancellationHours !== null
                ? `${activity.cancellationHours} hours`
                : <EmptyField />
            }
          />
          <FieldRow
            label="Cancellation Policy"
            value={activity.cancellationPolicy || <EmptyField />}
          />
          <FieldRow
            label="Refund Policy Details"
            value={
              activity.refundPolicyDetails ? (
                <span className="max-w-sm text-right">
                  {activity.refundPolicyDetails}
                </span>
              ) : (
                <EmptyField />
              )
            }
          />
        </CardContent>
      </Card>

      {/* Participants & Booking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Participants & Booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <FieldRow
            label="Min Participants"
            value={
              activity.minParticipants !== null
                ? activity.minParticipants
                : <EmptyField />
            }
          />
          <FieldRow
            label="Max Participants"
            value={
              activity.maxParticipants !== null
                ? activity.maxParticipants
                : <EmptyField />
            }
          />
          <FieldRow
            label="Advance Booking Days"
            value={
              activity.advanceBookingDays !== null
                ? `${activity.advanceBookingDays} days`
                : <EmptyField />
            }
          />
          <FieldRow
            label="Instant Confirmation"
            value={
              <Badge
                variant="secondary"
                className={
                  activity.instantConfirmation
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                {activity.instantConfirmation ? "Yes" : "No"}
              </Badge>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
