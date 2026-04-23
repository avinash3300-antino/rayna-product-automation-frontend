"use client";

import {
  DollarSign,
  ShieldCheck,
  BadgePercent,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Cruise } from "@/types/cruises";

interface CruisePricingTabProps {
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

function formatPrice(amount: number | null, currency: string): string {
  if (amount === null || amount === undefined) return "--";
  return `${currency} ${amount.toFixed(2)}`;
}

export function CruisePricingTab({ cruise }: CruisePricingTabProps) {
  return (
    <div className="space-y-6">
      {/* Base Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Base Price Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 divide-y divide-border">
          <FieldRow
            label="Price (Adult)"
            value={formatPrice(cruise.priceAdult, cruise.currency)}
          />
          <FieldRow
            label="Price (Child)"
            value={formatPrice(cruise.priceChild, cruise.currency)}
          />
          <FieldRow
            label="Price (Infant)"
            value={formatPrice(cruise.priceInfant, cruise.currency)}
          />
          <FieldRow
            label="Price (Group)"
            value={formatPrice(cruise.priceGroup, cruise.currency)}
          />
          <FieldRow
            label="Original Price"
            value={formatPrice(cruise.priceOriginal, cruise.currency)}
          />
          <FieldRow
            label="Price From"
            value={formatPrice(cruise.priceFrom, cruise.currency)}
          />
          <FieldRow label="Currency" value={cruise.currency} />
          <FieldRow
            label="Price Type"
            value={
              <span className="capitalize">{cruise.priceType}</span>
            }
          />
          {cruise.discountPct !== null && (
            <FieldRow
              label="Discount"
              value={
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                >
                  <BadgePercent className="h-3 w-3 mr-1" />
                  {cruise.discountPct}% off
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
                  cruise.freeCancellation
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                {cruise.freeCancellation ? "Yes" : "No"}
              </Badge>
            }
          />
          <FieldRow
            label="Cancellation Hours"
            value={
              cruise.cancellationHours !== null
                ? `${cruise.cancellationHours} hours`
                : <EmptyField />
            }
          />
          <FieldRow
            label="Cancellation Policy"
            value={cruise.cancellationPolicy || <EmptyField />}
          />
        </CardContent>
      </Card>

      {/* Cabin-Tier Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Cabin-Tier Pricing ({cruise.pricingTiers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cruise.pricingTiers.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cabin Type</TableHead>
                    <TableHead className="text-right">Adult</TableHead>
                    <TableHead className="text-right">Child</TableHead>
                    <TableHead className="text-right">Infant</TableHead>
                    <TableHead className="text-right">Currency</TableHead>
                    <TableHead>Includes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cruise.pricingTiers.map((tier) => (
                    <TableRow key={tier.id}>
                      <TableCell className="font-medium capitalize">
                        {tier.cabinType}
                      </TableCell>
                      <TableCell className="text-right">
                        {tier.priceAdult !== null
                          ? tier.priceAdult.toFixed(2)
                          : "--"}
                      </TableCell>
                      <TableCell className="text-right">
                        {tier.priceChild !== null
                          ? tier.priceChild.toFixed(2)
                          : "--"}
                      </TableCell>
                      <TableCell className="text-right">
                        {tier.priceInfant !== null
                          ? tier.priceInfant.toFixed(2)
                          : "--"}
                      </TableCell>
                      <TableCell className="text-right">
                        {tier.currency}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {tier.includesDescription ? (
                          <span className="text-xs text-muted-foreground truncate block">
                            {tier.includesDescription}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            --
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Layers className="h-10 w-10 mb-2" />
              <p className="text-sm">No cabin-tier pricing defined</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
