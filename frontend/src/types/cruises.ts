export type CruiseStatus =
  | "draft"
  | "enriched"
  | "review_ready"
  | "approved"
  | "published";

export interface CruiseItineraryItem {
  id: string;
  order: number;
  dayNumber: number | null;
  timeLabel: string | null;
  portOrStop: string;
  description: string | null;
  shoreExcursionAvailable: boolean;
}

export interface CruiseCabin {
  id: string;
  cabinType: string;
  cabinCount: number | null;
  maxOccupancy: number | null;
  amenities: string[] | null;
  description: string | null;
}

export interface CruisePricingTier {
  id: string;
  cabinType: string;
  priceAdult: number | null;
  priceChild: number | null;
  priceInfant: number | null;
  currency: string;
  includesDescription: string | null;
}

export interface CruiseCardItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  subCategory: string | null;
  city: string;
  priceFrom: number;
  currency: string;
  rating: number | null;
  reviewCount: number;
  coverImageUrl: string | null;
  vesselType: string | null;
  cruiseType: string | null;
  durationHours: number | null;
  mealIncluded: boolean;
  qualityScore: number;
  status: CruiseStatus;
}

export interface Cruise {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  category: string;
  subCategory: string | null;
  cruiseClass: string | null;
  status: CruiseStatus;
  descriptionShort: string;
  descriptionLong: string;
  highlights: string[] | null;
  included: string[] | null;
  excluded: string[] | null;
  whatToBring: string | null;
  importantNotes: string[] | null;
  redemptionInstructions: string[] | null;
  // Pricing
  priceAdult: number;
  priceChild: number | null;
  priceInfant: number | null;
  priceGroup: number | null;
  priceOriginal: number | null;
  currency: string;
  priceType: string;
  discountPct: number | null;
  priceFrom: number;
  // Duration
  durationHours: number | null;
  durationDays: number | null;
  departureTimes: string[] | null;
  operatingDays: string[] | null;
  seasonalAvailability: string | null;
  advanceBookingDays: number | null;
  // Booking
  instantConfirmation: boolean;
  freeCancellation: boolean;
  cancellationHours: number | null;
  cancellationPolicy: string | null;
  boardingTime: string | null;
  // Location
  country: string;
  city: string;
  area: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  mapsLink: string | null;
  boardingPointName: string | null;
  boardingPointDescription: string | null;
  pickupAvailable: boolean;
  pickupPoints: string[] | null;
  // Vessel
  vesselName: string | null;
  vesselType: string | null;
  vesselLengthM: number | null;
  vesselYearBuilt: number | null;
  vesselCapacity: number | null;
  deckCount: number | null;
  onboardFacilities: string[] | null;
  // Cruise-specific
  cruiseType: string | null;
  routeDescription: string | null;
  numberOfNights: number | null;
  mealIncluded: boolean;
  mealType: string | null;
  entertainmentIncluded: boolean;
  entertainmentDetails: string[] | null;
  wifiAvailable: boolean;
  // Eligibility
  minAge: number | null;
  maxAge: number | null;
  agePricingBreaks: Record<string, unknown>[] | null;
  dressCode: string | null;
  wheelchairAccessible: boolean;
  languages: string[] | null;
  fitnessLevel: string | null;
  pregnancyRestriction: boolean;
  // Operator
  operatorName: string | null;
  operatorWebsite: string | null;
  operatorLicenseBody: string | null;
  operatorEstablishedYear: number | null;
  operatorFleetSize: number | null;
  operatorCertifications: string[] | null;
  // Media
  coverImageUrl: string | null;
  galleryJson: (string | { url: string; alt_text?: string; s3_key?: string })[] | null;
  videoUrl: string | null;
  // Reviews
  rating: number | null;
  reviewCount: number;
  rating5: number;
  rating4: number;
  rating3: number;
  rating2: number;
  rating1: number;
  reviewSnippets: string[] | null;
  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  jsonLd: Record<string, unknown> | null;
  canonicalUrl: string | null;
  // Source
  sourceUrl: string;
  sourceUrls: string[] | null;
  sourceType: string;
  verified: boolean;
  qualityScore: number;
  otherAttributes: { label: string; value: string; category_hint?: string }[] | null;
  dedupHash: string;
  // Nested
  itinerary: CruiseItineraryItem[];
  cabins: CruiseCabin[];
  pricingTiers: CruisePricingTier[];
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export type CruiseViewMode = "grid" | "table";
