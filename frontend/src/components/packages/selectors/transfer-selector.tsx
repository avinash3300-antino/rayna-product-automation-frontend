"use client";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/types/products";

interface TransferSelectorProps {
  transfers: Product[];
  selectedIds: string[];
  onToggle: (product: Product) => void;
  minCount: number;
  maxCount: number;
}

export function TransferSelector({
  transfers,
  selectedIds,
  onToggle,
  minCount,
  maxCount,
}: TransferSelectorProps) {
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
      </div>

      <div className="space-y-1 max-h-[200px] overflow-auto">
        {transfers.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No transfers found for this destination.
          </p>
        ) : (
          transfers.map((transfer) => {
            const isSelected = selectedIds.includes(transfer.id);
            const disabled = atMax && !isSelected;

            return (
              <label
                key={transfer.id}
                className={cn(
                  "flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors",
                  isSelected ? "border-gold bg-gold/5" : "hover:bg-muted/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  disabled={disabled}
                  onCheckedChange={() => !disabled && onToggle(transfer)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{transfer.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {transfer.attributes.duration && (
                      <span className="text-xs text-muted-foreground">
                        {transfer.attributes.duration}
                      </span>
                    )}
                    {transfer.attributes.pricing && (
                      <span className="text-xs text-muted-foreground">
                        {transfer.attributes.pricing.currency}{" "}
                        {transfer.attributes.pricing.amount}/{transfer.attributes.pricing.per}
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
