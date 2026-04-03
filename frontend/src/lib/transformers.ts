import type {
  BackendUserResponse,
  BackendAuditLogResponse,
  BackendPaginatedResponse,
  BackendDestinationListItem,
} from "@/types/api-responses";
import type { Destination, DestinationStatus, IngestionRunStatus, ProductCategory } from "@/types/destinations";
import type { AppUser, UserRole, UserStatus } from "@/types/users";
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
