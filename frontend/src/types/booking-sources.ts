import type { ProductCategory } from "./destinations";

// ---- Booking Mode ----
export type BookingMode = "api" | "manual" | "email";

// ---- Source Status ----
export type SourceStatus = "active" | "inactive";

// ---- Health Status ----
export type SourceHealthStatus = "online" | "degraded" | "offline";

// ---- Mapping Status ----
export type MappingStatus = "complete" | "partial" | "unmapped";

// ---- Booking Source ----
export interface BookingSource {
  id: string;
  name: string;
  code: string;
  category: ProductCategory;
  mode: BookingMode;
  endpointUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  marginPriorityScore: number; // 1–10
  isActive: boolean;
  ingestionSourceId: string | null;
  healthStatus: SourceHealthStatus;
  lastPingTime: string;
  responseTimeMs: number;
  createdAt: string;
  updatedAt: string;
}

// ---- Product Source Mapping ----
export interface ProductSourceMapping {
  id: string;
  productName: string;
  productCategory: ProductCategory;
  destination: string;
  source1Id: string | null;
  source2Id: string | null;
  source3Id: string | null;
  mappingStatus: MappingStatus;
  lastUpdated: string;
}

// ---- Health Check Log Entry ----
export interface HealthCheckLog {
  id: string;
  sourceId: string;
  sourceName: string;
  status: SourceHealthStatus;
  responseTimeMs: number;
  errorMessage: string | null;
  checkedAt: string;
}

// ---- Response Time Sparkline Data Point ----
export interface ResponseTimePoint {
  time: string;
  ms: number;
}

// ---- Source Health Card ----
export interface SourceHealthCard {
  sourceId: string;
  sourceName: string;
  category: ProductCategory;
  status: SourceHealthStatus;
  responseTimeMs: number;
  lastChecked: string;
  errorMessage: string | null;
  sparkline: ResponseTimePoint[];
  affectedProductCount: number;
}

// ---- Config Maps ----
export const BOOKING_MODE_CONFIG: Record<
  BookingMode,
  { label: string; color: string }
> = {
  api: {
    label: "API",
    color: "bg-blue-500/15 text-blue-600 border-blue-500/25",
  },
  manual: {
    label: "Manual",
    color: "bg-amber-500/15 text-amber-600 border-amber-500/25",
  },
  email: {
    label: "Email",
    color: "bg-purple-500/15 text-purple-600 border-purple-500/25",
  },
};

export const HEALTH_STATUS_CONFIG: Record<
  SourceHealthStatus,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  online: {
    label: "Online",
    dotColor: "bg-emerald-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
  },
  degraded: {
    label: "Degraded",
    dotColor: "bg-amber-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
  },
  offline: {
    label: "Offline",
    dotColor: "bg-red-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-600",
  },
};

export const MAPPING_STATUS_CONFIG: Record<
  MappingStatus,
  { label: string; color: string }
> = {
  complete: {
    label: "Complete",
    color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25",
  },
  partial: {
    label: "Partial",
    color: "bg-amber-500/15 text-amber-600 border-amber-500/25",
  },
  unmapped: {
    label: "Unmapped",
    color: "bg-red-500/15 text-red-600 border-red-500/25",
  },
};

export const CATEGORY_ICON_MAP: Partial<Record<string, string>> = {
  activities: "🎯",
  cruises: "🚢",
  hotels: "🏨",
};

export const CATEGORY_LABELS: Partial<Record<string, string>> = {
  activities: "Activities",
  cruises: "Cruises",
  hotels: "Hotels",
};
