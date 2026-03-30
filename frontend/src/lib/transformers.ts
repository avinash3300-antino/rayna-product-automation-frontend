import type {
  BackendUserResponse,
  BackendAuditLogResponse,
  BackendPaginatedResponse,
} from "@/types/api-responses";
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
  if (lower.includes("edit") || lower.includes("updat")) return "edited";
  if (lower.includes("tag")) return "tagged";
  if (lower.includes("assign")) return "assigned";
  if (lower.includes("publish")) return "published";
  if (lower.includes("roll") || lower.includes("revert")) return "rolled_back";
  if (lower.includes("trigger")) return "triggered";
  if (lower.includes("review")) return "reviewed";
  if (lower.includes("login")) return "login";
  return "edited";
}

export function transformAuditLogToActivity(
  raw: BackendAuditLogResponse
): ProfileActivityEntry {
  return {
    id: raw.id,
    action: raw.action,
    entity: `${raw.entity_type}:${raw.entity_id}`,
    timestamp: raw.created_at,
    actionType: mapActionToActionType(raw.action),
  };
}
