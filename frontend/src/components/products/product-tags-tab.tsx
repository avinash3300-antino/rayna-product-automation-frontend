"use client";

import { Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TAG_DIMENSION_LABELS } from "@/types/products";
import type { Product, TagDimension } from "@/types/products";

interface ProductTagsTabProps {
  product: Product;
  editing: boolean;
}

const dimensionOrder: TagDimension[] = [
  "budget_tier",
  "travel_theme",
  "audience",
  "season",
  "accessibility",
];

export function ProductTagsTab({ product, editing }: ProductTagsTabProps) {
  // Group tags by dimension
  const grouped = dimensionOrder.map((dim) => ({
    dimension: dim,
    label: TAG_DIMENSION_LABELS[dim],
    tags: product.tags.filter((t) => t.dimension === dim),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Tags ({product.tags.length} total)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {grouped.map((group, idx) => (
          <div key={group.dimension}>
            {idx > 0 && <Separator className="mb-4" />}
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">{group.label}</h4>
              {editing && (
                <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                  <Plus className="h-3 w-3" />
                  Add
                </Button>
              )}
            </div>
            {group.tags.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No tags assigned
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag, i) => (
                  <Badge
                    key={`${tag.dimension}-${tag.value}-${i}`}
                    variant="secondary"
                    className="text-xs gap-1"
                  >
                    {tag.value}
                    {editing && (
                      <button className="ml-0.5 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
