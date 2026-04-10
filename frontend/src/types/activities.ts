export type ActivityStatus =
  | "draft"
  | "enriched"
  | "review_ready"
  | "approved"
  | "published";

export interface ActivityCardItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  priceFrom: number;
  currency: string;
  rating: number | null;
  reviewCount: number;
  coverImageUrl: string | null;
  instantConfirmation: boolean;
  freeCancellation: boolean;
  durationMinutes: number;
  qualityScore: number;
  status: ActivityStatus;
}

export interface Activity {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  category: string;
  subCategory: string | null;
  activityType: string;
  tags: string[] | null;
  status: ActivityStatus;
  descriptionShort: string;
  descriptionLong: string;
  highlights: string[] | null;
  included: string[] | null;
  excluded: string[] | null;
  whatToBring: string | null;
  importantNotes: string | null;
  priceAdult: number;
  priceChild: number | null;
  priceInfant: number | null;
  priceGroup: number | null;
  priceOriginal: number | null;
  currency: string;
  priceType: string;
  discountPct: number | null;
  priceFrom: number;
  durationMinutes: number;
  startTimes: string[] | null;
  operatingDays: string[] | null;
  instantConfirmation: boolean;
  freeCancellation: boolean;
  cancellationHours: number | null;
  cancellationPolicy: string | null;
  minParticipants: number | null;
  maxParticipants: number | null;
  advanceBookingDays: number | null;
  country: string;
  city: string;
  area: string | null;
  address: string;
  lat: number;
  lng: number;
  mapsLink: string | null;
  meetingPointName: string | null;
  meetingPointDesc: string | null;
  nearbyLandmark: string | null;
  pickupAvailable: boolean;
  pickupLocations: string[] | null;
  hotelPickupIncluded: boolean;
  dropoffAvailable: boolean;
  refundPolicyDetails: string | null;
  minAge: number | null;
  maxAge: number | null;
  fitnessLevel: string | null;
  difficulty: string | null;
  pregnancyRestriction: boolean;
  wheelchairAccess: string | null;
  languages: string[] | null;
  coverImageUrl: string | null;
  galleryJson: (string | { url: string; alt_text?: string; size_variant?: string; cloudinary_id?: string })[] | null;
  videoUrl: string | null;
  rating: number | null;
  reviewCount: number;
  rating5: number;
  rating4: number;
  rating3: number;
  reviewSnippets: string[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeyword: string | null;
  jsonLd: Record<string, unknown> | null;
  canonicalUrl: string | null;
  sourceUrl: string;
  sourceType: string;
  operatorName: string | null;
  verified: boolean;
  dedupHash: string;
  qualityScore: number;
  createdAt: string;
  updatedAt: string;
}

export type ActivityViewMode = "grid" | "table";
