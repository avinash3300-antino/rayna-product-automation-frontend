"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ActivityStatus } from "@/types/activities";
import { useActivityCities } from "@/hooks/api/use-activities";

export interface ActivityFiltersState {
  category: string;
  status: string;
  city: string;
  freeCancellation: boolean;
  instantConfirmation: boolean;
}

interface ActivityFiltersProps {
  filters: ActivityFiltersState;
  onFiltersChange: (filters: ActivityFiltersState) => void;
}

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "luxury", label: "Luxury" },
  { value: "nature", label: "Nature" },
  { value: "food_drink", label: "Food & Drink" },
  { value: "nightlife", label: "Nightlife" },
];

const STATUSES: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "enriched", label: "Enriched" },
  { value: "review_ready", label: "Review Ready" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
];

const INITIAL_FILTERS: ActivityFiltersState = {
  category: "all",
  status: "all",
  city: "all",
  freeCancellation: false,
  instantConfirmation: false,
};

export function ActivityFilters({
  filters,
  onFiltersChange,
}: ActivityFiltersProps) {
  const { data: cities = [] } = useActivityCities();

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.city !== "all" ||
    filters.freeCancellation ||
    filters.instantConfirmation;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Category Select */}
      <Select
        value={filters.category}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, category: value })
        }
      >
        <SelectTrigger className="w-[160px] h-9">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Select */}
      <Select
        value={filters.status}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, status: value })
        }
      >
        <SelectTrigger className="w-[160px] h-9">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* City Select */}
      <Select
        value={filters.city}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, city: value })
        }
      >
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Free Cancellation Toggle */}
      <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
        <Checkbox
          checked={filters.freeCancellation}
          onCheckedChange={(checked) =>
            onFiltersChange({
              ...filters,
              freeCancellation: checked === true,
            })
          }
        />
        Free Cancellation
      </label>

      {/* Instant Confirmation Toggle */}
      <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
        <Checkbox
          checked={filters.instantConfirmation}
          onCheckedChange={(checked) =>
            onFiltersChange({
              ...filters,
              instantConfirmation: checked === true,
            })
          }
        />
        Instant Confirmation
      </label>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1 text-muted-foreground"
          onClick={() => onFiltersChange(INITIAL_FILTERS)}
        >
          <X className="h-3.5 w-3.5" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}

export { INITIAL_FILTERS };
