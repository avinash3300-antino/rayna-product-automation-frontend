"use client";

import { ImageIcon, MapPin, Clock, DollarSign, Star, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types/products";

interface ProductOverviewTabProps {
  product: Product;
  editing: boolean;
}

const statusStyles: Record<ProductStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  staged: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  published: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  archived: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function ProductOverviewTab({ product, editing }: ProductOverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Hero Image */}
      <Card className="lg:col-span-1">
        <CardContent className="p-4">
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            {product.heroImage ? (
              <img
                src={product.heroImage}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="h-10 w-10" />
                <span className="text-xs">No image</span>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                variant="secondary"
                className={cn("text-xs capitalize", statusStyles[product.status])}
              >
                {product.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Category</span>
              <Badge variant="outline" className="text-xs capitalize">
                {product.category}
              </Badge>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Completeness</span>
                <span className="text-xs font-mono">{product.completeness}%</span>
              </div>
              <Progress value={product.completeness} className="h-2" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Publish Flag</span>
              <span className={cn("text-sm font-medium", product.publishFlag ? "text-emerald-600" : "text-muted-foreground")}>
                {product.publishFlag ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input defaultValue={product.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <Input defaultValue={product.destination} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input defaultValue={product.category} className="capitalize" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <textarea
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={product.content.shortDesc}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-sm">
                  {product.content.shortDesc || (
                    <span className="text-muted-foreground italic">No description</span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InfoRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={`${product.attributes.location.city}, ${product.attributes.location.country}`}
                />
                <InfoRow
                  icon={<Globe className="h-4 w-4" />}
                  label="Destination"
                  value={product.destination}
                />
                {product.attributes.pricing && (
                  <InfoRow
                    icon={<DollarSign className="h-4 w-4" />}
                    label="Price"
                    value={`${product.attributes.pricing.currency} ${product.attributes.pricing.amount} / ${product.attributes.pricing.per}`}
                  />
                )}
                {product.attributes.duration && (
                  <InfoRow
                    icon={<Clock className="h-4 w-4" />}
                    label="Duration"
                    value={product.attributes.duration}
                  />
                )}
                {product.attributes.starRating && (
                  <InfoRow
                    icon={<Star className="h-4 w-4" />}
                    label="Star Rating"
                    value={`${product.attributes.starRating} Stars`}
                  />
                )}
                {product.bookingSource && (
                  <InfoRow
                    icon={<Globe className="h-4 w-4" />}
                    label="Booking Source"
                    value={product.bookingSource.name}
                  />
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
