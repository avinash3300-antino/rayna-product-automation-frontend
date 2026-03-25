// ---- KPI Stat Cards ----
export interface ProductStatusCounts {
  draft: number;
  staged: number;
  published: number;
}

export interface KpiStats {
  totalProducts: number;
  productsByStatus: ProductStatusCounts;
  activeIngestionJobs: number;
  isIngestionRunning: boolean;
  queueACount: number;
  queueBCount: number;
}

// ---- Pipeline Health ----
export type PipelineStage =
  | "ingest"
  | "classify"
  | "map"
  | "content"
  | "review"
  | "stage"
  | "publish";

export interface PipelineStageData {
  id: PipelineStage;
  label: string;
  count: number;
  color: string;
}

// ---- Recent Jobs ----
export type JobStatus = "completed" | "running" | "failed" | "queued";
export type RunType = "full" | "incremental" | "manual";

export interface RecentJob {
  id: string;
  destination: string;
  runType: RunType;
  status: JobStatus;
  records: number;
  startedAt: string;
  durationMs: number;
}

// ---- Data Freshness Heatmap ----
export type DataType =
  | "hotel_pricing"
  | "attraction_prices"
  | "operating_hours"
  | "descriptions"
  | "images";

export type FreshnessLevel = "fresh" | "warning" | "stale";

export interface FreshnessRow {
  destination: string;
  cells: Record<DataType, { level: FreshnessLevel; lastUpdated: string }>;
}

// ---- Booking Source Health ----
export type HealthStatus = "healthy" | "degraded" | "down";

export interface BookingSource {
  id: string;
  name: string;
  status: HealthStatus;
  lastPing: string;
  responseMs: number;
}

// ---- Charts ----
export interface ProductsByDestination {
  destination: string;
  count: number;
}

export interface ProductsByCategory {
  category: string;
  count: number;
  color: string;
}
