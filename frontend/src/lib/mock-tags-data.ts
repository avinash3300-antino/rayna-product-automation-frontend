import type { Tag, AiTagSuggestion } from "@/types/tags";
import type { TagDimension } from "@/types/products";

// ---- Flat Tag List (parent-child via parentId) ----
export const MOCK_TAGS: Tag[] = [
  // Budget Tier
  { id: "tag-bt-1", name: "Budget", code: "budget", dimension: "budget_tier", parentId: null, description: "Affordable options for cost-conscious travelers", productCount: 4 },
  { id: "tag-bt-1a", name: "Backpacker", code: "backpacker", dimension: "budget_tier", parentId: "tag-bt-1", description: "Ultra-budget hostels and dorms", productCount: 1 },
  { id: "tag-bt-1b", name: "Value", code: "value", dimension: "budget_tier", parentId: "tag-bt-1", description: "Best value-for-money picks", productCount: 2 },
  { id: "tag-bt-2", name: "Mid-Range", code: "mid_range", dimension: "budget_tier", parentId: null, description: "Balanced comfort and affordability", productCount: 6 },
  { id: "tag-bt-3", name: "Luxury", code: "luxury", dimension: "budget_tier", parentId: null, description: "Premium experiences and 5-star service", productCount: 8 },
  { id: "tag-bt-3a", name: "Ultra-Luxury", code: "ultra_luxury", dimension: "budget_tier", parentId: "tag-bt-3", description: "Exclusive top-tier experiences", productCount: 3 },
  { id: "tag-bt-3b", name: "Premium", code: "premium", dimension: "budget_tier", parentId: "tag-bt-3", description: "High-end with premium amenities", productCount: 5 },

  // Travel Theme
  { id: "tag-tt-1", name: "Beach & Resort", code: "beach_resort", dimension: "travel_theme", parentId: null, description: "Beachfront and resort experiences", productCount: 7 },
  { id: "tag-tt-2", name: "Adventure", code: "adventure", dimension: "travel_theme", parentId: null, description: "Thrilling outdoor activities", productCount: 5 },
  { id: "tag-tt-2a", name: "Desert Safari", code: "desert_safari", dimension: "travel_theme", parentId: "tag-tt-2", description: "Desert dune and safari experiences", productCount: 3 },
  { id: "tag-tt-2b", name: "Water Sports", code: "water_sports", dimension: "travel_theme", parentId: "tag-tt-2", description: "Diving, snorkeling, jet ski and more", productCount: 2 },
  { id: "tag-tt-3", name: "Cultural", code: "cultural", dimension: "travel_theme", parentId: null, description: "Heritage, museums and cultural experiences", productCount: 4 },
  { id: "tag-tt-4", name: "Culinary", code: "culinary", dimension: "travel_theme", parentId: null, description: "Food tours and dining experiences", productCount: 3 },
  { id: "tag-tt-5", name: "Wellness & Spa", code: "wellness_spa", dimension: "travel_theme", parentId: null, description: "Relaxation, spa and wellness retreats", productCount: 4 },

  // Audience
  { id: "tag-au-1", name: "Families", code: "families", dimension: "audience", parentId: null, description: "Family-friendly activities and accommodation", productCount: 9 },
  { id: "tag-au-1a", name: "Young Families", code: "young_families", dimension: "audience", parentId: "tag-au-1", description: "Suitable for families with toddlers", productCount: 3 },
  { id: "tag-au-1b", name: "Multi-Generational", code: "multi_gen", dimension: "audience", parentId: "tag-au-1", description: "Activities for all ages", productCount: 4 },
  { id: "tag-au-2", name: "Couples", code: "couples", dimension: "audience", parentId: null, description: "Romantic getaways and couple experiences", productCount: 6 },
  { id: "tag-au-3", name: "Solo Travelers", code: "solo", dimension: "audience", parentId: null, description: "Solo-friendly options", productCount: 3 },
  { id: "tag-au-4", name: "Groups", code: "groups", dimension: "audience", parentId: null, description: "Group bookings and activities", productCount: 5 },
  { id: "tag-au-5", name: "Business", code: "business", dimension: "audience", parentId: null, description: "Business travel and MICE", productCount: 4 },

  // Season
  { id: "tag-se-1", name: "Year-round", code: "year_round", dimension: "season", parentId: null, description: "Available throughout the year", productCount: 14 },
  { id: "tag-se-2", name: "Summer", code: "summer", dimension: "season", parentId: null, description: "Best during summer months (Jun-Aug)", productCount: 3 },
  { id: "tag-se-3", name: "Winter", code: "winter", dimension: "season", parentId: null, description: "Best during winter months (Nov-Feb)", productCount: 6 },
  { id: "tag-se-4", name: "Shoulder Season", code: "shoulder", dimension: "season", parentId: null, description: "Ideal during transition periods", productCount: 2 },
  { id: "tag-se-4a", name: "Spring", code: "spring", dimension: "season", parentId: "tag-se-4", description: "March to May", productCount: 1 },
  { id: "tag-se-4b", name: "Autumn", code: "autumn", dimension: "season", parentId: "tag-se-4", description: "September to November", productCount: 1 },

  // Accessibility
  { id: "tag-ac-1", name: "Wheelchair Accessible", code: "wheelchair", dimension: "accessibility", parentId: null, description: "Full wheelchair accessibility", productCount: 8 },
  { id: "tag-ac-2", name: "Hearing Accessible", code: "hearing", dimension: "accessibility", parentId: null, description: "Accommodations for hearing impaired", productCount: 3 },
  { id: "tag-ac-3", name: "Visual Accessible", code: "visual", dimension: "accessibility", parentId: null, description: "Accommodations for visually impaired", productCount: 2 },
  { id: "tag-ac-4", name: "Limited Mobility", code: "limited_mobility", dimension: "accessibility", parentId: null, description: "Suitable for guests with limited mobility", productCount: 5 },
];

