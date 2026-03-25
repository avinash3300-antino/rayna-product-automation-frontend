import type { ProductStatus, ProductTag } from "./products";

// ---- Category Types ----
export type AttributeCategory = "hotels" | "attractions" | "transfers" | "restaurants";

// ---- Hotel Enums ----
export type PropertyType = "Resort" | "Hotel" | "Boutique" | "Apartment" | "Villa" | "Hostel" | "Guesthouse";
export type CancellationPolicy = "Free" | "Non-Refundable" | "Partial";
export type RoomType = "Standard" | "Deluxe" | "Suite" | "Family";
export type BoardType = "RO" | "BB" | "HB" | "FB" | "AI";
export type ContentStatus = "Draft" | "Approved" | "Needs Refresh";

// ---- Attraction Enums ----
export type AttractionCategory = "Theme Park" | "Cultural" | "Adventure" | "Water" | "Nature" | "Entertainment";
export type TicketType = "Adult" | "Child" | "Family" | "Senior";

// ---- Transfer Enums ----
export type TransferType = "Airport" | "City" | "Intercity" | "Port" | "Custom";
export type VehicleType = "Sedan" | "Van" | "Minibus" | "Coach" | "Luxury";
export type PricingModel = "Per Vehicle" | "Per Person";

// ---- Amenity Groups ----
export type AmenityGroup = "Facilities" | "Dining" | "Connectivity" | "Wellness";

export interface Amenity {
  id: string;
  name: string;
  group: AmenityGroup;
}

// ---- Operating Hours ----
export interface DaySchedule {
  day: string;
  openTime: string;
  closeTime: string;
  closed: boolean;
}

// ---- Ticket Type Entry ----
export interface TicketTypeEntry {
  id: string;
  type: TicketType;
  priceFrom: number;
  priceTo: number;
  currency: string;
}

// ---- Image Entry ----
export interface ImageEntry {
  id: string;
  url: string;
}

// ---- Hotel Attributes ----
export interface HotelAttributes {
  // Basic Info
  hotelName: string;
  starRating: number;
  propertyType: PropertyType;
  status: ProductStatus;
  // Location
  address: string;
  latitude: number;
  longitude: number;
  destination: string;
  // Operations
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: CancellationPolicy;
  // Room & Board
  roomTypes: RoomType[];
  boardTypes: BoardType[];
  // Amenities
  amenities: string[];
  // Pricing
  netRateFrom: number;
  currencyCode: string;
  bookingSources: string[];
  // Media
  images: ImageEntry[];
  // SEO Content
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  contentStatus: ContentStatus;
  // Tags
  tags: ProductTag[];
}

// ---- Attraction Attributes ----
export interface AttractionAttributes {
  // Basic Info
  attractionName: string;
  category: AttractionCategory;
  // Location
  address: string;
  latitude: number;
  longitude: number;
  destination: string;
  // Visit Info
  typicalDuration: string;
  minimumAge: number;
  includesText: string;
  excludesText: string;
  // Operating Hours
  operatingHours: DaySchedule[];
  lastVerifiedDate: string;
  // Ticket Types
  ticketTypes: TicketTypeEntry[];
  // Media
  images: ImageEntry[];
  // SEO Content
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  contentStatus: ContentStatus;
  // Tags
  tags: ProductTag[];
}

// ---- Transfer Attributes ----
export interface TransferAttributes {
  // Basic Info
  transferName: string;
  transferType: TransferType;
  // Route
  originLocation: string;
  destinationLocation: string;
  typicalDuration: string;
  // Vehicle & Capacity
  vehicleType: VehicleType;
  minPax: number;
  maxPax: number;
  pricingModel: PricingModel;
  // Pricing
  netRate: number;
  currencyCode: string;
  // Features
  meetAndGreet: boolean;
  availability247: boolean;
  flightMonitoring: boolean;
  // SEO Content
  shortDescription: string;
  // Tags
  tags: ProductTag[];
}

