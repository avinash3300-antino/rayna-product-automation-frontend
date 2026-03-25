import type { ProductCategory } from "./destinations";

// ---- Product Status ----
export type ProductStatus = "draft" | "staged" | "published" | "archived";

// ---- Tag Dimensions ----
export type TagDimension =
  | "budget_tier"
  | "travel_theme"
  | "audience"
  | "season"
  | "accessibility";

export interface ProductTag {
  dimension: TagDimension;
  value: string;
}

// ---- Booking Source ----
export interface ProductBookingSource {
  id: string;
  name: string;
  url: string;
}

// ---- Product Location ----
export interface ProductLocation {
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

// ---- Product Pricing ----
export interface ProductPricing {
  currency: string;
  amount: number;
  per: string;
}

// ---- Product Attributes ----
export interface ProductAttributes {
  location: ProductLocation;
  pricing: ProductPricing | null;
  starRating: number | null;
  duration: string | null;
  operatingHours: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  website: string | null;
}

// ---- FAQ Item ----
export interface ProductFaqItem {
  question: string;
  answer: string;
}

// ---- Product Content ----
export interface ProductContent {
  shortDesc: string;
  longDesc: string;
  metaTitle: string;
  metaDescription: string;
  faq: ProductFaqItem[];
  schemaMarkup: string;
}

// ---- Product Media ----
export interface ProductMedia {
  images: string[];
  videos: string[];
}

// ---- Quality Check ----
export type QualityCheckStatus = "pass" | "fail" | "warning" | "skipped";

export interface QualityCheck {
  id: string;
  name: string;
  description: string;
  status: QualityCheckStatus;
  details: string | null;
  checkedAt: string;
}

// ---- History Entry ----
export type HistoryAction =
  | "created"
  | "updated"
  | "status_changed"
  | "content_generated"
  | "tags_updated"
  | "booking_source_assigned"
  | "published"
  | "archived";

export interface HistoryEntry {
  id: string;
  action: HistoryAction;
  description: string;
  user: string;
  timestamp: string;
}

// ---- Core Product ----
export interface Product {
  id: string;
  name: string;
  destination: string;
  category: ProductCategory;
  status: ProductStatus;
  completeness: number;
  heroImage: string | null;
  tags: ProductTag[];
  bookingSource: ProductBookingSource | null;
  publishFlag: boolean;
  attributes: ProductAttributes;
  content: ProductContent;
  media: ProductMedia;
  qualityChecks: QualityCheck[];
  history: HistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

// ---- Filter State ----
export type CompletenessRange = [number, number];

export interface ProductFilters {
  search: string;
  destinations: string[];
  categories: ProductCategory[];
  statuses: ProductStatus[];
  completenessRange: CompletenessRange;
  tagFilters: Record<TagDimension, string[]>;
  hasBookingSource: boolean | null;
  publishFlag: boolean | null;
}

// ---- View Mode ----
export type ProductViewMode = "grid" | "table";

// ---- Tag dimension labels ----
export const TAG_DIMENSION_LABELS: Record<TagDimension, string> = {
  budget_tier: "Budget Tier",
  travel_theme: "Travel Theme",
  audience: "Audience",
  season: "Season",
  accessibility: "Accessibility",
};
