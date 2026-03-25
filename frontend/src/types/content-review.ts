import type { ProductCategory } from "./destinations";

// ---- Review Status ----
export type ContentReviewStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "escalated";

// ---- Tab Keys ----
export type ContentTabKey =
  | "short_desc"
  | "long_desc"
  | "meta"
  | "faq"
  | "schema"
  | "tags";

// ---- FAQ Item ----
export interface FaqItem {
  question: string;
  answer: string;
}

// ---- Content Fields (AI-generated) ----
export interface ContentFields {
  shortDesc: string;
  longDesc: string;
  metaTitle: string;
  metaDescription: string;
  faq: FaqItem[];
  schemaMarkup: string;
  tags: string[];
}

// ---- Content Record ----
export interface ContentRecord {
  id: string;
  productName: string;
  destination: string;
  category: ProductCategory;
  generationAttempt: number;
  maxAttempts: number;
  primaryKeyword: string;
  contentFields: ContentFields;
  assignedTo: string | null;
  status: ContentReviewStatus;
  publishFlag: boolean;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Queue Stats ----
export interface ContentQueueStats {
  pending: number;
  assignedToMe: number;
  inReview: number;
  completedToday: number;
}

// ---- Filter State ----
export interface ContentFilters {
  destination: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  status: string;
}
