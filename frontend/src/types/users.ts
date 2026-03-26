// ---- User Roles ----
export type UserRole =
  | "admin"
  | "product_manager"
  | "content_reviewer"
  | "classification_reviewer"
  | "read_only";

// ---- User Status ----
export type UserStatus = "active" | "inactive" | "suspended";

// ---- User ----
export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  jobTitle: string | null;
  department: string | null;
  phone: string | null;
  timezone: string | null;
  roles: UserRole[];
  status: UserStatus;
  suspendedReason: string | null;
  suspendedAt: string | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Role History Entry ----
export interface RoleHistoryEntry {
  id: string;
  userId: string;
  action: "added" | "removed";
  role: UserRole;
  performedBy: string;
  performedAt: string;
}

// ---- Activity Log Entry ----
export interface UserActivityEntry {
  id: string;
  userId: string;
  action: string;
  entity: string;
  timestamp: string;
}

// ---- Invite Form Data ----
export interface InviteFormData {
  fullName: string;
  email: string;
  roles: UserRole[];
}

// ---- Config Maps ----
export const USER_ROLE_CONFIG: Record<
  UserRole,
  { label: string; color: string; description: string }
> = {
  admin: {
    label: "Admin",
    color: "bg-red-500/15 text-red-600 border-red-500/25",
    description: "Full access + user management + system config",
  },
  product_manager: {
    label: "Product Manager",
    color: "bg-blue-500/15 text-blue-600 border-blue-500/25",
    description: "Trigger runs, approve staging, manage packages",
  },
  content_reviewer: {
    label: "Content Reviewer",
    color: "bg-purple-500/15 text-purple-600 border-purple-500/25",
    description: "Review Queue B only",
  },
  classification_reviewer: {
    label: "Classification Reviewer",
    color: "bg-amber-500/15 text-amber-600 border-amber-500/25",
    description: "Review Queue A only",
  },
  read_only: {
    label: "Read Only",
    color: "bg-zinc-500/15 text-zinc-600 border-zinc-500/25",
    description: "View all, no write access",
  },
};

export const USER_STATUS_CONFIG: Record<
  UserStatus,
  { label: string; color: string }
> = {
  active: {
    label: "Active",
    color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25",
  },
  inactive: {
    label: "Inactive",
    color: "bg-zinc-500/15 text-zinc-600 border-zinc-500/25",
  },
  suspended: {
    label: "Suspended",
    color: "bg-red-500/15 text-red-600 border-red-500/25",
  },
};

// ---- Roles Reference Table Data ----
export const ROLES_REFERENCE: {
  role: UserRole;
  accessLevel: string;
  screens: string;
  writePermissions: string;
}[] = [
  {
    role: "admin",
    accessLevel: "Full",
    screens: "All screens",
    writePermissions: "All write + user management + system config",
  },
  {
    role: "product_manager",
    accessLevel: "High",
    screens: "Dashboard, Destinations, Ingestion, Products, Attributes, Booking Sources, Tags, Packages, Staging, Push History, Monitoring",
    writePermissions: "Trigger runs, approve/reject staging, create packages, manage products",
  },
  {
    role: "content_reviewer",
    accessLevel: "Limited",
    screens: "Dashboard, Review Queue B, Products (read)",
    writePermissions: "Approve/reject content in Review Queue B",
  },
  {
    role: "classification_reviewer",
    accessLevel: "Limited",
    screens: "Dashboard, Review Queue A, Products (read)",
    writePermissions: "Approve/reject classifications in Review Queue A",
  },
  {
    role: "read_only",
    accessLevel: "View Only",
    screens: "All screens (read-only)",
    writePermissions: "None",
  },
];
