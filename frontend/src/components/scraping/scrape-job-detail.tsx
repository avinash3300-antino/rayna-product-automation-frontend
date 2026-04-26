"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Clock,
  FileText,
  Database,
  SkipForward,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScrapeJob } from "@/hooks/api/use-scraping";
import type { ScrapeJobStatus } from "@/types/scraping";

interface ScrapeJobDetailProps {
  jobId: string;
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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function computeDuration(
  startedAt: string | null,
  completedAt: string | null
): string {
  if (!startedAt) return "\u2014";
  const start = new Date(startedAt).getTime();
  const end = completedAt ? new Date(completedAt).getTime() : Date.now();
  const diffMs = end - start;

  if (diffMs < 1000) return `${diffMs}ms`;
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainSec = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainSec}s`;
  const hours = Math.floor(minutes / 60);
  const remainMin = minutes % 60;
  return `${hours}h ${remainMin}m ${remainSec}s`;
}

export function ScrapeJobDetail({ jobId }: ScrapeJobDetailProps) {
  const { data: job, isLoading, isError } = useScrapeJob(jobId);
  const [errorsExpanded, setErrorsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link href="/scraping">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scraping Jobs
          </Button>
        </Link>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-3 text-sm text-muted-foreground">
            Loading job details...
          </span>
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="space-y-6">
        <Link href="/scraping">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scraping Jobs
          </Button>
        </Link>
        <Card className="p-8 text-center">
          <AlertTriangle className="h-8 w-8 text-amber-600 mx-auto mb-3" />
          <h2 className="text-lg font-semibold">
            Job Not Found
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            The scrape job &quot;{jobId}&quot; could not be loaded.
          </p>
        </Card>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[job.status];
  const isRunning =
    job.status === "scraping" ||
    job.status === "extracting" ||
    job.status === "saving" ||
    job.status === "enriching";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/scraping"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Scraping Jobs
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">
          Job {job.id.slice(0, 8)}...
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/scraping">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">
              Scrape Job Detail
            </h1>
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
            {isRunning && (
              <span className="text-xs text-muted-foreground">
                (auto-refreshing)
              </span>
            )}
          </div>

          {/* Source URL */}
          <div className="flex items-center gap-2 ml-12 mt-2">
            <span className="text-sm text-muted-foreground">Source:</span>
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-mono flex items-center gap-1 max-w-[500px] truncate"
            >
              {job.sourceUrl}
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 mt-3 ml-12 text-sm text-muted-foreground">
            <span className="capitalize">
              Category: <span className="text-foreground">{job.category}</span>
            </span>
            <span className="capitalize">
              Scrape Type:{" "}
              <span className="text-foreground">{job.scrapeType}</span>
            </span>
            {job.discoveryRunId && (
              <span className="font-mono text-xs">
                Discovery: {job.discoveryRunId.slice(0, 8)}...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {job.pagesScraped}
              </p>
              <p className="text-sm text-muted-foreground">Pages Scraped</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {job.recordsFound}
              </p>
              <p className="text-sm text-muted-foreground">Records Found</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Database className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {job.recordsSaved}
              </p>
              <p className="text-sm text-muted-foreground">Records Saved</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <SkipForward className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {job.recordsSkippedDup}
              </p>
              <p className="text-sm text-muted-foreground">Skipped Dup</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {job.recordsEnriched}
              </p>
              <p className="text-sm text-muted-foreground">Records Enriched</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Timing Details */}
      <Card className="p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Timing
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Started At
            </p>
            <p className="text-sm">{formatDate(job.startedAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Completed At
            </p>
            <p className="text-sm">
              {formatDate(job.completedAt)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Duration
            </p>
            <p className="text-sm">
              {computeDuration(job.startedAt, job.completedAt)}
              {isRunning && (
                <span className="ml-1 text-xs text-muted-foreground">
                  (in progress)
                </span>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Error Details (collapsible) */}
      {job.errorsJson && Object.keys(job.errorsJson).length > 0 && (
        <Card className="border-red-500/20 overflow-hidden">
          <button
            onClick={() => setErrorsExpanded(!errorsExpanded)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold">Error Details</h3>
              <span className="text-xs text-muted-foreground">
                ({Object.keys(job.errorsJson).length} error
                {Object.keys(job.errorsJson).length > 1 ? "s" : ""})
              </span>
            </div>
            {errorsExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {errorsExpanded && (
            <div className="border-t p-4">
              <pre className="text-xs text-red-600 bg-muted rounded-lg p-4 overflow-x-auto max-h-[400px] overflow-y-auto">
                {JSON.stringify(job.errorsJson, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      )}

      {/* Created At info */}
      <div className="text-xs text-muted-foreground text-right">
        Job created at: {formatDate(job.createdAt)}
      </div>
    </div>
  );
}
