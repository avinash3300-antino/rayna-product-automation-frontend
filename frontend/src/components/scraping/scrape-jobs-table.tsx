"use client";

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ScrapeJob, ScrapeJobStatus } from "@/types/scraping";

interface ScrapeJobsTableProps {
  jobs: ScrapeJob[];
  onSelectJob: (job: ScrapeJob) => void;
}

const STATUS_CONFIG: Record<
  ScrapeJobStatus,
  { label: string; className: string; spinning?: boolean }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
  scraping: {
    label: "Scraping",
    className:
      "bg-blue-500/20 text-blue-400 border-blue-500/30",
    spinning: true,
  },
  extracting: {
    label: "Extracting",
    className:
      "bg-amber-500/20 text-amber-400 border-amber-500/30",
    spinning: true,
  },
  saving: {
    label: "Saving",
    className:
      "bg-blue-500/20 text-blue-400 border-blue-500/30",
    spinning: true,
  },
  enriching: {
    label: "Enriching",
    className:
      "bg-purple-500/20 text-purple-400 border-purple-500/30",
    spinning: true,
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  failed: {
    label: "Failed",
    className:
      "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "\u2014";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateUrl(url: string, maxLen = 40) {
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen) + "...";
}

export function ScrapeJobsTable({ jobs, onSelectJob }: ScrapeJobsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="text-muted-foreground">Source URL</TableHead>
            <TableHead className="text-muted-foreground">Category</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Scrape Type</TableHead>
            <TableHead className="text-muted-foreground text-right">
              Pages
            </TableHead>
            <TableHead className="text-muted-foreground text-right">
              Found
            </TableHead>
            <TableHead className="text-muted-foreground text-right">
              Saved
            </TableHead>
            <TableHead className="text-muted-foreground text-right">
              Skipped
            </TableHead>
            <TableHead className="text-muted-foreground">Started At</TableHead>
            <TableHead className="text-muted-foreground">
              Completed At
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => {
            const statusCfg = STATUS_CONFIG[job.status];
            return (
              <TableRow
                key={job.id}
                className="border-border/50 hover:bg-navy-light/50 cursor-pointer"
                onClick={() => onSelectJob(job)}
              >
                <TableCell className="max-w-[260px]">
                  <span
                    className="text-sm text-gold font-mono truncate block"
                    title={job.sourceUrl}
                  >
                    {truncateUrl(job.sourceUrl)}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-foreground capitalize">
                  {job.category}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${statusCfg.className} ${
                      statusCfg.spinning
                        ? "flex items-center gap-1 w-fit"
                        : ""
                    }`}
                  >
                    {statusCfg.spinning && (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    )}
                    {statusCfg.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground capitalize">
                  {job.scrapeType}
                </TableCell>
                <TableCell className="text-sm text-foreground text-right tabular-nums">
                  {job.pagesScraped}
                </TableCell>
                <TableCell className="text-sm text-foreground text-right tabular-nums">
                  {job.recordsFound}
                </TableCell>
                <TableCell className="text-sm text-foreground text-right tabular-nums">
                  {job.recordsSaved}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground text-right tabular-nums">
                  {job.recordsSkippedDup}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(job.startedAt)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(job.completedAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
