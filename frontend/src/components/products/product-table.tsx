"use client";

import { ChevronLeft, ChevronRight, Pencil, Eye, Tag, Link2, Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/format";
import type { Product, ProductStatus } from "@/types/products";
import type { ProductCategory } from "@/types/destinations";

interface ProductTableProps {
  products: Product[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (id: string) => void;
  onViewContent: (id: string) => void;
  onAssignTags: (id: string) => void;
  onMapSource: (id: string) => void;
}

const categoryStyles: Record<string, string> = {
  hotels: "border-chart-2/30 text-chart-2",
  attractions: "border-chart-1/30 text-chart-1",
  transfers: "border-blue-500/30 text-blue-600",
  restaurants: "border-chart-4/30 text-chart-4",
};

const statusStyles: Record<ProductStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  staged: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  published: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  archived: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function ProductTable({
  products,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  onViewContent,
  onAssignTags,
  onMapSource,
}: ProductTableProps) {
  const totalPages = Math.ceil(products.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const pageProducts = products.slice(startIdx, startIdx + pageSize);

  return (
    <div>
      <TooltipProvider delayDuration={100}>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completeness</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Booking Source</TableHead>
                <TableHead>Publish</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-muted-foreground py-12"
                  >
                    No products match the current filters
                  </TableCell>
                </TableRow>
              ) : (
                pageProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onEdit(product.id)}
                  >
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs capitalize",
                          categoryStyles[product.category]
                        )}
                      >
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {product.destination}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs capitalize",
                          statusStyles[product.status]
                        )}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress
                          value={product.completeness}
                          className="h-1.5 flex-1"
                        />
                        <span className="text-xs font-mono text-muted-foreground tabular-nums w-8">
                          {product.completeness}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {product.tags.slice(0, 2).map((tag, i) => (
                          <Badge
                            key={`${tag.dimension}-${tag.value}-${i}`}
                            variant="outline"
                            className="text-[10px] h-5 font-normal"
                          >
                            {tag.value}
                          </Badge>
                        ))}
                        {product.tags.length > 2 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="text-[10px] h-5 font-normal text-muted-foreground cursor-default"
                              >
                                +{product.tags.length - 2}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <div className="text-xs space-y-0.5">
                                {product.tags.slice(2).map((tag, i) => (
                                  <div key={i}>{tag.value}</div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {product.bookingSource?.name ?? (
                        <span className="text-muted-foreground/50">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.publishFlag ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatRelativeTime(product.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onEdit(product.id)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onViewContent(product.id)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Content</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onAssignTags(product.id)}
                            >
                              <Tag className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Assign Tags</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => onMapSource(product.id)}
                            >
                              <Link2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Map Source</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIdx + 1}&ndash;
            {Math.min(startIdx + pageSize, products.length)} of{" "}
            {products.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
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
