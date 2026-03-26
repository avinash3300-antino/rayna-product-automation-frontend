"use client";

import { RotateCcw, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/destinations";
import type {
  ProductFilters as FilterState,
  ProductStatus,
  TagDimension,
} from "@/types/products";

interface ProductFiltersProps {
  filters: FilterState;
  destinations: string[];
  availableTags: Record<TagDimension, string[]>;
  onFilterChange: (filters: FilterState) => void;
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "hotels", label: "Hotels" },
  { value: "attractions", label: "Attractions" },
  { value: "transfers", label: "Transfers" },
  { value: "restaurants", label: "Restaurants" },
];

const STATUSES: { value: ProductStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "staged", label: "Staged" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const DIMENSION_LABELS: Record<TagDimension, string> = {
  budget_tier: "Budget Tier",
  travel_theme: "Travel Theme",
  audience: "Audience",
  season: "Season",
  accessibility: "Accessibility",
};

const INITIAL_FILTERS: FilterState = {
  search: "",
  destinations: [],
  categories: [],
  statuses: [],
  completenessRange: [0, 100],
  tagFilters: {
    budget_tier: [],
    travel_theme: [],
    audience: [],
    season: [],
    accessibility: [],
  },
  hasBookingSource: null,
  publishFlag: null,
};

export function ProductFilters({
  filters,
  destinations,
  availableTags,
  onFilterChange,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    destinations: true,
    categories: true,
    statuses: true,
    completeness: true,
    tags: false,
    toggles: true,
  });

  function toggleSection(key: string) {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleDestination(dest: string) {
    const next = filters.destinations.includes(dest)
      ? filters.destinations.filter((d) => d !== dest)
      : [...filters.destinations, dest];
    onFilterChange({ ...filters, destinations: next });
  }

  function toggleCategory(cat: ProductCategory) {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: next });
  }

  function toggleStatus(status: ProductStatus) {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFilterChange({ ...filters, statuses: next });
  }

  function handleCompletenessChange(value: number[]) {
    onFilterChange({
      ...filters,
      completenessRange: [value[0], value[1]],
    });
  }

  function toggleTagValue(dimension: TagDimension, value: string) {
    const current = filters.tagFilters[dimension];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({
      ...filters,
      tagFilters: { ...filters.tagFilters, [dimension]: next },
    });
  }

  function handleBookingSourceToggle() {
    const next =
      filters.hasBookingSource === true
        ? null
        : filters.hasBookingSource === null
          ? true
          : null;
    onFilterChange({ ...filters, hasBookingSource: next });
  }

  function handlePublishFlagToggle() {
    const next =
      filters.publishFlag === true
        ? null
        : filters.publishFlag === null
          ? true
          : null;
    onFilterChange({ ...filters, publishFlag: next });
  }

  function handleReset() {
    onFilterChange(INITIAL_FILTERS);
  }

  const activeFilterCount =
    filters.destinations.length +
    filters.categories.length +
    filters.statuses.length +
    (filters.completenessRange[0] > 0 || filters.completenessRange[1] < 100 ? 1 : 0) +
    Object.values(filters.tagFilters).reduce((acc, arr) => acc + arr.length, 0) +
    (filters.hasBookingSource !== null ? 1 : 0) +
    (filters.publishFlag !== null ? 1 : 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-[10px] h-5">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleReset}>
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Destinations */}
          <FilterSection
            label="Destination"
            expanded={expandedSections.destinations}
            onToggle={() => toggleSection("destinations")}
          >
            <div className="space-y-2">
              {destinations.map((dest) => (
                <label
                  key={dest}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.destinations.includes(dest)}
                    onCheckedChange={() => toggleDestination(dest)}
                  />
                  <span className="text-sm">{dest}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <Separator />

          {/* Categories */}
          <FilterSection
            label="Category"
            expanded={expandedSections.categories}
            onToggle={() => toggleSection("categories")}
          >
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.categories.includes(cat.value)}
                    onCheckedChange={() => toggleCategory(cat.value)}
                  />
                  <span className="text-sm">{cat.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <Separator />

          {/* Status */}
          <FilterSection
            label="Status"
            expanded={expandedSections.statuses}
            onToggle={() => toggleSection("statuses")}
          >
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <label
                  key={s.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.statuses.includes(s.value)}
                    onCheckedChange={() => toggleStatus(s.value)}
                  />
                  <span className="text-sm">{s.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <Separator />

          {/* Completeness */}
          <FilterSection
            label="Completeness"
            expanded={expandedSections.completeness}
            onToggle={() => toggleSection("completeness")}
          >
            <div className="space-y-3">
              <Slider
                value={filters.completenessRange}
                onValueChange={handleCompletenessChange}
                min={0}
                max={100}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{filters.completenessRange[0]}%</span>
                <span>{filters.completenessRange[1]}%</span>
              </div>
            </div>
          </FilterSection>

          <Separator />

          {/* Tag Dimensions */}
          <FilterSection
            label="Tags"
            expanded={expandedSections.tags}
            onToggle={() => toggleSection("tags")}
          >
            <div className="space-y-3">
              {(Object.keys(DIMENSION_LABELS) as TagDimension[]).map((dim) => {
                const values = availableTags[dim] ?? [];
                if (values.length === 0) return null;
                return (
                  <div key={dim}>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">
                      {DIMENSION_LABELS[dim]}
                    </Label>
                    <div className="flex flex-wrap gap-1">
                      {values.map((val) => {
                        const active = filters.tagFilters[dim].includes(val);
                        return (
                          <Badge
                            key={val}
                            variant={active ? "default" : "outline"}
                            className={cn(
                              "text-[10px] h-5 cursor-pointer transition-colors",
                              active && "bg-primary text-primary-foreground"
                            )}
                            onClick={() => toggleTagValue(dim, val)}
                          >
                            {val}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </FilterSection>

          <Separator />

          {/* Toggles */}
          <FilterSection
            label="Options"
            expanded={expandedSections.toggles}
            onToggle={() => toggleSection("toggles")}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Booking Source Assigned</Label>
                <Switch
                  checked={filters.hasBookingSource === true}
                  onCheckedChange={handleBookingSourceToggle}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Publish Flag</Label>
                <Switch
                  checked={filters.publishFlag === true}
                  onCheckedChange={handlePublishFlagToggle}
                />
              </div>
            </div>
          </FilterSection>
        </div>
      </ScrollArea>
    </div>
  );
}

function FilterSection({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 w-full text-left mb-2"
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </button>
      {expanded && children}
    </div>
  );
}
