export type ScrapeJobStatus =
  | "pending"
  | "scraping"
  | "extracting"
  | "saving"
  | "enriching"
  | "completed"
  | "failed";

export interface ScrapeJob {
  id: string;
  discoveryRunId: string | null;
  cityId: string;
  category: string;
  productType: string;
  status: ScrapeJobStatus;
  sourceId: string | null;
  sourceUrl: string;
  scrapeType: string;
  pagesScraped: number;
  recordsFound: number;
  recordsSaved: number;
  recordsSkippedDup: number;
  recordsEnriched: number;
  errorsJson: Record<string, unknown> | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}
