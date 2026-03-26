"use client";

import { ImageIcon, Pencil, Eye, Tag, Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types/products";
import type { ProductCategory } from "@/types/destinations";

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onViewContent: (id: string) => void;
  onAssignTags: (id: string) => void;
  onMapSource: (id: string) => void;
}

const categoryStyles: Record<ProductCategory, string> = {
  hotels: "border-chart-2/30 text-chart-2 bg-chart-2/10",
  attractions: "border-chart-1/30 text-chart-1 bg-chart-1/10",
  transfers: "border-blue-500/30 text-blue-600 bg-blue-500/10",
  restaurants: "border-chart-4/30 text-chart-4 bg-chart-4/10",
};

const statusStyles: Record<ProductStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  staged: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  published: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  archived: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function ProductCard({
  product,
  onEdit,
  onViewContent,
  onAssignTags,
  onMapSource,
}: ProductCardProps) {
  const visibleTags = product.tags.slice(0, 3);
  const extraTagCount = product.tags.length - 3;

  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Hero Image */}
      <div className="relative h-40 bg-muted flex items-center justify-center overflow-hidden">
        {product.heroImage ? (
          <img
            src={product.heroImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
        )}
        <Badge
          variant="secondary"
          className={cn(
            "absolute top-2 left-2 text-[10px] capitalize",
            categoryStyles[product.category]
          )}
        >
          {product.category}
        </Badge>
      </div>

      <CardContent className="flex-1 flex flex-col gap-3 p-4">
        {/* Name & destination */}
        <div>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {product.destination}
          </p>
        </div>

        {/* Status & completeness */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className={cn("text-[10px] capitalize", statusStyles[product.status])}
          >
            {product.status}
          </Badge>
          <div className="flex items-center gap-2 flex-1 max-w-[120px]">
            <Progress
              value={product.completeness}
              className="h-1.5 flex-1"
              style={
                {
                  "--progress-color": product.completeness >= 80
                    ? "rgb(34 197 94)"
                    : product.completeness >= 50
                      ? "rgb(245 158 11)"
                      : "rgb(239 68 68)",
                } as React.CSSProperties
              }
            />
            <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
              {product.completeness}%
            </span>
          </div>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {visibleTags.map((tag, i) => (
              <Badge
                key={`${tag.dimension}-${tag.value}-${i}`}
                variant="outline"
                className="text-[10px] h-5 font-normal"
              >
                {tag.value}
              </Badge>
            ))}
            {extraTagCount > 0 && (
              <Badge
                variant="outline"
                className="text-[10px] h-5 font-normal text-muted-foreground"
              >
                +{extraTagCount} more
              </Badge>
            )}
          </div>
        )}

        {/* Quick actions */}
        <div className="flex items-center gap-1 mt-auto pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1 flex-1"
            onClick={() => onEdit(product.id)}
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1 flex-1"
            onClick={() => onViewContent(product.id)}
          >
            <Eye className="h-3 w-3" />
            Content
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => onAssignTags(product.id)}
          >
            <Tag className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => onMapSource(product.id)}
          >
            <Link2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
