export type DiscoveryRunStatus = "pending" | "running" | "completed" | "failed";

export interface DiscoveryRun {
  id: string;
  cityId: string;
  category: string;
  productType: string;
  status: DiscoveryRunStatus;
  ahrefsResults: Record<string, unknown> | null;
  searchapiResults: Record<string, unknown> | null;
  claudeSynthesis: Record<string, unknown> | null;
  sourcesFound: number;
  sourcesApproved: number;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface ScrapeSource {
  id: string;
  cityId: string;
  category: string;
  productType: string;
  sourceName: string;
  sourceUrl: string;
  tier: number;
  authorityScore: number | null;
  approved: boolean;
  approvedAt: string | null;
  addedBy: string;
  isActive: boolean;
  lastScrapedAt: string | null;
  createdAt: string;
}
