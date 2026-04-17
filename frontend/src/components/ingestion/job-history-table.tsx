"use client";

import { Eye, RotateCcw, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
import {
  formatDuration,
  formatRelativeTime,
  truncateUuid,
} from "@/lib/format";
import type { IngestionJob, JobStatus, RunType } from "@/types/ingestion";

interface JobHistoryTableProps {
  jobs: IngestionJob[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewDetails: (jobId: string) => void;
}

const statusStyles: Record<JobStatus, string> = {
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  running: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
  queued: "bg-muted text-muted-foreground",
};

const runTypeStyles: Record<RunType, string> = {
  full: "border-chart-1/30 text-chart-1",
  incremental: "border-chart-2/30 text-chart-2",
  manual: "border-chart-4/30 text-chart-4",
};

export function JobHistoryTable({
  jobs,
  currentPage,
  pageSize,
  onPageChange,
  onViewDetails,
}: JobHistoryTableProps) {
  const totalPages = Math.ceil(jobs.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const pageJobs = jobs.slice(startIdx, startIdx + pageSize);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Ingestion Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={100}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Records</TableHead>
                  <TableHead className="text-right">Errors</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageJobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onViewDetails(job.id)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{truncateUuid(job.id)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-mono text-xs">{job.id}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="font-medium">
                      {job.destination}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", runTypeStyles[job.runType])}
                      >
                        {job.runType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs gap-1",
                          statusStyles[job.status]
                        )}
                      >
                        {job.status === "running" && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {job.recordsFetched > 0
                        ? job.recordsFetched.toLocaleString()
                        : "\u2014"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right tabular-nums",
                        job.errors.length > 0 &&
                          "text-red-600 font-medium"
                      )}
                    >
                      {job.errors.length}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatRelativeTime(job.startedAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm tabular-nums">
                      {formatDuration(job.durationMs)}
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onViewDetails(job.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {job.status === "completed" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIdx + 1}&ndash;
            {Math.min(startIdx + pageSize, jobs.length)} of {jobs.length}
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
      </CardContent>
    </Card>
  );
}
