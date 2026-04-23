"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  LayoutGrid,
  Table as TableIcon,
  Search,
  X,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CruiseFilters, INITIAL_FILTERS } from "./cruise-filters";
import { CruiseCard } from "./cruise-card";
import { useCruises } from "@/hooks/api/use-cruises";
import type { CruiseFiltersState } from "./cruise-filters";
import type { CruiseViewMode } from "@/types/cruises";

const PAGE_SIZE = 12;

export function CruiseBrowser() {
  const [viewMode, setViewMode] = useState<CruiseViewMode>("grid");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<CruiseFiltersState>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);

  // Debounce search input (300ms)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [search]);

  // Build query params for useCruises
  const queryParams = {
    search: debouncedSearch || undefined,
    cruise_type: filters.cruiseType !== "all" ? filters.cruiseType : undefined,
    vessel_type: filters.vesselType !== "all" ? filters.vesselType : undefined,
    city: filters.city !== "all" ? filters.city : undefined,
    meal_included: filters.mealIncluded ? true : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    page,
    perPage: PAGE_SIZE,
  };

  const { data, isLoading, isError, error } = useCruises(queryParams);

  const cruises = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleFiltersChange = useCallback(
    (newFilters: CruiseFiltersState) => {
      setFilters(newFilters);
      setPage(1);
    },
    []
  );

  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cruise Browser</h2>
        <p className="text-muted-foreground">
          Browse, filter, and manage your cruises catalog
        </p>
      </div>

      {/* Toolbar: Search + View Toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cruises..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Result count */}
        {!isLoading && (
          <span className="text-sm text-muted-foreground">
            {total} cruise{total !== 1 ? "s" : ""}
          </span>
        )}

        {/* View toggle */}
        <div className="flex items-center border rounded-md ml-auto">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-r-none"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-l-none"
            onClick={() => setViewMode("table")}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Inline Filters */}
      <CruiseFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Content Area */}
      <div className="min-h-[400px]">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Loading cruises...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-sm text-red-500">Failed to load cruises</p>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred"}
            </p>
          </div>
        )}

        {/* Data */}
        {!isLoading && !isError && (
          <>
            {cruises.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground">
                No cruises match the current filters
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cruises.map((cruise) => (
                  <CruiseCard key={cruise.id} cruise={cruise} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && total > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Showing {startIdx + 1}&ndash;{endIdx} of {total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
