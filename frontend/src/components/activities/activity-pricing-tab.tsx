"use client";

import {
  DollarSign,
  Users,
  Calendar,
  ShieldCheck,
  BadgePercent,
  Clock,
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
            value={formatPrice(activity.priceAdult, activity.currency)}
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
            value={formatPrice(activity.priceFrom, activity.currency)}
          />
          <FieldRow label="Currency" value={activity.currency} />
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
