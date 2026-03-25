"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PackageComponentPricing } from "@/types/packages";

interface PricingBreakdownTableProps {
  breakdown: PackageComponentPricing[];
  currency: string;
  baseCost: number;
}

const categoryColors: Record<string, string> = {
  hotels: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  attractions: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  transfers: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  restaurants: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

export function PricingBreakdownTable({
  breakdown,
  currency,
  baseCost,
}: PricingBreakdownTableProps) {
  if (breakdown.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No components selected yet.
      </p>
    );
  }

  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Net Rate</TableHead>
            <TableHead className="text-center">Qty</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {breakdown.map((item) => (
            <TableRow key={item.productId}>
              <TableCell className="font-medium">{item.productName}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={categoryColors[item.category] || ""}
                >
                  {item.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {item.netRate > 0
                  ? `${currency} ${item.netRate.toLocaleString()}`
                  : "—"}
              </TableCell>
              <TableCell className="text-center">{item.quantity}</TableCell>
              <TableCell className="text-right font-medium">
                {item.subtotal > 0
                  ? `${currency} ${item.subtotal.toLocaleString()}`
                  : "Pending"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="font-semibold">
              Base Cost
            </TableCell>
            <TableCell className="text-right font-semibold">
              {currency} {baseCost.toLocaleString()}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
