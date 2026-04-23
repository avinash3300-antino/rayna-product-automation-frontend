import type {
  BackendUserResponse,
  BackendAuditLogResponse,
  BackendPaginatedResponse,
  BackendDestinationListItem,
  BackendSourceDiscoveryRunResponse,
  BackendScrapeSourceResponse,
  BackendScrapeJobResponse,
  BackendActivityCard,
  BackendActivityResponse,
  BackendReviewResponse,
  BackendReviewListResponse,
  BackendCruiseCard,
  BackendCruiseResponse,
} from "@/types/api-responses";
import type { Destination, DestinationStatus, ScrapeRunStatus, ProductCategory } from "@/types/destinations";
import type { AppUser, UserRole, UserStatus } from "@/types/users";
import type { DiscoveryRun, ScrapeSource } from "@/types/discovery";
import type { ScrapeJob } from "@/types/scraping";
import type { ActivityCardItem, Activity, ActivityStatus, ActivityReview, ActivityReviewList } from "@/types/activities";
import type { CruiseCardItem, Cruise, CruiseStatus } from "@/types/cruises";
import type { ProfileActivityEntry, ProfileActionType } from "@/types/profile";
import type { PaginatedResponse } from "@/types/index";

export function transformUserResponse(raw: BackendUserResponse): AppUser {
  return {
    id: raw.id,
    fullName: raw.full_name,
    email: raw.email,
    avatarUrl: raw.profile_picture_url,
    profilePictureUrl: raw.profile_picture_url,
    jobTitle: raw.job_title,
    department: raw.department,
    phone: raw.phone,
    timezone: raw.timezone,
    roles: raw.roles.map((r) => r.code as UserRole),
    status: raw.status as UserStatus,
    suspendedReason: null,
    suspendedAt: null,
    lastLogin: raw.last_login_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function transformPaginatedResponse<TRaw, TFrontend>(
  raw: BackendPaginatedResponse<TRaw>,
  transformItem: (item: TRaw) => TFrontend
): PaginatedResponse<TFrontend> {
  return {
    data: raw.items.map(transformItem),
    total: raw.total,
    page: raw.page,
    pageSize: raw.per_page,
    totalPages: raw.total_pages,
  };
}

function mapActionToActionType(action: string): ProfileActionType {
  const lower = action.toLowerCase();
  if (lower.includes("approv")) return "approved";
  if (lower.includes("reject")) return "rejected";
  if (lower.includes("tag")) return "tagged";
  if (lower.includes("assign")) return "assigned";
  if (lower.includes("publish")) return "published";
  if (lower.includes("roll") || lower.includes("revert")) return "rolled_back";
  if (lower.includes("trigger")) return "triggered";
  if (lower.includes("review")) return "reviewed";
  if (lower.includes("login")) return "login";
  if (lower.includes("edit") || lower.includes("updat")) return "edited";
  return "edited";
}

const ACTION_LABELS: Record<string, string> = {
  profile_picture_updated: "Updated profile picture",
  profile_picture_deleted: "Removed profile picture",
  password_changed: "Changed account password",
  updated: "Updated profile information",
  created: "Account created",
  login: "Logged in",
  logout: "Logged out",
  approved: "Approved content",
  rejected: "Rejected content",
  published: "Published content",
  triggered: "Triggered a job",
  assigned: "Assigned items",
  tagged: "Applied tags",
  reviewed: "Reviewed content",
  rolled_back: "Rolled back changes",
};

function humanizeAction(action: string): string {
  if (ACTION_LABELS[action]) return ACTION_LABELS[action];
  return action
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const ENTITY_TYPE_LABELS: Record<string, string> = {
  auth_users: "User account",
  users: "User",
  products: "Product",
  jobs: "Job",
  batches: "Batch",
  queues: "Queue",
  tags: "Tag",
  destinations: "Destination",
  sessions: "Session",
};

function humanizeEntity(entityType: string, entityId: string): string {
  const label =
    ENTITY_TYPE_LABELS[entityType] ??
    entityType.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (entityType === "auth_users" || entityType === "users" || entityType === "sessions") {
    return label;
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(entityId);
  if (isUuid) {
    return `${label} (${entityId.slice(0, 8)})`;
  }

  return `${label}: ${entityId}`;
}

// ---- Destination transformer ----

const VALID_SCRAPE_STATUSES = new Set(["completed", "running", "failed", "queued", "pending"]);

export function transformDestinationResponse(
  raw: BackendDestinationListItem
): Destination {
  const productCounts = {
    activities: raw.product_counts?.activities ?? 0,
    cruises: raw.product_counts?.cruises ?? 0,
  } as Record<ProductCategory, number>;

  let lastScrapeRun = null;
  if (raw.last_scrape_run) {
    const status = VALID_SCRAPE_STATUSES.has(raw.last_scrape_run.status)
      ? (raw.last_scrape_run.status as ScrapeRunStatus)
      : ("pending" as ScrapeRunStatus);
    lastScrapeRun = {
      date: raw.last_scrape_run.date ?? new Date().toISOString(),
      status,
      recordsFound: raw.last_scrape_run.records_found,
      durationMs: raw.last_scrape_run.duration_ms,
    };
  }

  return {
    id: raw.id,
    name: raw.name,
    country: raw.country_name ?? raw.country_code ?? "",
    countryFlag: raw.country_flag ?? "",
    region: raw.region_name ?? "",
    city: raw.city_name ?? "",
    timezone: raw.timezone ?? "",
    latitude: raw.latitude,
    longitude: raw.longitude,
    status: (raw.status === "active" || raw.status === "inactive"
      ? raw.status
      : "active") as DestinationStatus,
    productCounts,
    lastScrapeRun,
  };
}

export function transformAuditLogToActivity(
  raw: BackendAuditLogResponse
): ProfileActivityEntry {
  return {
    id: raw.id,
    action: humanizeAction(raw.action),
    entity: humanizeEntity(raw.entity_type, raw.entity_id),
    timestamp: raw.created_at,
    actionType: mapActionToActionType(raw.action),
  };
}

// ---- Discovery transformers ----

export function transformDiscoveryRunResponse(
  raw: BackendSourceDiscoveryRunResponse
): DiscoveryRun {
  return {
    id: raw.id,
    cityId: raw.city_id,
    category: raw.category,
    productType: raw.product_type ?? "activities",
    status: raw.status as DiscoveryRun["status"],
    ahrefsResults: raw.ahrefs_results,
    searchapiResults: raw.searchapi_results,
    claudeSynthesis: raw.claude_synthesis,
    sourcesFound: raw.sources_found,
    sourcesApproved: raw.sources_approved,
    errorMessage: raw.error_message,
    startedAt: raw.started_at,
    completedAt: raw.completed_at,
    createdAt: raw.created_at,
  };
}

export function transformScrapeSourceResponse(
  raw: BackendScrapeSourceResponse
): ScrapeSource {
  return {
    id: raw.id,
    cityId: raw.city_id,
    category: raw.category,
    productType: raw.product_type ?? "activities",
    sourceName: raw.source_name,
    sourceUrl: raw.source_url,
    tier: raw.tier,
    authorityScore: raw.authority_score,
    approved: raw.approved,
    approvedAt: raw.approved_at,
    addedBy: raw.added_by,
    isActive: raw.is_active,
    lastScrapedAt: raw.last_scraped_at,
    createdAt: raw.created_at,
  };
}

// ---- Scraping transformer ----

export function transformScrapeJobResponse(
  raw: BackendScrapeJobResponse
): ScrapeJob {
  return {
    id: raw.id,
    discoveryRunId: raw.discovery_run_id,
    cityId: raw.city_id,
    category: raw.category,
    productType: raw.product_type ?? "activities",
    status: raw.status as ScrapeJob["status"],
    sourceId: raw.source_id,
    sourceUrl: raw.source_url,
    scrapeType: raw.scrape_type,
    pagesScraped: raw.pages_scraped,
    recordsFound: raw.records_found,
    recordsSaved: raw.records_saved,
    recordsSkippedDup: raw.records_skipped_dup,
    recordsEnriched: raw.records_enriched,
    errorsJson: raw.errors_json,
    startedAt: raw.started_at,
    completedAt: raw.completed_at,
    createdAt: raw.created_at,
  };
}

// ---- Activity transformers ----

export function transformActivityCardResponse(
  raw: BackendActivityCard
): ActivityCardItem {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    category: raw.category,
    city: raw.city,
    priceFrom: raw.price_from,
    currency: raw.currency,
    rating: raw.rating,
    reviewCount: raw.review_count,
    coverImageUrl: raw.cover_image_url,
    instantConfirmation: raw.instant_confirmation,
    freeCancellation: raw.free_cancellation,
    durationMinutes: raw.duration_minutes,
    qualityScore: raw.quality_score,
    status: raw.status as ActivityStatus,
  };
}

export function transformActivityResponse(
  raw: BackendActivityResponse
): Activity {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    cityId: raw.city_id,
    category: raw.category,
    subCategory: raw.sub_category,
    activityType: raw.activity_type,
    tags: raw.tags,
    status: raw.status as ActivityStatus,
    descriptionShort: raw.description_short,
    descriptionLong: raw.description_long,
    highlights: raw.highlights,
    included: raw.included,
    excluded: raw.excluded,
    whatToBring: raw.what_to_bring,
    importantNotes: raw.important_notes,
    redemptionInstructions: raw.redemption_instructions,
    priceAdult: raw.price_adult,
    priceChild: raw.price_child,
    priceInfant: raw.price_infant,
    priceGroup: raw.price_group,
    priceOriginal: raw.price_original,
    currency: raw.currency,
    priceType: raw.price_type,
    discountPct: raw.discount_pct,
    priceFrom: raw.price_from,
    durationMinutes: raw.duration_minutes,
    startTimes: raw.start_times,
    operatingDays: raw.operating_days,
    instantConfirmation: raw.instant_confirmation,
    freeCancellation: raw.free_cancellation,
    cancellationHours: raw.cancellation_hours,
    cancellationPolicy: raw.cancellation_policy,
    minParticipants: raw.min_participants,
    maxParticipants: raw.max_participants,
    advanceBookingDays: raw.advance_booking_days,
    country: raw.country,
    city: raw.city,
    area: raw.area,
    address: raw.address,
    lat: raw.lat,
    lng: raw.lng,
    mapsLink: raw.maps_link,
    meetingPointName: raw.meeting_point_name,
    meetingPointDesc: raw.meeting_point_desc,
    nearbyLandmark: raw.nearby_landmark,
    pickupAvailable: raw.pickup_available,
    pickupLocations: raw.pickup_locations,
    hotelPickupIncluded: raw.hotel_pickup_included,
    dropoffAvailable: raw.dropoff_available,
    refundPolicyDetails: raw.refund_policy_details,
    minAge: raw.min_age,
    maxAge: raw.max_age,
    fitnessLevel: raw.fitness_level,
    difficulty: raw.difficulty,
    pregnancyRestriction: raw.pregnancy_restriction,
    wheelchairAccess: raw.wheelchair_access,
    dressCodeNote: raw.dress_code_note,
    languages: raw.languages,
    coverImageUrl: raw.cover_image_url,
    galleryJson: raw.gallery_json,
    videoUrl: raw.video_url,
    rating: raw.rating,
    reviewCount: raw.review_count,
    rating5: raw.rating_5,
    rating4: raw.rating_4,
    rating3: raw.rating_3,
    rating2: raw.rating_2 ?? 0,
    rating1: raw.rating_1 ?? 0,
    reviewSnippets: raw.review_snippets,
    metaTitle: raw.meta_title,
    metaDescription: raw.meta_description,
    focusKeyword: raw.focus_keyword,
    jsonLd: raw.json_ld,
    canonicalUrl: raw.canonical_url,
    sourceUrl: raw.source_url,
    sourceUrls: raw.source_urls ?? null,
    sourceType: raw.source_type,
    operatorName: raw.operator_name,
    operatorWebsite: raw.operator_website,
    operatorEstablishedYear: raw.operator_established_year,
    operatorCertifications: raw.operator_certifications,
    otherAttributes: raw.other_attributes,
    verified: raw.verified,
    dedupHash: raw.dedup_hash,
    qualityScore: raw.quality_score,
    timeline: (raw.timeline ?? []).map((t) => ({
      order: t.order,
      timeLabel: t.time_label,
      title: t.title,
      description: t.description,
    })),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// ---- Review transformers ----

export function transformReviewResponse(raw: BackendReviewResponse): ActivityReview {
  return {
    id: raw.id,
    productType: raw.product_type,
    productId: raw.product_id,
    reviewerName: raw.reviewer_name,
    reviewerAvatarUrl: raw.reviewer_avatar_url,
    rating: raw.rating,
    reviewTitle: raw.review_title,
    reviewText: raw.review_text,
    reviewDate: raw.review_date,
    sourcePlatform: raw.source_platform,
    sourceUrl: raw.source_url,
    verified: raw.verified,
    language: raw.language,
    createdAt: raw.created_at,
  };
}

export function transformReviewListResponse(raw: BackendReviewListResponse): ActivityReviewList {
  return {
    productId: raw.product_id,
    productType: raw.product_type,
    total: raw.total,
    avgRating: raw.avg_rating,
    platformCounts: raw.platform_counts,
    reviews: raw.reviews.map(transformReviewResponse),
  };
}

// ---- Cruise transformers ----

export function transformCruiseCardResponse(
  raw: BackendCruiseCard
): CruiseCardItem {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    category: raw.category,
    subCategory: raw.sub_category,
    city: raw.city,
    priceFrom: raw.price_from,
    currency: raw.currency,
    rating: raw.rating,
    reviewCount: raw.review_count,
    coverImageUrl: raw.cover_image_url,
    vesselType: raw.vessel_type,
    cruiseType: raw.cruise_type,
    durationHours: raw.duration_hours,
    mealIncluded: raw.meal_included,
    qualityScore: raw.quality_score,
    status: raw.status as CruiseStatus,
  };
}

export function transformCruiseResponse(
  raw: BackendCruiseResponse
): Cruise {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    cityId: raw.city_id,
    category: raw.category,
    subCategory: raw.sub_category,
    cruiseClass: raw.cruise_class,
    status: raw.status as CruiseStatus,
    descriptionShort: raw.description_short,
    descriptionLong: raw.description_long,
    highlights: raw.highlights,
    included: raw.included,
    excluded: raw.excluded,
    whatToBring: raw.what_to_bring,
    importantNotes: raw.important_notes,
    redemptionInstructions: raw.redemption_instructions,
    priceAdult: raw.price_adult,
    priceChild: raw.price_child,
    priceInfant: raw.price_infant,
    priceGroup: raw.price_group,
    priceOriginal: raw.price_original,
    currency: raw.currency,
    priceType: raw.price_type,
    discountPct: raw.discount_pct,
    priceFrom: raw.price_from,
    durationHours: raw.duration_hours,
    durationDays: raw.duration_days,
    departureTimes: raw.departure_times,
    operatingDays: raw.operating_days,
    seasonalAvailability: raw.seasonal_availability,
    advanceBookingDays: raw.advance_booking_days,
    instantConfirmation: raw.instant_confirmation,
    freeCancellation: raw.free_cancellation,
    cancellationHours: raw.cancellation_hours,
    cancellationPolicy: raw.cancellation_policy,
    boardingTime: raw.boarding_time,
    country: raw.country,
    city: raw.city,
    area: raw.area,
    address: raw.address,
    lat: raw.lat,
    lng: raw.lng,
    mapsLink: raw.maps_link,
    boardingPointName: raw.boarding_point_name,
    boardingPointDescription: raw.boarding_point_description,
    pickupAvailable: raw.pickup_available,
    pickupPoints: raw.pickup_points,
    vesselName: raw.vessel_name,
    vesselType: raw.vessel_type,
    vesselLengthM: raw.vessel_length_m,
    vesselYearBuilt: raw.vessel_year_built,
    vesselCapacity: raw.vessel_capacity,
    deckCount: raw.deck_count,
    onboardFacilities: raw.onboard_facilities,
    cruiseType: raw.cruise_type,
    routeDescription: raw.route_description,
    numberOfNights: raw.number_of_nights,
    mealIncluded: raw.meal_included,
    mealType: raw.meal_type,
    entertainmentIncluded: raw.entertainment_included,
    entertainmentDetails: raw.entertainment_details,
    wifiAvailable: raw.wifi_available,
    minAge: raw.min_age,
    maxAge: raw.max_age,
    agePricingBreaks: raw.age_pricing_breaks,
    dressCode: raw.dress_code,
    wheelchairAccessible: raw.wheelchair_accessible,
    languages: raw.languages,
    fitnessLevel: raw.fitness_level,
    pregnancyRestriction: raw.pregnancy_restriction,
    operatorName: raw.operator_name,
    operatorWebsite: raw.operator_website,
    operatorLicenseBody: raw.operator_license_body,
    operatorEstablishedYear: raw.operator_established_year,
    operatorFleetSize: raw.operator_fleet_size,
    operatorCertifications: raw.operator_certifications,
    coverImageUrl: raw.cover_image_url,
    galleryJson: raw.gallery_json,
    videoUrl: raw.video_url,
    rating: raw.rating,
    reviewCount: raw.review_count,
    rating5: raw.rating_5,
    rating4: raw.rating_4,
    rating3: raw.rating_3,
    rating2: raw.rating_2 ?? 0,
    rating1: raw.rating_1 ?? 0,
    reviewSnippets: raw.review_snippets,
    metaTitle: raw.meta_title,
    metaDescription: raw.meta_description,
    focusKeyword: raw.focus_keyword,
    jsonLd: raw.json_ld,
    canonicalUrl: raw.canonical_url,
    sourceUrl: raw.source_url,
    sourceUrls: raw.source_urls,
    sourceType: raw.source_type,
    verified: raw.verified,
    qualityScore: raw.quality_score,
    otherAttributes: raw.other_attributes,
    dedupHash: raw.dedup_hash,
    itinerary: (raw.itinerary ?? []).map((i) => ({
      id: i.id,
      order: i.order,
      dayNumber: i.day_number,
      timeLabel: i.time_label,
      portOrStop: i.port_or_stop,
      description: i.description,
      shoreExcursionAvailable: i.shore_excursion_available,
    })),
    cabins: (raw.cabins ?? []).map((c) => ({
      id: c.id,
      cabinType: c.cabin_type,
      cabinCount: c.cabin_count,
      maxOccupancy: c.max_occupancy,
      amenities: c.amenities,
      description: c.description,
    })),
    pricingTiers: (raw.pricing_tiers ?? []).map((p) => ({
      id: p.id,
      cabinType: p.cabin_type,
      priceAdult: p.price_adult,
      priceChild: p.price_child,
      priceInfant: p.price_infant,
      currency: p.currency,
      includesDescription: p.includes_description,
    })),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}
