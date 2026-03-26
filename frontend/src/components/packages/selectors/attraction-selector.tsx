"use client";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/types/products";

interface AttractionSelectorProps {
  attractions: Product[];
  selectedIds: string[];
  onToggle: (product: Product) => void;
  minCount: number;
  maxCount: number;
}

export function AttractionSelector({
  attractions,
  selectedIds,
  onToggle,
  minCount,
  maxCount,
}: AttractionSelectorProps) {
  const count = selectedIds.length;
  const atMax = count >= maxCount;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-xs font-medium",
            count < minCount ? "text-amber-600" : "text-emerald-600"
          )}
        >
          {count}/{minCount}–{maxCount} selected
        </span>
        {count < minCount && (
          <span className="text-xs text-amber-600">
            (need {minCount - count} more)
          </span>
        )}
      </div>

      <div className="space-y-1 max-h-[240px] overflow-auto">
        {attractions.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No attractions found for this destination.
          </p>
        ) : (
          attractions.map((attraction) => {
            const isSelected = selectedIds.includes(attraction.id);
            const disabled = atMax && !isSelected;

            return (
              <label
                key={attraction.id}
                className={cn(
                  "flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors",
                  isSelected ? "border-gold bg-gold/5" : "hover:bg-muted/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  disabled={disabled}
                  onCheckedChange={() => !disabled && onToggle(attraction)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attraction.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {attraction.attributes.duration && (
                      <span className="text-xs text-muted-foreground">
                        {attraction.attributes.duration}
                      </span>
                    )}
                    {attraction.attributes.pricing && (
                      <span className="text-xs text-muted-foreground">
                        {attraction.attributes.pricing.currency}{" "}
                        {attraction.attributes.pricing.amount}/{attraction.attributes.pricing.per}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
