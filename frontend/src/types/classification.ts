import type { ProductCategory } from "./destinations";

// ---- Review Status ----
export type ClassificationReviewStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "escalated";

// ---- Review Decision ----
export type ReviewDecision = "approve" | "reject" | "escalate";

// ---- Normalized Payload (raw ingested data) ----
export interface NormalizedPayload {
  id: string;
  name: string;
  description: string;
  source_url: string;
  location: {
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  pricing: {
    currency: string;
    amount: number;
    per: string;
  } | null;
  images: string[];
  raw_category: string;
  source_metadata: Record<string, string | number | boolean>;
}

// ---- Classification Record ----
export interface ClassificationRecord {
  id: string;
  normalizedPayload: NormalizedPayload;
  source: string;
  destination: string;
  predictedCategory: ProductCategory;
  confidenceScore: number;
  classifierRationale: string;
  assignedTo: string | null;
  status: ClassificationReviewStatus;
  finalCategory: ProductCategory | null;
  reviewNotes: string | null;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Queue Stats ----
export interface ClassificationQueueStats {
  pending: number;
  assignedToMe: number;
  inReview: number;
  completedToday: number;
}

// ---- Filter State ----
export interface ClassificationFilters {
  destination: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  confidenceMin: number;
  confidenceMax: number;
}

// ---- Review Form State ----
export interface ReviewFormState {
  finalCategory: ProductCategory;
  notes: string;
}
