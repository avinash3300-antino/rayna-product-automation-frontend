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
import type { CruiseStatus } from "@/types/cruises";
import { useCruiseCities } from "@/hooks/api/use-cruises";

export interface CruiseFiltersState {
  cruiseType: string;
  vesselType: string;
  city: string;
  mealIncluded: boolean;
  status: string;
}

interface CruiseFiltersProps {
  filters: CruiseFiltersState;
  onFiltersChange: (filters: CruiseFiltersState) => void;
}

const CRUISE_TYPES = [
  { value: "all", label: "All Cruise Types" },
  { value: "Dinner Cruise", label: "Dinner Cruise" },
  { value: "Sightseeing Cruise", label: "Sightseeing Cruise" },
  { value: "Overnight Cruise", label: "Overnight Cruise" },
  { value: "Multi-Day Cruise", label: "Multi-Day Cruise" },
  { value: "River Cruise", label: "River Cruise" },
  { value: "Luxury Cruise", label: "Luxury Cruise" },
];

const VESSEL_TYPES = [
  { value: "all", label: "All Vessel Types" },
  { value: "Yacht", label: "Yacht" },
  { value: "Catamaran", label: "Catamaran" },
  { value: "Dhow", label: "Dhow" },
  { value: "Sailboat", label: "Sailboat" },
  { value: "Speedboat", label: "Speedboat" },
  { value: "Ferry", label: "Ferry" },
  { value: "Houseboat", label: "Houseboat" },
  { value: "Riverboat", label: "Riverboat" },
];

const STATUSES: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "enriched", label: "Enriched" },
  { value: "review_ready", label: "Review Ready" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
];

const INITIAL_FILTERS: CruiseFiltersState = {
  cruiseType: "all",
  vesselType: "all",
  city: "all",
  mealIncluded: false,
  status: "all",
};

export function CruiseFilters({
  filters,
  onFiltersChange,
}: CruiseFiltersProps) {
  const { data: cities = [] } = useCruiseCities();

  const hasActiveFilters =
    filters.cruiseType !== "all" ||
    filters.vesselType !== "all" ||
    filters.city !== "all" ||
    filters.mealIncluded ||
    filters.status !== "all";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Cruise Type Select */}
      <Select
        value={filters.cruiseType}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, cruiseType: value })
        }
      >
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="Cruise Type" />
        </SelectTrigger>
        <SelectContent>
          {CRUISE_TYPES.map((ct) => (
            <SelectItem key={ct.value} value={ct.value}>
              {ct.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Vessel Type Select */}
      <Select
        value={filters.vesselType}
        onValueChange={(value) =>
          onFiltersChange({ ...filters, vesselType: value })
        }
      >
        <SelectTrigger className="w-[170px] h-9">
          <SelectValue placeholder="Vessel Type" />
        </SelectTrigger>
        <SelectContent>
          {VESSEL_TYPES.map((vt) => (
            <SelectItem key={vt.value} value={vt.value}>
              {vt.label}
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

      {/* Meal Included Toggle */}
      <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
        <Checkbox
          checked={filters.mealIncluded}
          onCheckedChange={(checked) =>
            onFiltersChange({
              ...filters,
              mealIncluded: checked === true,
            })
          }
        />
        Meal Included
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
