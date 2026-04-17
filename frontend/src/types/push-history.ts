import type { PushEnvironment, RecordCounts, FieldChange } from "./staging";

// ---- Push Batch Status (expanded) ----
export type PushBatchStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "failed"
  | "pending_approval"
  | "approved"
  | "rolled_back";

// ---- Status Config ----
export const PUSH_BATCH_STATUS_CONFIG: Record<
  PushBatchStatus,
  { label: string; color: string }
> = {
  pending: {
    label: "Pending",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  failed: {
    label: "Failed",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  pending_approval: {
    label: "Pending Approval",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  approved: {
    label: "Approved",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  rolled_back: {
    label: "Rolled Back",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
};

// ---- Batch Item (per-record breakdown) ----
export interface BatchItem {
  id: string;
  entityType: string;
  entityId: string;
  entityName: string;
  operation: "create" | "update" | "delete";
  status: "success" | "failed" | "skipped";
  externalRecordId: string | null;
  errorMessage: string | null;
  changes: FieldChange[];
}

// ---- Push Batch (extended) ----
export interface PushBatch {
  id: string;
  destination: string;
  environment: PushEnvironment;
  status: PushBatchStatus;
  records: RecordCounts & { skipped: number };
  triggeredBy: string;
  approvedBy: string | null;
  triggeredAt: string;
  completedAt: string | null;
  approvedAt: string | null;
  duration: number | null; // milliseconds
  items: BatchItem[];
}

// ---- Rollback History Entry ----
export interface RollbackHistoryEntry {
  id: string;
  originalBatchId: string;
  destination: string;
  initiatedBy: string;
  reason: string;
  status: "completed" | "failed" | "in_progress";
  recordsAffected: number;
  initiatedAt: string;
  completedAt: string | null;
}

// ---- Summary Stats ----
export interface PushHistorySummary {
  totalPushes: number;
  totalCreated: number;
  totalUpdated: number;
  totalFailed: number;
}
