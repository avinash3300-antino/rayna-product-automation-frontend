"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDuration, formatRelativeTime } from "@/lib/format";
import type {
  IngestionJob,
  JobStatus,
  RunType,
  SourceIngestionStatus,
} from "@/types/ingestion";

interface JobDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: IngestionJob | null;
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

const sourceStatusStyles: Record<SourceIngestionStatus, string> = {
  fetching: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  failed: "bg-red-500/10 text-red-600 border-red-500/20",
  waiting: "bg-muted text-muted-foreground",
};

function MetadataRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-right">{children}</span>
    </div>
  );
}

export function JobDetailSheet({ open, onOpenChange, job }: JobDetailSheetProps) {
  if (!job) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-hidden flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>
            Job {job.id.substring(0, 8)} &mdash; {job.destination}
          </SheetTitle>
          <SheetDescription>
            Ingestion job details and source breakdown
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          {/* Section 1: Metadata */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold mb-2">Job Metadata</h3>
            <MetadataRow label="Job ID">
              <span className="font-mono text-xs">{job.id}</span>
            </MetadataRow>
            <MetadataRow label="Destination">
              <span className="font-medium">{job.destination}</span>
            </MetadataRow>
            <MetadataRow label="Type">
              <Badge
                variant="outline"
                className={cn("text-xs", runTypeStyles[job.runType])}
              >
                {job.runType}
              </Badge>
            </MetadataRow>
            <MetadataRow label="Status">
              <Badge
                variant="secondary"
                className={cn("text-xs", statusStyles[job.status])}
              >
                {job.status}
              </Badge>
            </MetadataRow>
            <MetadataRow label="Started">
              {new Date(job.startedAt).toLocaleString()} (
              {formatRelativeTime(job.startedAt)})
            </MetadataRow>
            <MetadataRow label="Ended">
              {job.endedAt
                ? `${new Date(job.endedAt).toLocaleString()} (${formatRelativeTime(job.endedAt)})`
                : "\u2014"}
            </MetadataRow>
            <MetadataRow label="Duration">
              {formatDuration(job.durationMs)}
            </MetadataRow>
            <MetadataRow label="Records">
              <span className="tabular-nums">
                {job.recordsFetched.toLocaleString()} / ~
                {job.estimatedTotal.toLocaleString()}
              </span>
            </MetadataRow>
            <MetadataRow label="Errors">
              <span
                className={cn(
                  "tabular-nums",
                  job.errors.length > 0 && "text-red-600 font-medium"
                )}
              >
                {job.errors.length}
              </span>
            </MetadataRow>
          </div>

          <Separator className="my-6" />

          {/* Section 2: Source Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Source Breakdown</h3>
            {job.sources.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Records</TableHead>
                    <TableHead className="text-right">Errors</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {job.sources.map((src) => (
                    <TableRow key={src.id}>
                      <TableCell className="font-medium">
                        {src.sourceName}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {src.category}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {src.recordsFetched.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums",
                          src.errors > 0 && "text-red-600 font-medium"
                        )}
                      >
                        {src.errors}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            sourceStatusStyles[src.status]
                          )}
                        >
                          {src.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No source data available
              </p>
            )}
          </div>

          {/* Section 3: Error Log */}
          {job.errors.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Error Log
                </h3>
                <div className="space-y-2">
                  {job.errors.map((err) => (
                    <div
                      key={err.id}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm",
                        err.severity === "error"
                          ? "bg-red-500/5 border border-red-500/20"
                          : "bg-amber-500/5 border border-amber-500/20"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] h-4",
                            err.severity === "error"
                              ? "bg-red-500/10 text-red-600"
                              : "bg-amber-500/10 text-amber-600"
                          )}
                        >
                          {err.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {err.source}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatRelativeTime(err.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{err.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section 4: Related Push Batches */}
          <Separator className="my-6" />
          <div className="space-y-3 pb-4">
            <h3 className="text-sm font-semibold">Related Push Batches</h3>
            {job.relatedPushBatchIds.length > 0 ? (
              <div className="space-y-1.5">
                {job.relatedPushBatchIds.map((batchId) => (
                  <div
                    key={batchId}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {batchId}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No related push batches
              </p>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="border-t pt-4 mt-auto">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
