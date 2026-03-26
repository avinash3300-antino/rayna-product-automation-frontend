"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types/products";

interface ProductSelectionTableProps {
  products: Product[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

const categoryColors: Record<string, string> = {
  hotels: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  attractions: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  transfers: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  restaurants: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export function ProductSelectionTable({
  products,
  selectedIds,
  onSelectionChange,
}: ProductSelectionTableProps) {
  const allSelected = products.length > 0 && products.every((p) => selectedIds.has(p.id));
  const someSelected = products.some((p) => selectedIds.has(p.id)) && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(products.map((p) => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  if (products.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        No products match the selected filters.
      </div>
    );
  }

  return (
    <div className="rounded-md border max-h-[320px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected || (someSelected && "indeterminate")}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="hidden sm:table-cell">Destination</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="text-right">Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className="cursor-pointer"
              onClick={() => toggleOne(product.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.has(product.id)}
                  onCheckedChange={() => toggleOne(product.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {product.destination}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge
                  variant="outline"
                  className={categoryColors[product.category] || ""}
                >
                  {product.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {product.tags.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
