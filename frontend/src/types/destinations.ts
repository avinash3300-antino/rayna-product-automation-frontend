// ---- Destination Status ----
export type DestinationStatus = "active" | "inactive";

// ---- Product Categories ----
export type ProductCategory =
  | "hotels"
  | "attractions"
  | "transfers"
  | "restaurants";

export type ProductCounts = Record<ProductCategory, number>;

// ---- Ingestion Run ----
export type IngestionRunStatus = "completed" | "running" | "failed" | "queued";

export interface LastIngestionRun {
  date: string;
  status: IngestionRunStatus;
  recordsProcessed: number;
  durationMs: number;
}

// ---- Intelligence Filter ----
export interface IntelligenceFilterInfo {
  lastRunDate: string | null;
  keywordsFound: number;
  sourcesApproved: number;
}

// ---- Core Destination ----
export interface Destination {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  region: string;
  city: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  status: DestinationStatus;
  productCounts: ProductCounts;
  lastIngestionRun: LastIngestionRun | null;
  intelligenceFilter: IntelligenceFilterInfo;
}

// ---- Add Destination Form ----
export interface AddDestinationFormData {
  name: string;
  country: string;
  region: string;
  city: string;
  timezone: string;
  latitude: string;
  longitude: string;
  enabledCategories: ProductCategory[];
}

// ---- Intelligence Summary: Keywords ----
export type KeywordIntent =
  | "informational"
  | "transactional"
  | "navigational"
  | "commercial";

export interface TopKeyword {
  id: string;
  keyword: string;
  category: ProductCategory;
  volume: number;
  difficulty: number;
  intent: KeywordIntent;
}

// ---- Intelligence Summary: Sources ----
export type SourceType =
  | "api"
  | "website"
  | "aggregator"
  | "government"
  | "review_platform";

export type TosStatus = "compliant" | "pending_review" | "restricted";
export type IngestionMethod = "api" | "scrape" | "feed" | "manual";

export interface ApprovedSource {
  id: string;
  name: string;
  type: SourceType;
  categories: ProductCategory[];
  relevanceScore: number;
  tosStatus: TosStatus;
  ingestionMethod: IngestionMethod;
  priorityRank: number;
}

// ---- Intelligence Summary ----
export interface IntelligenceSummary {
  destinationId: string;
  topKeywords: TopKeyword[];
  approvedSources: ApprovedSource[];
}
