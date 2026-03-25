"use client";

import { useState, useMemo } from "react";
import { Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Product } from "@/types/products";
import type { Tag } from "@/types/tags";
import { ProductSelectionTable } from "./product-selection-table";
import { TagSelector } from "./tag-selector";

interface BulkTagProductsProps {
  products: Product[];
  tags: Tag[];
  onApplyTags: (productIds: string[], tagIds: string[]) => void;
}

export function BulkTagProducts({ products, tags, onApplyTags }: BulkTagProductsProps) {
  const [destination, setDestination] = useState("all");
  const [category, setCategory] = useState("all");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const destinations = useMemo(
    () => [...new Set(products.map((p) => p.destination))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (destination !== "all" && p.destination !== destination) return false;
      if (category !== "all" && p.category !== category) return false;
      return true;
    });
  }, [products, destination, category]);

  // Clear selection when filters change
  const handleDestinationChange = (val: string) => {
    setDestination(val);
    setSelectedProductIds(new Set());
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setSelectedProductIds(new Set());
  };

  const handleApply = () => {
    if (selectedProductIds.size === 0 || selectedTagIds.length === 0) return;
    onApplyTags(Array.from(selectedProductIds), selectedTagIds);
    setSelectedProductIds(new Set());
    setSelectedTagIds([]);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Tags className="h-4 w-4" />
          Bulk Tag Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs">Destination</Label>
            <Select value={destination} onValueChange={handleDestinationChange}>
              <SelectTrigger>
                <SelectValue />
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
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs">Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="hotels">Hotels</SelectItem>
                <SelectItem value="attractions">Attractions</SelectItem>
                <SelectItem value="transfers">Transfers</SelectItem>
                <SelectItem value="restaurants">Restaurants</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Selection */}
        <ProductSelectionTable
          products={filteredProducts}
          selectedIds={selectedProductIds}
          onSelectionChange={setSelectedProductIds}
        />

        {/* Tag Selector */}
        <TagSelector
          tags={tags}
          selectedTagIds={selectedTagIds}
          onSelectionChange={setSelectedTagIds}
        />

        {/* Apply Button */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            {selectedProductIds.size} product{selectedProductIds.size !== 1 ? "s" : ""} &times;{" "}
            {selectedTagIds.length} tag{selectedTagIds.length !== 1 ? "s" : ""}
          </p>
          <Button
            onClick={handleApply}
            disabled={selectedProductIds.size === 0 || selectedTagIds.length === 0}
          >
            Apply Tags
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
