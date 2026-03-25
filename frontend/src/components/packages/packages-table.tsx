"use client";

import { MoreHorizontal, Pencil, Copy, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TravelPackage } from "@/types/packages";
import {
  PACKAGE_TYPE_DEFINITIONS,
  PACKAGE_STATUS_COLORS,
  PACKAGE_STATUS_LABELS,
} from "@/lib/mock-packages";

interface PackagesTableProps {
  packages: TravelPackage[];
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PackagesTable({
  packages,
  onEdit,
  onDuplicate,
  onDelete,
}: PackagesTableProps) {
  const getTypeName = (typeId: string) =>
    PACKAGE_TYPE_DEFINITIONS.find((t) => t.id === typeId)?.name ?? typeId;

  if (packages.length === 0) {
    return (
      <div className="rounded-md border p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No packages yet. Click &quot;New Package&quot; to create your first
          package.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell text-right">From Price</TableHead>
            <TableHead className="hidden md:table-cell text-center">Components</TableHead>
            <TableHead className="hidden lg:table-cell">Pricing</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => (
            <TableRow key={pkg.id}>
              <TableCell className="font-medium">{pkg.name}</TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {getTypeName(pkg.packageTypeId)}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {pkg.destination}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={PACKAGE_STATUS_COLORS[pkg.status] || ""}
                >
                  {PACKAGE_STATUS_LABELS[pkg.status] || pkg.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-right font-medium">
                {pkg.pricing.currency}{" "}
                {pkg.pricing.displayPrice.toLocaleString()}
              </TableCell>
              <TableCell className="hidden md:table-cell text-center">
                {pkg.components.length}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Badge
                  variant="outline"
                  className={
                    pkg.pricing.pricingStatus === "complete"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }
                >
                  {pkg.pricing.pricingStatus === "complete"
                    ? "Complete"
                    : "Incomplete"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEdit(pkg.id)}>
                      <Pencil className="h-3.5 w-3.5 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicate(pkg.id)}>
                      <Copy className="h-3.5 w-3.5 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(pkg.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
