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
import { ActivityFilters, INITIAL_FILTERS } from "./activity-filters";
import { ActivityGrid } from "./activity-grid";
import { ActivityTable } from "./activity-table";
import { useActivities } from "@/hooks/api/use-activities";
import type { ActivityFiltersState } from "./activity-filters";
import type { ActivityViewMode } from "@/types/activities";

const PAGE_SIZE = 12;

export function ActivityBrowser() {
  const [viewMode, setViewMode] = useState<ActivityViewMode>("grid");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<ActivityFiltersState>(INITIAL_FILTERS);
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

  // Build query params for useActivities
  const queryParams = {
    search: debouncedSearch || undefined,
    category: filters.category !== "all" ? filters.category : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    city: filters.city || undefined,
    free_cancellation: filters.freeCancellation ? true : undefined,
    instant_confirmation: filters.instantConfirmation ? true : undefined,
    page,
    perPage: PAGE_SIZE,
  };

  const { data, isLoading, isError, error } = useActivities(queryParams);

  const activities = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleFiltersChange = useCallback(
    (newFilters: ActivityFiltersState) => {
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
        <h2 className="text-2xl font-bold tracking-tight">
          Activity Browser
        </h2>
        <p className="text-muted-foreground">
          Browse, filter, and manage your activities catalog
        </p>
      </div>

      {/* Toolbar: Search + View Toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
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
            {total} activit{total !== 1 ? "ies" : "y"}
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
      <ActivityFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Content Area */}
      <div className="min-h-[400px]">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Loading activities...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-sm text-red-500">
              Failed to load activities
            </p>
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
            {viewMode === "grid" ? (
              <ActivityGrid activities={activities} />
            ) : (
              <ActivityTable activities={activities} />
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
