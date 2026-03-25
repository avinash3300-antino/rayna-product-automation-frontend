"use client";

import { RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClassificationFilters as FilterState } from "@/types/classification";

interface ClassificationFiltersProps {
  filters: FilterState;
  destinations: string[];
  onFilterChange: (filters: FilterState) => void;
}

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "hotels", label: "Hotels" },
  { value: "attractions", label: "Attractions" },
  { value: "transfers", label: "Transfers" },
  { value: "restaurants", label: "Restaurants" },
];

const INITIAL_FILTERS: FilterState = {
  destination: "all",
  category: "all",
  dateFrom: "",
  dateTo: "",
  confidenceMin: 0,
  confidenceMax: 1,
};

export function ClassificationFilters({
  filters,
  destinations,
  onFilterChange,
}: ClassificationFiltersProps) {
  function handleChange(field: keyof FilterState, value: string | number) {
    onFilterChange({ ...filters, [field]: value });
  }

  function handleReset() {
    onFilterChange(INITIAL_FILTERS);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
          {/* Destination */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Destination
            </Label>
            <Select
              value={filters.destination}
              onValueChange={(v) => handleChange("destination", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Destinations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                {destinations.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(v) => handleChange("category", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">From Date</Label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange("dateFrom", e.target.value)}
            />
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">To Date</Label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange("dateTo", e.target.value)}
            />
          </div>

          {/* Confidence Min */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Conf. Min</Label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={filters.confidenceMin}
              onChange={(e) =>
                handleChange(
                  "confidenceMin",
                  parseFloat(e.target.value) || 0
                )
              }
            />
          </div>

          {/* Confidence Max */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Conf. Max</Label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={filters.confidenceMax}
              onChange={(e) =>
                handleChange(
                  "confidenceMax",
                  parseFloat(e.target.value) || 1
                )
              }
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
