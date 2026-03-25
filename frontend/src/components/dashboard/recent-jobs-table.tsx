"use client";

import { Eye, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { MOCK_RECENT_JOBS } from "@/lib/mock-dashboard-data";
import type { JobStatus, RunType } from "@/types/dashboard";

function formatDuration(ms: number): string {
  if (ms === 0) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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

export function RecentJobsTable() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Ingestion Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destination</TableHead>
                <TableHead>Run Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Records</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_RECENT_JOBS.map((job) => (
                <TableRow key={job.id}>
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
                    {job.records > 0 ? job.records.toLocaleString() : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatRelativeTime(job.startedAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm tabular-nums">
                    {formatDuration(job.durationMs)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
