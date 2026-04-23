// ---- Destination Status ----
export type DestinationStatus = "active" | "inactive";

// ---- Product Categories ----
export type ProductCategory = "activities" | "cruises";

export type ProductCounts = Record<ProductCategory, number>;

// ---- Scrape Run ----
export type ScrapeRunStatus = "completed" | "running" | "failed" | "queued" | "pending";

export interface LastScrapeRun {
  date: string;
  status: ScrapeRunStatus;
  recordsFound: number;
  durationMs: number;
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
  lastScrapeRun: LastScrapeRun | null;
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
