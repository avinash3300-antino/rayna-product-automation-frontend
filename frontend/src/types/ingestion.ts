import type { JobStatus, RunType } from "./dashboard";

export type { JobStatus, RunType };

// ---- Source breakdown within a job ----
export type SourceIngestionStatus =
  | "fetching"
  | "completed"
  | "failed"
  | "waiting";

export interface IngestionSourceBreakdown {
  id: string;
  sourceName: string;
  category: string;
  recordsFetched: number;
  errors: number;
  status: SourceIngestionStatus;
}

// ---- Error log entry ----
export interface IngestionError {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  severity: "warning" | "error";
}

// ---- Active (running) job ----
export interface ActiveIngestionJob {
  id: string;
  destination: string;
  runType: RunType;
  status: "running";
  recordsFetched: number;
  estimatedTotal: number;
  sources: IngestionSourceBreakdown[];
  errors: IngestionError[];
  startedAt: string;
}

// ---- Historical job (any status) ----
export interface IngestionJob {
  id: string;
  destination: string;
  runType: RunType;
  status: JobStatus;
  recordsFetched: number;
  estimatedTotal: number;
  errors: IngestionError[];
  sources: IngestionSourceBreakdown[];
  startedAt: string;
  endedAt: string | null;
  durationMs: number;
  relatedPushBatchIds: string[];
}
