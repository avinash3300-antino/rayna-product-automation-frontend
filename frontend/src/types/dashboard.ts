// ---- Backend response types ----
export interface StatusBreakdown {
  draft: number;
  enriched: number;
  review_ready: number;
  approved: number;
  published: number;
}

export interface KpiStats {
  total_products: number;
  total_activities: number;
  total_cruises: number;
  by_status: StatusBreakdown;
  active_scrape_jobs: number;
  is_scraping_running: boolean;
}

export interface PipelineStageData {
  id: string;
  label: string;
  count: number;
}

export interface RecentJobItem {
  id: string;
  destination: string;
  category: string;
  product_type: string;
  status: string;
  records_found: number;
  records_saved: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  duration_ms: number;
}

export interface ProductsByDestination {
  destination: string;
  count: number;
}

export interface ProductsByCategory {
  category: string;
  count: number;
}

export interface DashboardStats {
  kpi: KpiStats;
  pipeline_stages: PipelineStageData[];
  recent_jobs: RecentJobItem[];
  products_by_destination: ProductsByDestination[];
  products_by_category: ProductsByCategory[];
}

// ---- Data Freshness Heatmap (kept static — no backend tracking yet) ----
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

// ---- Booking Source Health (kept static — no backend tracking yet) ----
export type HealthStatus = "healthy" | "degraded" | "down";

export interface BookingSource {
  id: string;
  name: string;
  status: HealthStatus;
  lastPing: string;
  responseMs: number;
}
