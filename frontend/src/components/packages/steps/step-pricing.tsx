"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { PackagePricing } from "@/types/packages";
import { PricingBreakdownTable } from "../pricing-breakdown-table";

interface StepPricingProps {
  pricing: PackagePricing;
  onMarginChange: (margin: number) => void;
  onOverrideToggle: (enabled: boolean) => void;
  onOverridePriceChange: (price: number | null) => void;
}

export function StepPricing({
  pricing,
  onMarginChange,
  onOverrideToggle,
  onOverridePriceChange,
}: StepPricingProps) {
  return (
    <div className="space-y-4">
      {/* Pricing Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Pricing Summary</CardTitle>
            <Badge
              variant="outline"
              className={
                pricing.pricingStatus === "complete"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              }
            >
              {pricing.pricingStatus === "complete"
                ? "Complete"
                : "Incomplete – Pricing Pending"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Base Cost */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Base Cost</p>
              <p className="text-lg font-semibold">
                {pricing.currency} {pricing.baseCost.toLocaleString()}
              </p>
            </div>

            {/* Margin */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Margin</p>
              <p className="text-lg font-semibold">{pricing.marginPercent}%</p>
            </div>

            {/* Floor Price */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Floor Price</p>
              <p className="text-lg font-semibold">
                {pricing.currency} {pricing.floorPrice.toLocaleString()}
              </p>
            </div>

            {/* Display Price */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Display Price</p>
              <p
                className={cn(
                  "text-lg font-bold",
                  pricing.isOverridden ? "text-gold-dark" : ""
                )}
              >
                {pricing.currency} {pricing.displayPrice.toLocaleString()}
                {pricing.isOverridden && (
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    (override)
                  </span>
                )}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Margin Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Margin Percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={pricing.marginPercent}
                  onChange={(e) =>
                    onMarginChange(
                      Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                    )
                  }
                  className="w-20 h-8 text-sm"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[pricing.marginPercent]}
              onValueChange={([val]) => onMarginChange(val)}
              min={0}
              max={50}
              step={1}
            />
          </div>

          <Separator className="my-4" />

          {/* Override Price */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="override-toggle">Override Display Price</Label>
              <Switch
                id="override-toggle"
                checked={pricing.isOverridden}
                onCheckedChange={onOverrideToggle}
              />
            </div>
            {pricing.isOverridden && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{pricing.currency}</span>
                <Input
                  type="number"
                  min={0}
                  value={pricing.overridePrice ?? ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onOverridePriceChange(isNaN(val) ? null : val);
                  }}
                  placeholder="Enter custom price"
                  className="w-40"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Component Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Component Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <PricingBreakdownTable
            breakdown={pricing.componentBreakdown}
            currency={pricing.currency}
            baseCost={pricing.baseCost}
          />
        </CardContent>
      </Card>
    </div>
  );
}
