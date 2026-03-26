// ---- Personal Info ----
export interface PersonalInfo {
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  phone: string;
  timezone: string;
  language: string;
}

// ---- Profile Quick Stats ----
export interface ProfileStats {
  queueAReviewed: number;
  queueBReviewed: number;
  productsApproved: number;
  jobsTriggered: number;
}

// ---- Active Session ----
export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

// ---- Change Password Form ----
export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ---- Password Strength ----
export type PasswordStrength = "weak" | "fair" | "strong" | "very-strong";

// ---- Notification Preference ----
export interface NotificationPreference {
  id: string;
  event: string;
  inApp: boolean;
  email: boolean;
}

// ---- UI Preferences ----
export interface UIPreferences {
  sidebarDefaultCollapsed: boolean;
  productViewMode: "grid" | "table";
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  itemsPerPage: number;
  theme: "light" | "dark" | "system";
}

// ---- Profile Activity ----
export type ProfileActionType =
  | "approved"
  | "rejected"
  | "edited"
  | "tagged"
  | "assigned"
  | "published"
  | "rolled_back"
  | "triggered"
  | "reviewed"
  | "login";

export interface ProfileActivityEntry {
  id: string;
  action: string;
  entity: string;
  entityLink?: string;
  timestamp: string;
  actionType: ProfileActionType;
}

export const PROFILE_ACTION_TYPE_CONFIG: Record<
  ProfileActionType,
  { label: string; color: string }
> = {
  approved: {
    label: "Approved",
    color: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-500",
  },
  edited: {
    label: "Edited",
    color: "bg-amber-500",
  },
  tagged: {
    label: "Tagged",
    color: "bg-purple-500",
  },
  assigned: {
    label: "Assigned",
    color: "bg-blue-500",
  },
  published: {
    label: "Published",
    color: "bg-indigo-500",
  },
  rolled_back: {
    label: "Rolled Back",
    color: "bg-orange-500",
  },
  triggered: {
    label: "Triggered",
    color: "bg-cyan-500",
  },
  reviewed: {
    label: "Reviewed",
    color: "bg-sky-500",
  },
  login: {
    label: "Login",
    color: "bg-zinc-500",
  },
};
