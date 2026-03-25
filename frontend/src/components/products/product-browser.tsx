"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductFilters } from "./product-filters";
import { ProductGrid } from "./product-grid";
import { ProductTable } from "./product-table";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import type {
  Product,
  ProductFilters as FilterState,
  ProductViewMode,
  TagDimension,
} from "@/types/products";

const PAGE_SIZE = 12;

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

export function ProductBrowser() {
  const router = useRouter();
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<ProductViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Extract unique destinations
  const destinations = useMemo(
    () => [...new Set(products.map((p) => p.destination))].sort(),
    [products]
  );

  // Extract available tag values by dimension
  const availableTags = useMemo(() => {
    const result: Record<TagDimension, Set<string>> = {
      budget_tier: new Set(),
      travel_theme: new Set(),
      audience: new Set(),
      season: new Set(),
      accessibility: new Set(),
    };
    products.forEach((p) =>
      p.tags.forEach((tag) => result[tag.dimension].add(tag.value))
    );
    return Object.fromEntries(
      Object.entries(result).map(([k, v]) => [k, [...v].sort()])
    ) as Record<TagDimension, string[]>;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (
        filters.search &&
        !p.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !p.destination.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;

      // Destination
      if (
        filters.destinations.length > 0 &&
        !filters.destinations.includes(p.destination)
      )
        return false;

      // Category
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(p.category)
      )
        return false;

      // Status
      if (filters.statuses.length > 0 && !filters.statuses.includes(p.status))
        return false;

      // Completeness
      if (
        p.completeness < filters.completenessRange[0] ||
        p.completeness > filters.completenessRange[1]
      )
        return false;

      // Tag filters
      for (const [dim, values] of Object.entries(filters.tagFilters)) {
        if (values.length > 0) {
          const productTags = p.tags
            .filter((t) => t.dimension === dim)
            .map((t) => t.value);
          if (!values.some((v) => productTags.includes(v))) return false;
        }
      }

      // Booking source
      if (filters.hasBookingSource === true && !p.bookingSource) return false;
      if (filters.hasBookingSource === false && p.bookingSource) return false;

      // Publish flag
      if (filters.publishFlag === true && !p.publishFlag) return false;
      if (filters.publishFlag === false && p.publishFlag) return false;

      return true;
    });
  }, [products, filters]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, search: value }));
      setCurrentPage(1);
    },
    []
  );

  const navigateToProduct = useCallback(
    (id: string) => {
      router.push(`/products/${id}`);
    },
    [router]
  );

  const handleEdit = navigateToProduct;
  const handleViewContent = navigateToProduct;
  const handleAssignTags = navigateToProduct;
  const handleMapSource = navigateToProduct;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Product Browser</h2>
        <p className="text-muted-foreground">
          Browse, filter, and manage your product catalog
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Result count */}
        <span className="text-sm text-muted-foreground">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </span>

        <div className="flex items-center gap-1 ml-auto">
          {/* Filter toggle (desktop) */}
          <Button
            variant={sidebarOpen ? "secondary" : "outline"}
            size="sm"
            className="hidden lg:flex h-8 gap-1.5"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </Button>

          {/* Filter toggle (mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden h-8 gap-1.5"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <ProductFilters
                filters={filters}
                destinations={destinations}
                availableTags={availableTags}
                onFilterChange={handleFilterChange}
              />
            </SheetContent>
          </Sheet>

          {/* View toggle */}
          <div className="flex items-center border rounded-md">
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
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-6">
        {/* Sidebar (desktop only) */}
        {sidebarOpen && (
          <div className="hidden lg:block w-64 shrink-0 border rounded-lg overflow-hidden">
            <ProductFilters
              filters={filters}
              destinations={destinations}
              availableTags={availableTags}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {/* Products */}
        <div className="flex-1 min-w-0">
          {viewMode === "grid" ? (
            <ProductGrid
              products={filteredProducts}
              onEdit={handleEdit}
              onViewContent={handleViewContent}
              onAssignTags={handleAssignTags}
              onMapSource={handleMapSource}
            />
          ) : (
            <ProductTable
              products={filteredProducts}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              onEdit={handleEdit}
              onViewContent={handleViewContent}
              onAssignTags={handleAssignTags}
              onMapSource={handleMapSource}
            />
          )}
        </div>
      </div>
    </div>
  );
}
