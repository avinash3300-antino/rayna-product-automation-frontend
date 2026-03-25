import type { ProductCategory } from "./destinations";

// ---- Batch Status ----
export type BatchStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | "pushed"
  | "rolled_back";

// ---- Push Environment ----
export type PushEnvironment = "staging" | "production";

// ---- Record Change Type ----
export type RecordChangeType = "created" | "updated" | "failed";

// ---- Record Counts ----
export interface RecordCounts {
  created: number;
  updated: number;
  failed: number;
}

// ---- Diff Field Change ----
export interface FieldChange {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

// ---- Batch Product Record ----
export interface BatchProductRecord {
  id: string;
  productId: string;
  productName: string;
  destination: string;
  category: ProductCategory;
  changeType: RecordChangeType;
  changes: FieldChange[];
  completeness: number;
  qualityScore: number;
}

// ---- Staging Batch ----
export interface StagingBatch {
  id: string;
  jobId: string;
  destination: string;
  environment: PushEnvironment;
  status: BatchStatus;
  records: RecordCounts;
  products: BatchProductRecord[];
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewNotes: string | null;
  pushedAt: string | null;
  pushedBy: string | null;
}

// ---- Push History Entry ----
export interface PushHistoryEntry {
  id: string;
  batchId: string;
  destination: string;
  environment: PushEnvironment;
  status: "success" | "failed" | "rolled_back";
  records: RecordCounts;
  triggeredBy: string;
  pushedAt: string;
  rolledBackAt: string | null;
  rollbackReason: string | null;
}

// ---- Batch Status Labels & Colors ----
export const BATCH_STATUS_CONFIG: Record<
  BatchStatus,
  { label: string; color: string }
> = {
  pending_approval: {
    label: "Pending Approval",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  approved: {
    label: "Approved",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  pushed: {
    label: "Pushed",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  rolled_back: {
    label: "Rolled Back",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
};

export const PUSH_STATUS_CONFIG: Record<
  PushHistoryEntry["status"],
  { label: string; color: string }
> = {
  success: {
    label: "Success",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  failed: {
    label: "Failed",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  rolled_back: {
    label: "Rolled Back",
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
};
