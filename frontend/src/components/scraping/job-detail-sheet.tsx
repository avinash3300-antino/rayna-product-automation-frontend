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
    className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
  scraping: {
    label: "Scraping",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    spinning: true,
  },
  extracting: {
    label: "Extracting",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    spinning: true,
  },
  saving: {
    label: "Saving",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    spinning: true,
  },
  enriching: {
    label: "Enriching",
    className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    spinning: true,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
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
        <SheetContent className="bg-navy border-border/50 w-[400px] sm:max-w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-foreground">Job Details</SheetTitle>
            <SheetDescription className="text-muted-foreground">
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
      <SheetContent className="bg-navy border-border/50 w-[420px] sm:max-w-[420px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-foreground flex items-center gap-2">
            Job Preview
            <Badge
              variant="outline"
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
          <SheetDescription className="text-muted-foreground">
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
              className="text-sm text-gold hover:text-gold/80 font-mono flex items-center gap-1 break-all"
            >
              {job.sourceUrl}
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>

          <Separator className="bg-border/50" />

          {/* Category & Scrape Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Category
              </p>
              <p className="text-sm text-foreground capitalize">
                {job.category}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Scrape Type
              </p>
              <p className="text-sm text-foreground capitalize">
                {job.scrapeType}
              </p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Stats Grid */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Statistics
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-navy-light/30 p-3">
                <FileText className="h-4 w-4 text-gold" />
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {job.pagesScraped}
                  </p>
                  <p className="text-xs text-muted-foreground">Pages</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                <Database className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-lg font-bold text-blue-400">
                    {job.recordsFound}
                  </p>
                  <p className="text-xs text-muted-foreground">Found</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <Database className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className="text-lg font-bold text-emerald-400">
                    {job.recordsSaved}
                  </p>
                  <p className="text-xs text-muted-foreground">Saved</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-navy-light/30 p-3">
                <SkipForward className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {job.recordsSkippedDup}
                  </p>
                  <p className="text-xs text-muted-foreground">Skipped</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 col-span-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <div>
                  <p className="text-lg font-bold text-purple-400">
                    {job.recordsEnriched}
                  </p>
                  <p className="text-xs text-muted-foreground">Enriched</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Timing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Started At
              </p>
              <p className="text-sm text-foreground">
                {formatDate(job.startedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Completed At
              </p>
              <p className="text-sm text-foreground">
                {formatDate(job.completedAt)}
              </p>
            </div>
          </div>

          {/* Error indicator */}
          {job.errorsJson && Object.keys(job.errorsJson).length > 0 && (
            <>
              <Separator className="bg-border/50" />
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <p className="text-xs text-red-400 font-medium">
                  This job has errors. View full details for more information.
                </p>
              </div>
            </>
          )}

          <Separator className="bg-border/50" />

          {/* View Full Details Button */}
          <Link href={`/scraping/${encodeURIComponent(job.id)}`}>
            <Button className="w-full bg-gold/20 text-gold hover:bg-gold/30 border border-gold/30">
              View Full Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
