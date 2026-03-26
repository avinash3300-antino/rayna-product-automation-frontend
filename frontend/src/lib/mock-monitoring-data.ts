import type {
  SourceHealthEntry,
  QueueLengthData,
  ErrorQueueEntry,
  JobMetricDay,
  Notification,
} from "@/types/monitoring";

// ---- Source Health ----
export const MOCK_SOURCE_HEALTH: SourceHealthEntry[] = [
  {
    id: "viator",
    name: "Viator API",
    status: "healthy",
    lastCheckTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    responseMs: 142,
    uptime: 99.8,
  },
  {
    id: "gyg",
    name: "GetYourGuide",
    status: "healthy",
    lastCheckTime: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    responseMs: 198,
    uptime: 99.5,
  },
  {
    id: "booking",
    name: "Booking.com",
    status: "degraded",
    lastCheckTime: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    responseMs: 890,
    uptime: 97.2,
  },
  {
    id: "hotelbeds",
    name: "Hotelbeds",
    status: "healthy",
    lastCheckTime: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    responseMs: 234,
    uptime: 99.9,
  },
  {
    id: "klook",
    name: "Klook",
    status: "down",
    lastCheckTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    responseMs: 0,
    uptime: 94.1,
  },
  {
    id: "agoda",
    name: "Agoda",
    status: "healthy",
    lastCheckTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    responseMs: 312,
    uptime: 99.3,
  },
];

// ---- Queue Lengths (last 12 data points) ----
export const MOCK_QUEUE_LENGTHS: QueueLengthData[] = Array.from(
  { length: 12 },
  (_, i) => {
    const t = new Date(Date.now() - (11 - i) * 5 * 60 * 1000);
    return {
      timestamp: t.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      queueA: Math.max(0, 12 + Math.floor(Math.sin(i * 0.8) * 8) + Math.floor(Math.random() * 4)),
      queueB: Math.max(0, 8 + Math.floor(Math.cos(i * 0.6) * 5) + Math.floor(Math.random() * 3)),
      enrichment: Math.max(0, 15 + Math.floor(Math.sin(i * 0.5 + 1) * 10) + Math.floor(Math.random() * 5)),
      error: Math.max(0, 3 + Math.floor(Math.sin(i * 0.3) * 3)),
    };
  }
);

// ---- Error Queue ----
export const MOCK_ERROR_QUEUE: ErrorQueueEntry[] = [
  {
    id: "err-001",
    stage: "ingestion",
    entityType: "Hotel",
    entityId: "prod-dubai-h123",
    errorCode: "TIMEOUT",
    errorMessage: "Connection timed out after 30s — Booking.com API",
    retryCount: 3,
    status: "open",
    assignedTo: "Ahmed Hassan",
    createdAt: "2026-03-25T08:12:00Z",
  },
  {
    id: "err-002",
    stage: "classification",
    entityType: "Attraction",
    entityId: "prod-dubai-a456",
    errorCode: "ML_FAIL",
    errorMessage: "Classification model returned low confidence (0.12) for category",
    retryCount: 1,
    status: "retrying",
    assignedTo: "Sarah Ahmed",
    createdAt: "2026-03-25T07:45:00Z",
  },
  {
    id: "err-003",
    stage: "enrichment",
    entityType: "Transfer",
    entityId: "prod-abudhabi-t789",
    errorCode: "DATA_MISSING",
    errorMessage: "Required field 'pricing.amount' missing from source data",
    retryCount: 0,
    status: "open",
    assignedTo: null,
    createdAt: "2026-03-25T09:30:00Z",
  },
  {
    id: "err-004",
    stage: "content_generation",
    entityType: "Hotel",
    entityId: "prod-georgia-h012",
    errorCode: "GPT_LIMIT",
    errorMessage: "OpenAI rate limit exceeded — daily quota reached",
    retryCount: 2,
    status: "open",
    assignedTo: "Ahmed Hassan",
    createdAt: "2026-03-25T06:20:00Z",
  },
  {
    id: "err-005",
    stage: "ingestion",
    entityType: "Restaurant",
    entityId: "prod-maldives-r345",
    errorCode: "PARSE_ERR",
    errorMessage: "Invalid JSON response from Klook API — unexpected token at pos 1247",
    retryCount: 5,
    status: "open",
    assignedTo: null,
    createdAt: "2026-03-25T05:15:00Z",
  },
  {
    id: "err-006",
    stage: "staging",
    entityType: "Attraction",
    entityId: "prod-istanbul-a678",
    errorCode: "DUP_KEY",
    errorMessage: "Duplicate product key detected in staging batch batch-005",
    retryCount: 0,
    status: "resolved",
    assignedTo: "Sarah Ahmed",
    createdAt: "2026-03-24T18:00:00Z",
  },
  {
    id: "err-007",
    stage: "classification",
    entityType: "Hotel",
    entityId: "prod-bangkok-h901",
    errorCode: "ML_FAIL",
    errorMessage: "Feature extraction failed — image URL returned 404",
    retryCount: 1,
    status: "dismissed",
    assignedTo: "Ahmed Hassan",
    createdAt: "2026-03-24T14:30:00Z",
  },
  {
    id: "err-008",
    stage: "enrichment",
    entityType: "Attraction",
    entityId: "prod-oman-a234",
    errorCode: "API_ERR",
    errorMessage: "Google Places API returned 503 — service unavailable",
    retryCount: 4,
    status: "retrying",
    assignedTo: null,
    createdAt: "2026-03-25T10:05:00Z",
  },
];

// ---- Job Metrics (last 30 days) ----
export const MOCK_JOB_METRICS: JobMetricDay[] = Array.from(
  { length: 30 },
  (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const base = 800 + Math.floor(Math.sin(i * 0.4) * 300);
    const jobs = 3 + Math.floor(Math.random() * 5);
    const failures = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      recordsProcessed: Math.max(200, base + Math.floor(Math.random() * 200)),
      jobsRun: jobs,
      failures,
    };
  }
);

// ---- Notifications ----
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-001",
    type: "error",
    message: "Klook API is down — 5 ingestion jobs affected",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    read: false,
    entityLink: "/monitoring",
  },
  {
    id: "notif-002",
    type: "approval",
    message: "Batch batch-001 (Dubai) is awaiting your approval",
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    read: false,
    entityLink: "/staging",
  },
  {
    id: "notif-003",
    type: "ingestion",
    message: "Dubai full ingestion completed — 1,243 records fetched",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    entityLink: "/ingestion",
  },
  {
    id: "notif-004",
    type: "push",
    message: "Istanbul batch pushed to production successfully",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    entityLink: "/staging",
  },
  {
    id: "notif-005",
    type: "error",
    message: "Booking.com API degraded — response times above 800ms",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true,
    entityLink: "/monitoring",
  },
  {
    id: "notif-006",
    type: "system",
    message: "Scheduled maintenance window: March 26, 02:00–04:00 UTC",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
    entityLink: null,
  },
  {
    id: "notif-007",
    type: "approval",
    message: "Batch batch-006 (Dubai) was rejected by Sarah Ahmed",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true,
    entityLink: "/staging",
  },
  {
    id: "notif-008",
    type: "ingestion",
    message: "Oman manual ingestion failed — authentication expired",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: true,
    entityLink: "/ingestion",
  },
];
