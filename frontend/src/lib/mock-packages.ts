import type {
  PackageTypeDefinition,
  PackageTypeId,
  TravelPackage,
  StepDefinition,
  PackageBuilderState,
} from "@/types/packages";
import { MOCK_PRODUCTS } from "./mock-products";

// ---- Package Type Definitions (7 types) ----
export const PACKAGE_TYPE_DEFINITIONS: PackageTypeDefinition[] = [
  {
    id: "city_explorer",
    name: "City Explorer",
    description: "Discover the best of urban attractions with guided city tours",
    icon: "Building2",
    componentRules: {
      hotels: { min: 1, max: 1 },
      attractions: { min: 3, max: 5 },
      transfers: { min: 1, max: 2 },
      restaurants: { min: 0, max: 2 },
    },
    durationConstraint: { minNights: 2, maxNights: 4 },
    suggestedMargin: 20,
    requiredCategories: ["hotels", "attractions", "transfers"],
  },
  {
    id: "beach_getaway",
    name: "Beach Getaway",
    description: "Relax at premium beachfront resorts with ocean activities",
    icon: "Waves",
    componentRules: {
      hotels: { min: 1, max: 1 },
      attractions: { min: 1, max: 3 },
      transfers: { min: 1, max: 1 },
      restaurants: { min: 0, max: 2 },
    },
    durationConstraint: { minNights: 3, maxNights: 7 },
    suggestedMargin: 25,
    requiredCategories: ["hotels", "attractions", "transfers"],
  },
  {
    id: "adventure",
    name: "Adventure",
    description: "Thrilling outdoor activities and adrenaline-fueled experiences",
    icon: "Mountain",
    componentRules: {
      hotels: { min: 1, max: 2 },
      attractions: { min: 2, max: 6 },
      transfers: { min: 1, max: 3 },
      restaurants: { min: 0, max: 1 },
    },
    durationConstraint: { minNights: 2, maxNights: 5 },
    suggestedMargin: 22,
    requiredCategories: ["hotels", "attractions", "transfers"],
  },
  {
    id: "cultural_heritage",
    name: "Cultural Heritage",
    description: "Immerse in local culture, museums, and historical landmarks",
    icon: "Landmark",
    componentRules: {
      hotels: { min: 1, max: 1 },
      attractions: { min: 3, max: 6 },
      transfers: { min: 1, max: 2 },
      restaurants: { min: 1, max: 3 },
    },
    durationConstraint: { minNights: 3, maxNights: 6 },
    suggestedMargin: 18,
    requiredCategories: ["hotels", "attractions", "transfers", "restaurants"],
  },
  {
    id: "family_fun",
    name: "Family Fun",
    description: "Kid-friendly activities and comfortable family accommodations",
    icon: "Users",
    componentRules: {
      hotels: { min: 1, max: 1 },
      attractions: { min: 2, max: 5 },
      transfers: { min: 1, max: 2 },
      restaurants: { min: 0, max: 2 },
    },
    durationConstraint: { minNights: 3, maxNights: 7 },
    suggestedMargin: 20,
    requiredCategories: ["hotels", "attractions", "transfers"],
  },
  {
    id: "luxury_escape",
    name: "Luxury Escape",
    description: "Premium 5-star experiences with exclusive VIP services",
    icon: "Crown",
    componentRules: {
      hotels: { min: 1, max: 1 },
      attractions: { min: 1, max: 4 },
      transfers: { min: 1, max: 2 },
      restaurants: { min: 1, max: 3 },
    },
    durationConstraint: { minNights: 2, maxNights: 7 },
    suggestedMargin: 30,
    requiredCategories: ["hotels", "attractions", "transfers", "restaurants"],
  },
  {
    id: "custom",
    name: "Custom",
    description: "Build your own package with flexible rules and no constraints",
    icon: "Puzzle",
    componentRules: {
      hotels: { min: 0, max: 5 },
      attractions: { min: 0, max: 10 },
      transfers: { min: 0, max: 5 },
      restaurants: { min: 0, max: 5 },
    },
    durationConstraint: { minNights: 1, maxNights: 14 },
    suggestedMargin: 20,
    requiredCategories: [],
  },
];

