"use client";

import { Hotel, MapPin, Car, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PackageComponent, PackagePricing, PackageGeneratedContent } from "@/types/packages";
import { PACKAGE_TYPE_DEFINITIONS } from "@/lib/mock-packages";
import type { PackageTypeId } from "@/types/packages";

interface PackageSummaryCardProps {
  packageName: string;
  packageTypeId: PackageTypeId | null;
  destination: string;
  nights: number;
  components: PackageComponent[];
  pricing: PackagePricing;
  content: PackageGeneratedContent | null;
}

const categoryIcons: Record<string, React.ElementType> = {
  hotels: Hotel,
  attractions: MapPin,
  transfers: Car,
};

export function PackageSummaryCard({
  packageName,
  packageTypeId,
  destination,
  nights,
  components,
  pricing,
  content,
}: PackageSummaryCardProps) {
  const typeDef = PACKAGE_TYPE_DEFINITIONS.find((t) => t.id === packageTypeId);

  const groupedComponents: Record<string, PackageComponent[]> = {};
  for (const comp of components) {
    if (!groupedComponents[comp.category]) {
      groupedComponents[comp.category] = [];
    }
    groupedComponents[comp.category].push(comp);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{packageName || "Untitled Package"}</CardTitle>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {typeDef && (
            <Badge variant="outline" className="bg-gold/10 text-gold-dark border-gold/30">
              {typeDef.name}
            </Badge>
          )}
          <Badge variant="secondary">{destination || "No destination"}</Badge>
          <Badge variant="secondary">
            <Calendar className="h-3 w-3 mr-1" />
            {nights}N / {nights + 1}D
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Components */}
        <div>
          <h4 className="text-sm font-semibold mb-2">
            Components ({components.length})
          </h4>
          {Object.entries(groupedComponents).map(([category, comps]) => {
            const Icon = categoryIcons[category] || MapPin;
            return (
              <div key={category} className="mb-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium capitalize">
                    {category} ({comps.length})
                  </span>
                </div>
                <div className="ml-5 space-y-0.5">
                  {comps.map((comp) => (
                    <div
                      key={comp.productId}
                      className="flex items-center justify-between text-xs"
                    >
                      <span>{comp.product.name}</span>
                      <span className="text-muted-foreground">
                        {comp.netRate > 0
                          ? `${comp.currency} ${comp.netRate.toLocaleString()}`
                          : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Pricing */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5" />
            Pricing
          </h4>
          <div className="grid grid-cols-2 gap-y-1.5 text-xs">
            <span className="text-muted-foreground">Base Cost</span>
            <span className="text-right font-medium">
              {pricing.currency} {pricing.baseCost.toLocaleString()}
            </span>
            <span className="text-muted-foreground">Margin</span>
            <span className="text-right font-medium">{pricing.marginPercent}%</span>
            <span className="text-muted-foreground">Floor Price</span>
            <span className="text-right font-medium">
              {pricing.currency} {pricing.floorPrice.toLocaleString()}
            </span>
            <span className="text-muted-foreground font-semibold">Display Price</span>
            <span className="text-right font-bold">
              {pricing.currency} {pricing.displayPrice.toLocaleString()}
              {pricing.isOverridden && " (override)"}
            </span>
          </div>
          <div className="mt-2">
            <Badge
              variant="outline"
              className={
                pricing.pricingStatus === "complete"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              }
            >
              {pricing.pricingStatus === "complete"
                ? "Pricing Complete"
                : "Pricing Incomplete"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        {content?.isGenerated && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-semibold mb-2">Content</h4>
              <p className="text-xs text-muted-foreground">
                {content.description || "No description generated."}
              </p>
              {content.itinerary.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {content.itinerary.length}-day itinerary generated
                </p>
              )}
              {content.suggestedTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {content.suggestedTags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">
                      {tag.value}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
