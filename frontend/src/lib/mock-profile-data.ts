import type {
  PersonalInfo,
  ProfileStats,
  ActiveSession,
  NotificationPreference,
  UIPreferences,
  ProfileActivityEntry,
} from "@/types/profile";

// Current logged-in user's personal info
export const MOCK_PERSONAL_INFO: PersonalInfo = {
  fullName: "Senthil Kumar",
  email: "senthil@raynatours.com",
  jobTitle: "Senior Product Manager",
  department: "Product Operations",
  phone: "+971 50 123 4567",
  timezone: "Asia/Dubai",
  language: "en",
};

export const MOCK_PROFILE_STATS: ProfileStats = {
  queueAReviewed: 142,
  queueBReviewed: 87,
  productsApproved: 312,
  jobsTriggered: 56,
};

export const MOCK_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: "sess-001",
    device: "Windows PC",
    browser: "Chrome 122",
    ip: "192.168.1.100",
    location: "Dubai, UAE",
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isCurrent: true,
  },
  {
    id: "sess-002",
    device: "iPhone 15",
    browser: "Safari 17",
    ip: "10.0.0.45",
    location: "Dubai, UAE",
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isCurrent: false,
  },
  {
    id: "sess-003",
    device: "MacBook Pro",
    browser: "Firefox 123",
    ip: "172.16.0.12",
    location: "Abu Dhabi, UAE",
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isCurrent: false,
  },
];

export const MOCK_NOTIFICATION_PREFERENCES: NotificationPreference[] = [
  { id: "np-1", event: "New Queue B items assigned to me", inApp: true, email: true },
  { id: "np-2", event: "Content regeneration requested", inApp: true, email: false },
  { id: "np-3", event: "My approved content rolled back", inApp: true, email: true },
  { id: "np-4", event: "Ingestion job completes", inApp: true, email: false },
  { id: "np-5", event: "Staging batch ready for approval", inApp: true, email: true },
  { id: "np-6", event: "Product pushed to live", inApp: true, email: false },
  { id: "np-7", event: "System alert or error", inApp: true, email: true },
  { id: "np-8", event: "Weekly activity digest", inApp: false, email: true },
];

export const MOCK_UI_PREFERENCES: UIPreferences = {
  sidebarDefaultCollapsed: false,
  productViewMode: "grid",
  dateFormat: "DD/MM/YYYY",
  itemsPerPage: 25,
  theme: "light",
};

export const MOCK_PROFILE_ACTIVITY: ProfileActivityEntry[] = [
  {
    id: "pa-01",
    action: "Approved content for Desert Safari Premium (Queue B)",
    entity: "Desert Safari Premium",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    actionType: "approved",
  },
  {
    id: "pa-02",
    action: "Triggered ingestion run for Dubai",
    entity: "Dubai - Full Sync",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    actionType: "triggered",
  },
  {
    id: "pa-03",
    action: "Rejected classification for prod-dubai-a456 — routed back to Queue A",
    entity: "prod-dubai-a456",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actionType: "rejected",
  },
  {
    id: "pa-04",
    action: "Applied tag Adventure & Outdoor to 12 products in bulk",
    entity: "Adventure & Outdoor",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    actionType: "tagged",
  },
  {
    id: "pa-05",
    action: "Approved staging batch batch-001 (Dubai)",
    entity: "batch-001 (Dubai)",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    actionType: "approved",
  },
  {
    id: "pa-06",
    action: "Edited product attributes for Burj Khalifa Observation Deck",
    entity: "Burj Khalifa Observation Deck",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    actionType: "edited",
  },
  {
    id: "pa-07",
    action: "Reviewed classification for prod-istanbul-a678",
    entity: "prod-istanbul-a678",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    actionType: "reviewed",
  },
  {
    id: "pa-08",
    action: "Published 45 products to live for Abu Dhabi destination",
    entity: "Abu Dhabi batch",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    actionType: "published",
  },
  {
    id: "pa-09",
    action: "Assigned 8 Queue A items to Raj Patel",
    entity: "Queue A items",
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    actionType: "assigned",
  },
  {
    id: "pa-10",
    action: "Rolled back content for Airport Transfer DXB",
    entity: "Airport Transfer DXB",
    timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    actionType: "rolled_back",
  },
  {
    id: "pa-11",
    action: "Approved content for La Petite Maison (Queue B)",
    entity: "La Petite Maison",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    actionType: "approved",
  },
  {
    id: "pa-12",
    action: "Triggered ingestion run for Istanbul",
    entity: "Istanbul - Incremental",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    actionType: "triggered",
  },
  {
    id: "pa-13",
    action: "Rejected content for Tbilisi Food Tour — missing images",
    entity: "Tbilisi Food Tour",
    timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    actionType: "rejected",
  },
  {
    id: "pa-14",
    action: "Edited pricing attributes for Maldives Sunset Cruise",
    entity: "Maldives Sunset Cruise",
    timestamp: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
    actionType: "edited",
  },
  {
    id: "pa-15",
    action: "Logged in from Chrome / Windows",
    entity: "Chrome / Windows",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    actionType: "login",
  },
  {
    id: "pa-16",
    action: "Reviewed classification for prod-maldives-r345",
    entity: "prod-maldives-r345",
    timestamp: new Date(Date.now() - 80 * 60 * 60 * 1000).toISOString(),
    actionType: "reviewed",
  },
  {
    id: "pa-17",
    action: "Applied tag Beach & Water Sports to 6 products in bulk",
    entity: "Beach & Water Sports",
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    actionType: "tagged",
  },
  {
    id: "pa-18",
    action: "Published 22 products to live for Istanbul destination",
    entity: "Istanbul batch",
    timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    actionType: "published",
  },
];

export const ACTIVITY_PAGE_SIZE = 5;

export const DEPARTMENT_OPTIONS = [
  "Product Operations",
  "Content Team",
  "Engineering",
  "Marketing",
  "Sales",
  "Customer Support",
  "Management",
];

export const DATE_FORMAT_OPTIONS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export const ITEMS_PER_PAGE_OPTIONS = [25, 50, 100];
