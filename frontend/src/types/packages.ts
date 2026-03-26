import type { ProductCategory } from "./destinations";
import type { Product, ProductTag } from "./products";

// ---- Package Type ----
export type PackageTypeId =
  | "city_explorer"
  | "beach_getaway"
  | "adventure"
  | "cultural_heritage"
  | "family_fun"
  | "luxury_escape"
  | "custom";

export interface ComponentRules {
  hotels: { min: number; max: number };
  attractions: { min: number; max: number };
  transfers: { min: number; max: number };
  restaurants: { min: number; max: number };
}

export interface DurationConstraint {
  minNights: number;
  maxNights: number;
}

export interface PackageTypeDefinition {
  id: PackageTypeId;
  name: string;
  description: string;
  icon: string;
  componentRules: ComponentRules;
  durationConstraint: DurationConstraint;
  suggestedMargin: number;
  requiredCategories: ProductCategory[];
}

// ---- Package Status ----
export type PackageStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "published"
  | "archived";

// ---- Pricing Status ----
export type PricingStatus = "complete" | "incomplete";

// ---- Package Component ----
export interface PackageComponent {
  productId: string;
  product: Product;
  category: ProductCategory;
  quantity: number;
  netRate: number;
  currency: string;
}

// ---- Component Pricing Breakdown ----
export interface PackageComponentPricing {
  productId: string;
  productName: string;
  category: ProductCategory;
  netRate: number;
  quantity: number;
  subtotal: number;
  currency: string;
}

// ---- Package Pricing ----
export interface PackagePricing {
  currency: string;
  baseCost: number;
  marginPercent: number;
  floorPrice: number;
  displayPrice: number;
  isOverridden: boolean;
  overridePrice: number | null;
  componentBreakdown: PackageComponentPricing[];
  pricingStatus: PricingStatus;
}

// ---- Itinerary ----
export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
}

// ---- Generated Content ----
export interface PackageGeneratedContent {
  name: string;
  description: string;
  itinerary: ItineraryDay[];
  suggestedTags: ProductTag[];
  isGenerated: boolean;
}

// ---- Core Package ----
export interface TravelPackage {
  id: string;
  name: string;
  packageTypeId: PackageTypeId;
  destination: string;
  nights: number;
  days: number;
  status: PackageStatus;
  components: PackageComponent[];
  pricing: PackagePricing;
  content: PackageGeneratedContent;
  tags: ProductTag[];
  createdAt: string;
  updatedAt: string;
}

// ---- Builder Step ----
export type BuilderStep = 1 | 2 | 3 | 4 | 5;

// ---- Step Definition ----
export interface StepDefinition {
  step: BuilderStep;
  label: string;
  description: string;
}

// ---- Builder State ----
export interface PackageBuilderState {
  currentStep: BuilderStep;
  isEditing: boolean;
  editingPackageId: string | null;
  packageName: string;
  packageTypeId: PackageTypeId | null;
  destination: string;
  nights: number;
  selectedComponents: PackageComponent[];
  marginPercent: number;
  isOverridePrice: boolean;
  overridePrice: number | null;
  generatedContent: PackageGeneratedContent | null;
  isGenerating: boolean;
}

// ---- Pricing Calculation ----
export function calculatePackagePricing(
  components: PackageComponent[],
  nights: number,
  marginPercent: number,
  isOverridden: boolean,
  overridePrice: number | null
): PackagePricing {
  const breakdown: PackageComponentPricing[] = components.map((comp) => {
    const netRate = comp.product.attributes.pricing?.amount ?? 0;
    const currency = comp.product.attributes.pricing?.currency ?? "AED";
    const quantity = comp.category === "hotels" ? nights : comp.quantity;

    return {
      productId: comp.productId,
      productName: comp.product.name,
      category: comp.category,
      netRate,
      quantity,
      subtotal: netRate * quantity,
      currency,
    };
  });

  const baseCost = breakdown.reduce((sum, item) => sum + item.subtotal, 0);
  const floorPrice = Math.ceil(baseCost * (1 + marginPercent / 100));
  const displayPrice =
    isOverridden && overridePrice !== null ? overridePrice : floorPrice;
  const hasMissingPricing = components.some(
    (c) => !c.product.attributes.pricing || c.product.attributes.pricing.amount === 0
  );
  const currency = breakdown.length > 0 ? breakdown[0].currency : "AED";

  return {
    currency,
    baseCost,
    marginPercent,
    floorPrice,
    displayPrice,
    isOverridden,
    overridePrice,
    componentBreakdown: breakdown,
    pricingStatus: hasMissingPricing ? "incomplete" : "complete",
  };
}
