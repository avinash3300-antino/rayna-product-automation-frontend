"use client";

import {
  DollarSign,
  ShieldCheck,
  BadgePercent,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

function convertToLocal(
  aedAmount: number | null,
  activity: Activity
): number | null {
  if (
    aedAmount == null ||
    !activity.priceAdult ||
    !activity.priceLocal ||
    !activity.localCurrency
  )
    return null;
  const rate = activity.priceLocal / activity.priceAdult;
  return Math.round(aedAmount * rate * 100) / 100;
}

export function ActivityPricingTab({ activity }: ActivityPricingTabProps) {
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
            value={
              <DualPrice
                amount={activity.priceChild}
                currency={activity.currency}
                localAmount={convertToLocal(activity.priceChild, activity)}
                localCurrency={activity.localCurrency}
              />
            }
          />
          <FieldRow
            label="Price (Infant)"
            value={
              <DualPrice
                amount={activity.priceInfant}
                currency={activity.currency}
                localAmount={convertToLocal(activity.priceInfant, activity)}
                localCurrency={activity.localCurrency}
              />
            }
          />
          <FieldRow
            label="Price (Group)"
            value={
              <DualPrice
                amount={activity.priceGroup}
                currency={activity.currency}
                localAmount={convertToLocal(activity.priceGroup, activity)}
                localCurrency={activity.localCurrency}
              />
            }
          />
          <FieldRow
            label="Original Price"
            value={
              <DualPrice
                amount={activity.priceOriginal}
                currency={activity.currency}
                localAmount={convertToLocal(activity.priceOriginal, activity)}
                localCurrency={activity.localCurrency}
              />
            }
          />
          <FieldRow
            label="Price From"
            value={
              <DualPrice
                amount={activity.priceFrom}
                currency={activity.currency}
                localAmount={convertToLocal(activity.priceFrom, activity)}
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

    </div>
  );
}
