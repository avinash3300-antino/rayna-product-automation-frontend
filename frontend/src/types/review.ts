import type { ProductCategory } from "./destinations";
import type { NormalizedPayload } from "./classification";
import type { ContentFields } from "./content-review";

export type ReviewStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "escalated";

// ---- Single unified review record ----
export interface ReviewRecord {
  id: string;
  productName: string;
  destination: string;
  category: ProductCategory;
  status: ReviewStatus;
  assignedTo: string | null;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;

  // Classification data
  normalizedPayload: NormalizedPayload;
  source: string;
  confidenceScore: number;
  predictedCategory: ProductCategory;
  classifierRationale: string;
  finalCategory: ProductCategory | null;
  reviewNotes: string | null;

  // Content data
  primaryKeyword: string;
  generationAttempt: number;
  maxAttempts: number;
  contentFields: ContentFields;
  publishFlag: boolean;
}

// ---- Queue Stats ----
export interface ReviewQueueStats {
  pending: number;
  assignedToMe: number;
  inReview: number;
  completedToday: number;
}

// ---- Filter State ----
export interface ReviewFilters {
  destination: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  status: string;
}