// ---- Resolve products by ID ----
function findProduct(id: string) {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

// ---- Mock Existing Packages ----
export const MOCK_PACKAGES: TravelPackage[] = [
  {
    id: "pkg-001",
    name: "Dubai City Explorer",
    packageTypeId: "city_explorer",
    destination: "Dubai",
    nights: 3,
    days: 4,
    status: "published",
    components: [
      { productId: "prod-001", product: findProduct("prod-001")!, category: "hotels", quantity: 1, netRate: 1850, currency: "AED" },
      { productId: "prod-002", product: findProduct("prod-002")!, category: "attractions", quantity: 1, netRate: 169, currency: "AED" },
      { productId: "prod-007", product: findProduct("prod-007")!, category: "attractions", quantity: 1, netRate: 350, currency: "AED" },
      { productId: "prod-003", product: findProduct("prod-003")!, category: "transfers", quantity: 1, netRate: 220, currency: "AED" },
    ],
    pricing: {
      currency: "AED",
      baseCost: 6289,
      marginPercent: 20,
      floorPrice: 7547,
      displayPrice: 7547,
      isOverridden: false,
      overridePrice: null,
      componentBreakdown: [],
      pricingStatus: "complete",
    },
    content: {
      name: "Dubai City Explorer",
      description: "Discover the best of Dubai with visits to iconic landmarks, thrilling entertainment, and luxury accommodations.",
      itinerary: [
        { day: 1, title: "Arrival & Check-in", description: "Arrive in Dubai and check into Atlantis The Palm.", activities: ["Airport transfer", "Hotel check-in", "Welcome dinner"] },
        { day: 2, title: "Iconic Dubai", description: "Visit the world's tallest building and enjoy panoramic views.", activities: ["Burj Khalifa At The Top", "Dubai Mall exploration", "Dubai Fountain show"] },
        { day: 3, title: "Adventure Day", description: "Experience the thrill of Ski Dubai.", activities: ["Ski Dubai experience", "Mall of the Emirates", "Afternoon leisure at resort"] },
        { day: 4, title: "Departure", description: "Enjoy a leisurely morning before your transfer to the airport.", activities: ["Beach time", "Hotel checkout", "Airport transfer"] },
      ],
      suggestedTags: [
        { dimension: "travel_theme", value: "Sightseeing" },
        { dimension: "budget_tier", value: "Luxury" },
      ],
      isGenerated: true,
    },
    tags: [
      { dimension: "travel_theme", value: "Sightseeing" },
      { dimension: "budget_tier", value: "Luxury" },
      { dimension: "audience", value: "Couples" },
    ],
    createdAt: "2026-03-20T10:00:00Z",
    updatedAt: "2026-03-24T14:30:00Z",
  },
  {
    id: "pkg-002",
    name: "Dubai Luxury Escape",
    packageTypeId: "luxury_escape",
    destination: "Dubai",
    nights: 4,
    days: 5,
    status: "draft",
    components: [
      { productId: "prod-005", product: findProduct("prod-005")!, category: "hotels", quantity: 1, netRate: 2400, currency: "AED" },
      { productId: "prod-002", product: findProduct("prod-002")!, category: "attractions", quantity: 1, netRate: 169, currency: "AED" },
      { productId: "prod-004", product: findProduct("prod-004")!, category: "restaurants", quantity: 1, netRate: 850, currency: "AED" },
      { productId: "prod-003", product: findProduct("prod-003")!, category: "transfers", quantity: 1, netRate: 220, currency: "AED" },
    ],
    pricing: {
      currency: "AED",
      baseCost: 10839,
      marginPercent: 30,
      floorPrice: 14091,
      displayPrice: 14091,
      isOverridden: false,
      overridePrice: null,
      componentBreakdown: [],
      pricingStatus: "complete",
    },
    content: {
      name: "Dubai Luxury Escape",
      description: "Indulge in a premium 5-star Dubai experience with world-class dining and exclusive activities.",
      itinerary: [],
      suggestedTags: [],
      isGenerated: false,
    },
    tags: [
      { dimension: "budget_tier", value: "Luxury" },
      { dimension: "audience", value: "Couples" },
    ],
    createdAt: "2026-03-22T09:00:00Z",
    updatedAt: "2026-03-23T16:00:00Z",
  },
  {
    id: "pkg-003",
    name: "Dubai Family Fun",
    packageTypeId: "family_fun",
    destination: "Dubai",
    nights: 5,
    days: 6,
    status: "pending_approval",
    components: [
      { productId: "prod-001", product: findProduct("prod-001")!, category: "hotels", quantity: 1, netRate: 1850, currency: "AED" },
      { productId: "prod-002", product: findProduct("prod-002")!, category: "attractions", quantity: 1, netRate: 169, currency: "AED" },
      { productId: "prod-007", product: findProduct("prod-007")!, category: "attractions", quantity: 1, netRate: 350, currency: "AED" },
      { productId: "prod-003", product: findProduct("prod-003")!, category: "transfers", quantity: 1, netRate: 220, currency: "AED" },
    ],
    pricing: {
      currency: "AED",
      baseCost: 9989,
      marginPercent: 20,
      floorPrice: 11987,
      displayPrice: 11987,
      isOverridden: false,
      overridePrice: null,
      componentBreakdown: [],
      pricingStatus: "complete",
    },
    content: {
      name: "Dubai Family Fun",
      description: "Create unforgettable family memories with kid-friendly activities and comfortable stays.",
      itinerary: [
        { day: 1, title: "Arrival", description: "Welcome to Dubai!", activities: ["Airport transfer", "Hotel check-in", "Aquaventure Waterpark"] },
        { day: 2, title: "Burj Khalifa Day", description: "Visit the tallest building in the world.", activities: ["Burj Khalifa", "KidZania", "Dubai Fountain"] },
      ],
      suggestedTags: [{ dimension: "audience", value: "Families" }],
      isGenerated: true,
    },
    tags: [
      { dimension: "audience", value: "Families" },
      { dimension: "budget_tier", value: "Luxury" },
    ],
    createdAt: "2026-03-18T11:00:00Z",
    updatedAt: "2026-03-24T09:00:00Z",
  },
  {
    id: "pkg-004",
    name: "Abu Dhabi Cultural Heritage",
    packageTypeId: "cultural_heritage",
    destination: "Abu Dhabi",
    nights: 3,
    days: 4,
    status: "draft",
    components: [
      { productId: "prod-009", product: findProduct("prod-009")!, category: "hotels", quantity: 1, netRate: 950, currency: "AED" },
    ],
    pricing: {
      currency: "AED",
      baseCost: 2850,
      marginPercent: 18,
      floorPrice: 3363,
      displayPrice: 3363,
      isOverridden: false,
      overridePrice: null,
      componentBreakdown: [],
      pricingStatus: "incomplete",
    },
    content: {
      name: "Abu Dhabi Cultural Heritage",
      description: "",
      itinerary: [],
      suggestedTags: [],
      isGenerated: false,
    },
    tags: [],
    createdAt: "2026-03-24T08:00:00Z",
    updatedAt: "2026-03-24T08:00:00Z",
  },
];

// ---- Step Definitions ----
export const STEP_DEFINITIONS: StepDefinition[] = [
  { step: 1, label: "Configure", description: "Set up package basics" },
  { step: 2, label: "Components", description: "Select products" },
  { step: 3, label: "Pricing", description: "Set margins & prices" },
  { step: 4, label: "Content", description: "Generate descriptions" },
  { step: 5, label: "Review", description: "Review & publish" },
];

// ---- Helper: Generate package name ----
export function generatePackageName(
  typeId: PackageTypeId,
  destination: string
): string {
  const def = PACKAGE_TYPE_DEFINITIONS.find((t) => t.id === typeId);
  return `${destination} ${def?.name ?? "Package"}`;
}

// ---- Destinations list ----
export const DESTINATIONS = [
  "Dubai",
  "Abu Dhabi",
  "Muscat",
  "Tbilisi",
  "Male",
  "Denpasar",
  "Bangkok",
  "Istanbul",
];

// ---- Initial builder state ----
export const INITIAL_BUILDER_STATE: PackageBuilderState = {
  currentStep: 1,
  isEditing: false,
  editingPackageId: null,
  packageName: "",
  packageTypeId: null,
  destination: "",
  nights: 3,
  selectedComponents: [],
  marginPercent: 20,
  isOverridePrice: false,
  overridePrice: null,
  generatedContent: null,
  isGenerating: false,
};

// ---- Package type icon mapping ----
export const PACKAGE_STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  pending_approval: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  published: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  archived: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

export const PACKAGE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
};
