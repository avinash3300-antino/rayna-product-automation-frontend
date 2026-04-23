"use client";

import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type {
  ClassificationRecord,
  ClassificationReviewStatus,
} from "@/types/classification";
import type { ProductCategory } from "@/types/destinations";

interface ClassificationTableProps {
  records: ClassificationRecord[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onReviewClick: (recordId: string) => void;
}

const categoryStyles: Record<string, string> = {
  hotels: "border-chart-2/30 text-chart-2",
  attractions: "border-chart-1/30 text-chart-1",
  transfers: "border-blue-500/30 text-blue-600",
  restaurants: "border-chart-4/30 text-chart-4",
};

const statusStyles: Record<ClassificationReviewStatus, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  in_review: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  escalated: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const statusLabels: Record<ClassificationReviewStatus, string> = {
  pending: "Pending",
  in_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
  escalated: "Escalated",
};

function getConfidenceColor(score: number): string {
  if (score >= 0.7) return "text-emerald-600";
  if (score >= 0.5) return "text-amber-600";
  return "text-red-600";
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
}

export function ClassificationTable({
  records,
  currentPage,
  pageSize,
  onPageChange,
  onReviewClick,
}: ClassificationTableProps) {
  const totalPages = Math.ceil(records.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const pageRecords = records.slice(startIdx, startIdx + pageSize);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Classification Records</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={100}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Predicted Category</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead className="min-w-[200px]">Rationale</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-12"
                    >
                      No records match the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onReviewClick(record.id)}
                    >
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {record.normalizedPayload.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {record.source}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs capitalize",
                            categoryStyles[record.predictedCategory]
                          )}
                        >
                          {record.predictedCategory}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-mono text-sm font-medium tabular-nums",
                            getConfidenceColor(record.confidenceScore)
                          )}
                        >
                          {record.confidenceScore.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[250px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default">
                              {truncateText(
                                record.classifierRationale,
                                60
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="max-w-sm"
                          >
                            <p className="text-xs">
                              {record.classifierRationale}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.assignedTo ?? "Unassigned"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            statusStyles[record.status]
                          )}
                        >
                          {statusLabels[record.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {record.status === "pending" ||
                          record.status === "in_review" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1 text-xs"
                              onClick={() => onReviewClick(record.id)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Review
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Reviewed
                            </span>
                          )}
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
        {records.length > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIdx + 1}&ndash;
              {Math.min(startIdx + pageSize, records.length)} of{" "}
              {records.length}
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
      </CardContent>
    </Card>
  );
}
