"use client";

import { ProductCard } from "./product-card";
import type { Product } from "@/types/products";

interface ProductGridProps {
  products: Product[];
  onEdit: (id: string) => void;
  onViewContent: (id: string) => void;
  onAssignTags: (id: string) => void;
  onMapSource: (id: string) => void;
}

export function ProductGrid({
  products,
  onEdit,
  onViewContent,
  onAssignTags,
  onMapSource,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        No products match the current filters
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onViewContent={onViewContent}
          onAssignTags={onAssignTags}
          onMapSource={onMapSource}
        />
      ))}
    </div>
  );
}
