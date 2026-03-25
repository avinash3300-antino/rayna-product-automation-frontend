"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  Hotel,
  Ticket,
  Car,
  UtensilsCrossed,
  ChevronDown,
  ArrowUpDown,
  CheckSquare,
  Square,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AttributeProduct,
  AttributeCategory,
  AttributeFilterState,
} from "@/types/attributes";
import { STATUS_COLORS } from "@/types/attributes";
import type { ProductStatus } from "@/types/products";

const CATEGORY_ICON_MAP: Record<AttributeCategory, React.ReactNode> = {
  hotels: <Hotel className="h-3.5 w-3.5" />,
  attractions: <Ticket className="h-3.5 w-3.5" />,
  transfers: <Car className="h-3.5 w-3.5" />,
  restaurants: <UtensilsCrossed className="h-3.5 w-3.5" />,
};

interface ProductSelectorProps {
  products: AttributeProduct[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  bulkMode: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

export function ProductSelector({
  products,
  selectedId,
  onSelect,
  bulkMode,
  selectedIds,
  onToggleSelect,
}: ProductSelectorProps) {
  const [filters, setFilters] = useState<AttributeFilterState>({
    search: "",
    destinations: [],
    statuses: [],
    completenessMin: 0,
    sortBy: "name",
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => {
      if (
        filters.search &&
        !p.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !p.destination.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (
        filters.destinations.length > 0 &&
        !filters.destinations.includes(p.destination)
      )
        return false;
      if (
        filters.statuses.length > 0 &&
        !filters.statuses.includes(p.status)
      )
        return false;
      if (p.completeness < filters.completenessMin) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "completeness":
          return b.completeness - a.completeness;
        case "updatedAt":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [products, filters]);

  const toggleDestination = (dest: string) => {
    setFilters((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(dest)
        ? prev.destinations.filter((d) => d !== dest)
        : [...prev.destinations, dest],
    }));
  };

  const toggleStatus = (status: ProductStatus) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  };

  const uniqueDestinations = useMemo(
    () => [...new Set(products.map((p) => p.destination))].sort(),
    [products]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or destination..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="pl-9 h-9 text-sm bg-navy-dark/30 border-border"
          />
          {filters.search && (
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, search: "" }))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filter toggle & Sort */}
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => setShowFilters(!showFilters)}
        >
          <ChevronDown
            className={`h-3 w-3 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
          Filters
          {(filters.destinations.length > 0 ||
            filters.statuses.length > 0 ||
            filters.completenessMin > 0) && (
            <span className="ml-1 bg-gold text-navy-dark text-[10px] rounded-full px-1.5 py-0.5 font-bold">
              {filters.destinations.length +
                filters.statuses.length +
                (filters.completenessMin > 0 ? 1 : 0)}
            </span>
          )}
        </Button>

        <div className="flex items-center gap-1">
          <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
          <Select
            value={filters.sortBy}
            onValueChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: val as AttributeFilterState["sortBy"],
              }))
            }
          >
            <SelectTrigger className="h-7 w-[120px] text-xs border-0 bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="completeness">Completeness %</SelectItem>
              <SelectItem value="updatedAt">Last Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div className="px-3 py-3 border-b border-border space-y-3">
          {/* Destination multi-select */}
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Destination
            </label>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {uniqueDestinations.map((dest) => (
                <button
                  key={dest}
                  onClick={() => toggleDestination(dest)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                    filters.destinations.includes(dest)
                      ? "bg-gold text-navy-dark"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </label>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {(
                ["draft", "staged", "published", "archived"] as ProductStatus[]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize transition-all ${
                    filters.statuses.includes(status)
                      ? "bg-gold text-navy-dark"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Completeness slider */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Min Completeness
              </label>
              <span className="text-[11px] text-gold font-semibold">
                {filters.completenessMin}%
              </span>
            </div>
            <Slider
              value={[filters.completenessMin]}
              max={100}
              step={5}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  completenessMin: val[0],
                }))
              }
              className="mt-2"
            />
          </div>
        </div>
      )}

      {/* Result count */}
      <div className="px-3 py-1.5 border-b border-border">
        <span className="text-[11px] text-muted-foreground">
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Product list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() =>
                bulkMode ? onToggleSelect(product.id) : onSelect(product.id)
              }
              className={`w-full text-left p-3 rounded-lg transition-all ${
                !bulkMode && selectedId === product.id
                  ? "bg-gold/10 border border-gold/40 shadow-sm"
                  : "hover:bg-muted/50 border border-transparent"
              }`}
            >
              <div className="flex items-start gap-2">
                {bulkMode && (
                  <div className="mt-0.5">
                    {selectedIds.includes(product.id) ? (
                      <CheckSquare className="h-4 w-4 text-gold" />
                    ) : (
                      <Square className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-muted-foreground">
                      {CATEGORY_ICON_MAP[product.category]}
                    </span>
                    <span className="text-sm font-semibold truncate">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-4"
                    >
                      {product.destination}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 capitalize ${
                        STATUS_COLORS[product.status]
                      }`}
                    >
                      {product.status}
                    </Badge>
                  </div>
                  {/* Completeness bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          product.completeness < 60
                            ? "bg-red-500"
                            : product.completeness < 80
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${product.completeness}%` }}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-semibold ${
                        product.completeness < 60
                          ? "text-red-500"
                          : product.completeness < 80
                          ? "text-amber-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {product.completeness}%
                    </span>
                  </div>
                  {product.missingFields.length > 0 && (
                    <p className="text-[10px] text-red-400 mt-1">
                      {product.missingFields.length} field
                      {product.missingFields.length !== 1 ? "s" : ""} missing
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No products match your filters
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
