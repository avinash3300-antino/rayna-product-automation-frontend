"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  FileJson,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DiscoveryRun, DiscoveryRunStatus } from "@/types/discovery";

interface DiscoveryRunStatusProps {
  run: DiscoveryRun;
}

function StatusBadge({ status }: { status: DiscoveryRunStatus }) {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-muted text-muted-foreground border-0">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case "running":
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-0">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Running
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border-0">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-500/10 text-red-500 border-0">
          <XCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatTimestamp(ts: string | null): string {
  if (!ts) return "--";
  return new Date(ts).toLocaleString();
}

interface CollapsibleJsonProps {
  title: string;
  data: Record<string, unknown> | null;
}

function CollapsibleJson({ title, data }: CollapsibleJsonProps) {
  const [open, setOpen] = useState(false);

  if (!data) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      <Button
        variant="ghost"
        className="w-full justify-between px-4 py-2 h-auto font-medium text-sm"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2">
          <FileJson className="h-4 w-4 text-muted-foreground" />
          {title}
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
      {open && (
        <div className="px-4 pb-4">
          <pre className="text-xs bg-muted/50 rounded-md p-3 overflow-auto max-h-64 whitespace-pre-wrap break-all">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export function DiscoveryRunStatusCard({ run }: DiscoveryRunStatusProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Discovery Run</CardTitle>
            <CardDescription className="font-mono text-xs mt-1">
              {run.id}
            </CardDescription>
          </div>
          <StatusBadge status={run.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Sources Found</p>
            <p className="text-xl font-semibold">{run.sourcesFound}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Sources Approved</p>
            <p className="text-xl font-semibold">{run.sourcesApproved}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Started At</p>
            <p className="text-sm">{formatTimestamp(run.startedAt)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Completed At</p>
            <p className="text-sm">{formatTimestamp(run.completedAt)}</p>
          </div>
        </div>

        {/* Error Message */}
        {run.errorMessage && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-medium text-red-500">Error</p>
            <p className="text-sm text-red-400 mt-1">{run.errorMessage}</p>
          </div>
        )}

        {/* Collapsible Raw Data */}
        {(run.ahrefsResults ||
          run.searchapiResults ||
          run.claudeSynthesis) && (
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-muted-foreground">
              Raw Results
            </p>
            <CollapsibleJson title="Ahrefs Results" data={run.ahrefsResults} />
            <CollapsibleJson
              title="SearchAPI Results"
              data={run.searchapiResults}
            />
            <CollapsibleJson
              title="Claude Synthesis"
              data={run.claudeSynthesis}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
