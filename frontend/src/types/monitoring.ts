import type { HealthStatus } from "./dashboard";

// ---- Source Health ----
export interface SourceHealthEntry {
  id: string;
  name: string;
  status: HealthStatus;
  lastCheckTime: string;
  responseMs: number;
  uptime: number; // percentage
}

// ---- Queue Lengths ----
export interface QueueLengthData {
  timestamp: string;
  queueA: number;
  queueB: number;
  enrichment: number;
  error: number;
}

// ---- Error Queue ----
export type ErrorStage =
  | "ingestion"
  | "classification"
  | "enrichment"
  | "content_generation"
  | "staging";

export type ErrorQueueStatus = "open" | "retrying" | "resolved" | "dismissed";

export interface ErrorQueueEntry {
  id: string;
  stage: ErrorStage;
  entityType: string;
  entityId: string;
  errorCode: string;
  errorMessage: string;
  retryCount: number;
  status: ErrorQueueStatus;
  assignedTo: string | null;
  createdAt: string;
}

// ---- Job Metrics Timeline ----
export interface JobMetricDay {
  date: string;
  recordsProcessed: number;
  jobsRun: number;
  failures: number;
}

// ---- Notifications ----
export type NotificationType =
  | "ingestion"
  | "error"
  | "approval"
  | "push"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
  entityLink: string | null;
}

// ---- Config maps ----
export const SOURCE_STATUS_CONFIG: Record<
  HealthStatus,
  { label: string; dotColor: string; bgColor: string }
> = {
  healthy: {
    label: "Healthy",
    dotColor: "bg-emerald-500",
    bgColor: "",
  },
  degraded: {
    label: "Degraded",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-500/5",
  },
  down: {
    label: "Down",
    dotColor: "bg-red-500",
    bgColor: "bg-red-500/5",
  },
};

export const ERROR_STAGE_LABELS: Record<ErrorStage, string> = {
  ingestion: "Ingestion",
  classification: "Classification",
  enrichment: "Enrichment",
  content_generation: "Content Gen",
  staging: "Staging",
};

export const ERROR_STATUS_CONFIG: Record<
  ErrorQueueStatus,
  { label: string; color: string }
> = {
  open: {
    label: "Open",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  retrying: {
    label: "Retrying",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  resolved: {
    label: "Resolved",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  dismissed: {
    label: "Dismissed",
    color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  },
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  ingestion: "Ingestion",
  error: "Errors",
  approval: "Approvals",
  push: "Pushes",
  system: "System",
};
