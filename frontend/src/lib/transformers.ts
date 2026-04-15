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
} from "@/types/api-responses";
import type { Destination, DestinationStatus, IngestionRunStatus, ProductCategory } from "@/types/destinations";
import type { AppUser, UserRole, UserStatus } from "@/types/users";
import type { DiscoveryRun, ScrapeSource } from "@/types/discovery";
import type { ScrapeJob } from "@/types/scraping";
import type { ActivityCardItem, Activity, ActivityStatus, ActivityReview, ActivityReviewList } from "@/types/activities";
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

/** Map raw backend action strings to human-readable descriptions */
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
  // Fallback: replace underscores with spaces and capitalize each word
  return action
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Map raw entity_type to a friendly label */
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

  // Hide raw UUIDs for user-related entities
  if (entityType === "auth_users" || entityType === "users" || entityType === "sessions") {
    return label;
  }

  // For other entities, show a shortened ID if it's a UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(entityId);
  if (isUuid) {
    return `${label} (${entityId.slice(0, 8)})`;
  }

  return `${label}: ${entityId}`;
}

// ---- Destination transformer ----

const VALID_INGESTION_STATUSES = new Set(["completed", "running", "failed", "queued"]);

export function transformDestinationResponse(
  raw: BackendDestinationListItem
): Destination {
  const productCounts = {
    hotels: raw.product_counts?.hotels ?? 0,
    attractions: raw.product_counts?.attractions ?? 0,
    transfers: raw.product_counts?.transfers ?? 0,
    restaurants: raw.product_counts?.restaurants ?? 0,
  } as Record<ProductCategory, number>;

  let lastIngestionRun = null;
  if (raw.last_ingestion_run) {
    const status = VALID_INGESTION_STATUSES.has(raw.last_ingestion_run.status)
      ? (raw.last_ingestion_run.status as IngestionRunStatus)
      : ("queued" as IngestionRunStatus);
    lastIngestionRun = {
      date: raw.last_ingestion_run.date ?? new Date().toISOString(),
      status,
      recordsProcessed: raw.last_ingestion_run.records_processed,
      durationMs: raw.last_ingestion_run.duration_ms,
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
    lastIngestionRun,
    intelligenceFilter: {
      lastRunDate: null,
      keywordsFound: 0,
      sourcesApproved: 0,
    },
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
    languages: raw.languages,
    coverImageUrl: raw.cover_image_url,
    galleryJson: raw.gallery_json,
    videoUrl: raw.video_url,
    rating: raw.rating,
    reviewCount: raw.review_count,
    rating5: raw.rating_5,
    rating4: raw.rating_4,
    rating3: raw.rating_3,
    reviewSnippets: raw.review_snippets,
    metaTitle: raw.meta_title,
    metaDescription: raw.meta_description,
    focusKeyword: raw.focus_keyword,
    jsonLd: raw.json_ld,
    canonicalUrl: raw.canonical_url,
    sourceUrl: raw.source_url,
    sourceType: raw.source_type,
    operatorName: raw.operator_name,
    verified: raw.verified,
    dedupHash: raw.dedup_hash,
    qualityScore: raw.quality_score,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// ---- Review transformers ----

export function transformReviewResponse(raw: BackendReviewResponse): ActivityReview {
  return {
    id: raw.id,
    activityId: raw.activity_id,
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
    activityId: raw.activity_id,
    total: raw.total,
    avgRating: raw.avg_rating,
    platformCounts: raw.platform_counts,
    reviews: raw.reviews.map(transformReviewResponse),
  };
}