// ---- Restaurant Attributes (minimal) ----
export interface RestaurantAttributes {
  restaurantName: string;
  cuisineType: string;
  priceRange: string;
  address: string;
  latitude: number;
  longitude: number;
  destination: string;
  operatingHours: DaySchedule[];
  tags: ProductTag[];
}

// ---- Unified Attribute Product ----
export interface AttributeProduct {
  id: string;
  name: string;
  destination: string;
  category: AttributeCategory;
  status: ProductStatus;
  completeness: number;
  missingFields: string[];
  updatedAt: string;
  attributes: HotelAttributes | AttractionAttributes | TransferAttributes | RestaurantAttributes;
}

// ---- Enrichment Queue Entry ----
export interface EnrichmentQueueEntry {
  id: string;
  productId: string;
  productName: string;
  category: AttributeCategory;
  missingFields: string[];
  assignedTo: string;
  priority: "high" | "medium" | "low";
  createdAt: string;
}

// ---- Filter State ----
export interface AttributeFilterState {
  search: string;
  destinations: string[];
  statuses: ProductStatus[];
  completenessMin: number;
  sortBy: "name" | "completeness" | "updatedAt";
}

// ---- Bulk Edit Fields ----
export type BulkEditableField = "cancellationPolicy" | "boardTypes" | "status" | "tags";

// ---- Status color map ----
export const STATUS_COLORS: Record<ProductStatus, string> = {
  draft: "bg-amber-100 text-amber-800 border-amber-200",
  staged: "bg-blue-100 text-blue-800 border-blue-200",
  published: "bg-emerald-100 text-emerald-800 border-emerald-200",
  archived: "bg-gray-100 text-gray-600 border-gray-200",
};

export const CATEGORY_ICONS: Record<AttributeCategory, string> = {
  hotels: "Hotel",
  attractions: "Ticket",
  transfers: "Car",
  restaurants: "UtensilsCrossed",
};

// ---- Master Amenities List ----
export const MASTER_AMENITIES: Amenity[] = [
  // Facilities
  { id: "a1", name: "Swimming Pool", group: "Facilities" },
  { id: "a2", name: "Gym / Fitness Center", group: "Facilities" },
  { id: "a3", name: "Parking", group: "Facilities" },
  { id: "a4", name: "Business Center", group: "Facilities" },
  { id: "a5", name: "Kids Club", group: "Facilities" },
  { id: "a6", name: "Concierge", group: "Facilities" },
  { id: "a7", name: "Laundry Service", group: "Facilities" },
  { id: "a8", name: "Airport Shuttle", group: "Facilities" },
  // Dining
  { id: "a9", name: "Restaurant", group: "Dining" },
  { id: "a10", name: "Bar / Lounge", group: "Dining" },
  { id: "a11", name: "Room Service", group: "Dining" },
  { id: "a12", name: "Breakfast Buffet", group: "Dining" },
  { id: "a13", name: "Coffee Shop", group: "Dining" },
  // Connectivity
  { id: "a14", name: "Free WiFi", group: "Connectivity" },
  { id: "a15", name: "In-Room Safe", group: "Connectivity" },
  { id: "a16", name: "Smart TV", group: "Connectivity" },
  { id: "a17", name: "USB Charging", group: "Connectivity" },
  // Wellness
  { id: "a18", name: "Spa", group: "Wellness" },
  { id: "a19", name: "Sauna", group: "Wellness" },
  { id: "a20", name: "Jacuzzi", group: "Wellness" },
  { id: "a21", name: "Yoga Studio", group: "Wellness" },
  { id: "a22", name: "Massage Services", group: "Wellness" },
];

// ---- Currency Codes ----
export const CURRENCY_CODES = ["AED", "USD", "EUR", "GBP", "SAR", "QAR", "BHD", "OMR", "KWD", "INR"];

// ---- Destinations (for dropdowns) ----
export const ATTRIBUTE_DESTINATIONS = [
  "Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah", "Muscat", "Doha",
  "Bahrain", "Riyadh", "Jeddah", "Istanbul", "Maldives", "Bali",
];
