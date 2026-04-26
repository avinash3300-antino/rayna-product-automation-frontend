"use client";

import Link from "next/link";
import {
  ExternalLink,
  Loader2,
  FileText,
  Database,
  SkipForward,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { ScrapeJob, ScrapeJobStatus } from "@/types/scraping";

interface JobDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: ScrapeJob | null;
}

const STATUS_CONFIG: Record<
  ScrapeJobStatus,
  { label: string; className: string; spinning?: boolean }
> = {
  pending: {
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  },
  scraping: {
    label: "Scraping",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    spinning: true,
  },
  extracting: {
    label: "Extracting",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    spinning: true,
  },
  saving: {
    label: "Saving",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    spinning: true,
  },
  enriching: {
    label: "Enriching",
    className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    spinning: true,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
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

export function JobDetailSheet({
  open,
  onOpenChange,
  job,
}: JobDetailSheetProps) {
  if (!job) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[400px] sm:max-w-[400px]">
          <SheetHeader>
            <SheetTitle>Job Details</SheetTitle>
            <SheetDescription>
              No job selected.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  const statusCfg = STATUS_CONFIG[job.status];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:max-w-[420px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            Job Preview
            <Badge
              variant="secondary"
              className={`${statusCfg.className} ${
                statusCfg.spinning ? "flex items-center gap-1" : ""
              }`}
            >
              {statusCfg.spinning && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              {statusCfg.label}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Quick overview of scrape job
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 mt-2">
          {/* Source URL */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Source URL
            </p>
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-mono flex items-center gap-1 break-all"
            >
              {job.sourceUrl}
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>

          <Separator />

          {/* Category & Scrape Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Category
              </p>
              <p className="text-sm capitalize">
                {job.category}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Scrape Type
              </p>
              <p className="text-sm capitalize">
                {job.scrapeType}
              </p>
            </div>
          </div>

          <Separator />

          {/* Stats Grid */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Statistics
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-lg font-bold">
                    {job.pagesScraped}
                  </p>
                  <p className="text-xs text-muted-foreground">Pages</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <Database className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-lg font-bold">
                    {job.recordsFound}
                  </p>
                  <p className="text-xs text-muted-foreground">Found</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <Database className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-lg font-bold">
                    {job.recordsSaved}
                  </p>
                  <p className="text-xs text-muted-foreground">Saved</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <SkipForward className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-lg font-bold">
                    {job.recordsSkippedDup}
                  </p>
                  <p className="text-xs text-muted-foreground">Skipped</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border p-3 col-span-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-lg font-bold">
                    {job.recordsEnriched}
                  </p>
                  <p className="text-xs text-muted-foreground">Enriched</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Started At
              </p>
              <p className="text-sm">
                {formatDate(job.startedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Completed At
              </p>
              <p className="text-sm">
                {formatDate(job.completedAt)}
              </p>
            </div>
          </div>

          {/* Error indicator */}
          {job.errorsJson && Object.keys(job.errorsJson).length > 0 && (
            <>
              <Separator />
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                <p className="text-xs text-red-600 font-medium">
                  This job has errors. View full details for more information.
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* View Full Details Button */}
          <Link href={`/scraping/${encodeURIComponent(job.id)}`}>
            <Button variant="outline" className="w-full">
              View Full Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
