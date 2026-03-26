"use client";

import { useState } from "react";
import { Search, Star, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types/products";

interface HotelSelectorProps {
  hotels: Product[];
  selectedIds: string[];
  onToggle: (product: Product) => void;
  maxCount: number;
}

export function HotelSelector({
  hotels,
  selectedIds,
  onToggle,
  maxCount,
}: HotelSelectorProps) {
  const [search, setSearch] = useState("");

  const filtered = hotels.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search hotels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <div className="space-y-1.5 max-h-[240px] overflow-auto">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No hotels found for this destination.
          </p>
        ) : (
          filtered.map((hotel) => {
            const isSelected = selectedIds.includes(hotel.id);
            const atMax = selectedIds.length >= maxCount && !isSelected;

            return (
              <button
                key={hotel.id}
                disabled={atMax}
                onClick={() => onToggle(hotel)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-md border p-3 text-left transition-colors",
                  isSelected
                    ? "border-gold bg-gold/5"
                    : "hover:bg-muted/50",
                  atMax && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{hotel.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {hotel.attributes.starRating && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-500">
                        <Star className="h-3 w-3 fill-amber-500" />
                        {hotel.attributes.starRating}
                      </span>
                    )}
                    {hotel.attributes.pricing && (
                      <span className="text-xs text-muted-foreground">
                        {hotel.attributes.pricing.currency}{" "}
                        {hotel.attributes.pricing.amount.toLocaleString()}/{hotel.attributes.pricing.per}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {hotel.bookingSource ? (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {hotel.bookingSource.name}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      No Source
                    </Badge>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
