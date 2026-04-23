"use client";

import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  Brain,
  Database,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useScrapeJob } from "@/hooks/api/use-scraping";
import type { ScrapeJobStatus } from "@/types/scraping";

/* ── Friendly messages for each pipeline step ── */
const STATUS_CONFIG: Record<
  ScrapeJobStatus,
  { message: string; color: string }
> = {
  pending: { message: "Waiting in queue...", color: "text-gray-400" },
  scraping: {
    message: "Scraping website content...",
    color: "text-blue-400",
  },
  extracting: {
    message: "Extracting activities with AI...",
    color: "text-amber-400",
  },
  saving: {
    message: "Saving & deduplicating...",
    color: "text-blue-400",
  },
  enriching: {
    message: "Enriching content & generating images...",
    color: "text-purple-400",
  },
  completed: { message: "Done!", color: "text-emerald-400" },
  failed: { message: "Failed", color: "text-red-400" },
};

/* ── Progress bar value per status ── */
const STATUS_ORDER: ScrapeJobStatus[] = [
  "pending",
  "scraping",
  "extracting",
  "saving",
  "enriching",
  "completed",
];

function getStatusProgress(status: ScrapeJobStatus): number {
  if (status === "failed") return 100;
  const index = STATUS_ORDER.indexOf(status);
  return Math.round(((index + 1) / STATUS_ORDER.length) * 100);
}

/* ── Status icon with animation for active steps ── */
function StatusIcon({ status }: { status: ScrapeJobStatus }) {
  const cls = "h-4 w-4";
  switch (status) {
    case "pending":
      return <Clock className={`${cls} text-gray-400`} />;
    case "scraping":
      return <Globe className={`${cls} text-blue-400 animate-pulse`} />;
    case "extracting":
      return <Brain className={`${cls} text-amber-400 animate-pulse`} />;
    case "saving":
      return <Database className={`${cls} text-blue-400 animate-pulse`} />;
    case "enriching":
      return <Sparkles className={`${cls} text-purple-400 animate-pulse`} />;
    case "completed":
      return <CheckCircle2 className={`${cls} text-emerald-400`} />;
    case "failed":
      return <XCircle className={`${cls} text-red-400`} />;
  }
}

/* ── Truncate URL for display ── */
function truncateUrl(url: string, maxLen = 50) {
  try {
    const u = new URL(url);
    const short = u.hostname + u.pathname;
    return short.length > maxLen ? short.slice(0, maxLen) + "..." : short;
  } catch {
    return url.length > maxLen ? url.slice(0, maxLen) + "..." : url;
  }
}

/* ── Single job progress card ── */
function JobProgressCard({ jobId }: { jobId: string }) {
  const { data: job } = useScrapeJob(jobId);
  if (!job) {
    return (
      <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  const progress = getStatusProgress(job.status);
  const config = STATUS_CONFIG[job.status];
  const isActive = !["completed", "failed"].includes(job.status);
  const fatalError =
    job.status === "failed" && job.errorsJson
      ? (job.errorsJson as { fatal?: string }).fatal
      : null;

  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
      {/* Header: icon + URL + badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <StatusIcon status={job.status} />
          <span
            className="text-sm font-mono text-[#C9A84C] truncate"
            title={job.sourceUrl}
          >
            {truncateUrl(job.sourceUrl)}
          </span>
        </div>
        {job.status === "completed" && (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-xs shrink-0">
            {job.recordsSaved} saved
          </Badge>
        )}
        {job.status === "failed" && (
          <Badge className="bg-red-500/10 text-red-400 border-0 text-xs shrink-0">
            Failed
          </Badge>
        )}
      </div>

      {/* Progress bar */}
      <Progress value={progress} className="h-1.5" />

      {/* Status message + counts */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className={isActive ? "animate-pulse" : ""}>
          {config.message}
          {job.status === "completed" &&
            ` ${job.recordsSaved} activities saved`}
          {fatalError && `: ${fatalError.slice(0, 80)}`}
        </span>
        {job.recordsFound > 0 && (
          <span className="shrink-0 ml-2">
            {job.recordsFound} found &middot; {job.recordsSaved} saved &middot;{" "}
            {job.recordsSkippedDup} dup
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Main progress panel ── */
interface PipelineProgressPanelProps {
  jobIds: string[];
}

export function PipelineProgressPanel({ jobIds }: PipelineProgressPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Loader2 className="h-4 w-4 animate-spin text-[#C9A84C]" />
          Pipeline Progress
          <Badge variant="outline" className="ml-auto text-xs">
            {jobIds.length} source{jobIds.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Each source is processed through the full pipeline. Status updates
          every few seconds.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobIds.map((id) => (
          <JobProgressCard key={id} jobId={id} />
        ))}
      </CardContent>
    </Card>
  );
}
