"use client";

import { XCircle, Loader2, Eye, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatElapsedTime, formatRelativeTime } from "@/lib/format";
import type {
  ActiveIngestionJob,
  SourceIngestionStatus,
  RunType,
} from "@/types/ingestion";

interface ActiveJobCardProps {
  job: ActiveIngestionJob;
  now: number;
  onCancel: () => void;
  onViewDetails: () => void;
}

const runTypeStyles: Record<RunType, string> = {
  full: "border-chart-1/30 text-chart-1",
  incremental: "border-chart-2/30 text-chart-2",
  manual: "border-chart-4/30 text-chart-4",
};

const sourceStatusStyles: Record<SourceIngestionStatus, string> = {
  fetching: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
  waiting: "bg-muted text-muted-foreground",
};

export function ActiveJobCard({
  job,
  now,
  onCancel,
  onViewDetails,
}: ActiveJobCardProps) {
  const progress = Math.min(
    100,
    Math.round((job.recordsFetched / job.estimatedTotal) * 100)
  );
  const totalErrors = job.sources.reduce((sum, s) => sum + s.errors, 0);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{job.destination}</h3>
            <Badge
              variant="outline"
              className={cn("text-xs", runTypeStyles[job.runType])}
            >
              {job.runType}
            </Badge>
            <Badge
              variant="secondary"
              className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1"
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              running
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={onViewDetails}
            >
              <Eye className="mr-1 h-3 w-3" />
              Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={onCancel}
            >
              <XCircle className="mr-1 h-3 w-3" />
              Cancel
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Progress */}
        <div className="space-y-1.5">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="tabular-nums">
              {job.recordsFetched.toLocaleString()} / ~
              {job.estimatedTotal.toLocaleString()} records
            </span>
            <span className="tabular-nums">{progress}%</span>
          </div>
        </div>

        {/* Source breakdown */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Source</TableHead>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-xs text-right">Records</TableHead>
              <TableHead className="text-xs text-right">Errors</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {job.sources.map((src) => (
              <TableRow key={src.id}>
                <TableCell className="text-sm font-medium py-2">
                  {src.sourceName}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground py-2">
                  {src.category}
                </TableCell>
                <TableCell className="text-sm text-right tabular-nums py-2">
                  {src.recordsFetched.toLocaleString()}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-sm text-right tabular-nums py-2",
                    src.errors > 0 && "text-red-600 font-medium"
                  )}
                >
                  {src.errors}
                </TableCell>
                <TableCell className="py-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] h-5 gap-1",
                      sourceStatusStyles[src.status]
                    )}
                  >
                    {src.status === "fetching" && (
                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    )}
                    {src.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Footer: timing + errors */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
          <span>Started {formatRelativeTime(job.startedAt)}</span>
          <div className="flex items-center gap-3">
            {totalErrors > 0 && (
              <span className="text-red-600">
                {totalErrors} error{totalErrors !== 1 ? "s" : ""}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="tabular-nums">
                {formatElapsedTime(job.startedAt, now)}
              </span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