// ---- AI Tag Suggestions ----
export const MOCK_AI_SUGGESTIONS: AiTagSuggestion[] = [
  {
    id: "sug-001",
    productId: "prod-002",
    productName: "Burj Khalifa At The Top",
    suggestedTag: { tagId: "tag-tt-3", tagName: "Cultural", dimension: "travel_theme" },
    confidence: 87,
    source: "Content Analyzer",
    reason: "Product description references cultural significance and architectural heritage",
    status: "pending",
    createdAt: "2026-03-24T14:30:00Z",
  },
  {
    id: "sug-002",
    productId: "prod-004",
    productName: "Pierchic Restaurant",
    suggestedTag: { tagId: "tag-bt-3a", tagName: "Ultra-Luxury", dimension: "budget_tier" },
    confidence: 92,
    source: "Price Classifier",
    reason: "Average price per person exceeds ultra-luxury threshold (AED 800+)",
    status: "pending",
    createdAt: "2026-03-24T13:15:00Z",
  },
  {
    id: "sug-003",
    productId: "prod-005",
    productName: "Emirates Palace Mandarin Oriental",
    suggestedTag: { tagId: "tag-tt-5", tagName: "Wellness & Spa", dimension: "travel_theme" },
    confidence: 78,
    source: "Content Analyzer",
    reason: "Hotel amenities include full-service spa and wellness center",
    status: "pending",
    createdAt: "2026-03-24T12:00:00Z",
  },
  {
    id: "sug-004",
    productId: "prod-003",
    productName: "Dubai Airport Transfer – Private Sedan",
    suggestedTag: { tagId: "tag-au-5", tagName: "Business", dimension: "audience" },
    confidence: 65,
    source: "Review Classifier",
    reason: "High proportion of business traveler reviews mentioning airport transfers",
    status: "pending",
    createdAt: "2026-03-24T11:45:00Z",
  },
  {
    id: "sug-005",
    productId: "prod-001",
    productName: "Atlantis The Palm",
    suggestedTag: { tagId: "tag-au-1b", tagName: "Multi-Generational", dimension: "audience" },
    confidence: 83,
    source: "Content Analyzer",
    reason: "Resort offers activities for all age groups from children to seniors",
    status: "pending",
    createdAt: "2026-03-24T10:30:00Z",
  },
  {
    id: "sug-006",
    productId: "prod-006",
    productName: "Desert Safari Premium",
    suggestedTag: { tagId: "tag-se-3", tagName: "Winter", dimension: "season" },
    confidence: 71,
    source: "Booking Patterns",
    reason: "85% of bookings occur between November and February",
    status: "pending",
    createdAt: "2026-03-24T09:00:00Z",
  },
  {
    id: "sug-007",
    productId: "prod-007",
    productName: "Ski Dubai",
    suggestedTag: { tagId: "tag-au-1a", tagName: "Young Families", dimension: "audience" },
    confidence: 45,
    source: "Review Classifier",
    reason: "Several reviews mention children under 5 enjoying the experience",
    status: "pending",
    createdAt: "2026-03-23T16:00:00Z",
  },
  {
    id: "sug-008",
    productId: "prod-010",
    productName: "Dubai Marina Yacht Charter",
    suggestedTag: { tagId: "tag-au-2", tagName: "Couples", dimension: "audience" },
    confidence: 58,
    source: "Booking Patterns",
    reason: "40% of bookings are for 2 guests with romantic add-on packages",
    status: "pending",
    createdAt: "2026-03-23T14:20:00Z",
  },
];

// ---- Build tree from flat tags ----
export function buildTagTree(tags: Tag[]): Record<TagDimension, Tag[]> {
  const tree: Record<string, Tag[]> = {};
  const tagMap = new Map<string, Tag>();

  // Clone tags so we don't mutate originals
  const cloned = tags.map((t) => ({ ...t, children: [] as Tag[] }));
  cloned.forEach((t) => tagMap.set(t.id, t));

  // Build parent-child relationships
  for (const tag of cloned) {
    if (tag.parentId && tagMap.has(tag.parentId)) {
      tagMap.get(tag.parentId)!.children!.push(tag);
    }
  }

  // Group root-level tags by dimension
  const dimensions: TagDimension[] = [
    "budget_tier",
    "travel_theme",
    "audience",
    "season",
    "accessibility",
  ];

  for (const dim of dimensions) {
    tree[dim] = cloned.filter((t) => t.dimension === dim && t.parentId === null);
  }

  return tree as Record<TagDimension, Tag[]>;
}
