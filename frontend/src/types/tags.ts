import type { TagDimension } from "./products";

// ---- Enhanced Tag Model ----
export interface Tag {
  id: string;
  name: string;
  code: string;
  dimension: TagDimension;
  parentId: string | null;
  description: string;
  children?: Tag[];
  productCount: number;
}

// ---- Tag Form Data (for CRUD dialog) ----
export interface TagFormData {
  name: string;
  code: string;
  dimension: TagDimension;
  parentId: string;
  description: string;
}

// ---- AI Tag Suggestion ----
export type SuggestionStatus = "pending" | "accepted" | "rejected";

export interface AiTagSuggestion {
  id: string;
  productId: string;
  productName: string;
  suggestedTag: {
    tagId: string;
    tagName: string;
    dimension: TagDimension;
  };
  confidence: number;
  source: string;
  reason: string;
  status: SuggestionStatus;
  createdAt: string;
}

// ---- Dimension color mappings for badges ----
export const TAG_DIMENSION_COLORS: Record<TagDimension, string> = {
  budget_tier: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  travel_theme: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  audience: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  season: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  accessibility: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};
