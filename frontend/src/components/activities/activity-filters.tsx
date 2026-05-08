"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActivityCities, useActivityCategories } from "@/hooks/api/use-activities";

export interface ActivityFiltersState {
  category: string;
  city: string;
  freeCancellation: boolean;
  instantConfirmation: boolean;
  activityKind: "all" | "individual" | "package";
  inclusions: "all" | "pure" | "transport" | "meals";
}

interface ActivityFiltersProps {
  filters: ActivityFiltersState;
  onFiltersChange: (filters: ActivityFiltersState) => void;
}

const INITIAL_FILTERS: ActivityFiltersState = {
  category: "all",
  city: "all",
  freeCancellation: false,
  instantConfirmation: false,
  activityKind: "all",
  inclusions: "all",
};

export function ActivityFilters({
  filters,
  onFiltersChange,
}: ActivityFiltersProps) {
  const { data: cities = [] } = useActivityCities();
  const { data: categories = [] } = useActivityCategories();

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.city !== "all" ||
    filters.activityKind !== "all" ||
    filters.inclusions !== "all";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Activity Kind Toggle */}
      <div className="flex items-center border rounded-md">
        {(["all", "individual", "package"] as const).map((kind) => {
          const isActive = filters.activityKind === kind;
          const label = kind === "all" ? "All" : kind === "individual" ? "Individual" : "Packages";
          return (
            <Button
              key={kind}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={`h-8 text-xs rounded-none first:rounded-l-md last:rounded-r-md ${
                isActive ? "font-semibold" : ""
              }`}
              onClick={() =>
                onFiltersChange({ ...filters, activityKind: kind })
              }
            >
              {label}
            </Button>
          );
        })}
      </div>

      {/* Inclusions Toggle */}
      <div className="flex items-center border rounded-md">
        {(["all", "pure", "transport", "meals"] as const).map((inc) => {
          const isActive = filters.inclusions === inc;
          const label =
            inc === "all"
              ? "All"
              : inc === "pure"
                ? "Pure"
                : inc === "transport"
                  ? "W/ Transport"
                  : "W/ Meals";
          return (
            <Button
              key={inc}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={`h-8 text-xs rounded-none first:rounded-l-md last:rounded-r-md ${
                isActive ? "font-semibold" : ""
              }`}
              onClick={() =>
                onFiltersChange({ ...filters, inclusions: inc })
              }
            >
              {label}
            </Button>
          );
        })}
      </div>

      {/* Category Select */}
      <Select
        value={filters.category}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, category: value })
        }
      >
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
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
