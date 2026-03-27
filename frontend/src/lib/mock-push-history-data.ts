import type {
  PushBatch,
  BatchItem,
  RollbackHistoryEntry,
  PushHistorySummary,
} from "@/types/push-history";
import type { PushEnvironment } from "@/types/staging";

// ---- Helper: generate batch items ----
function generateBatchItems(
  batchId: string,
  destination: string,
  counts: { created: number; updated: number; failed: number; skipped: number }
): BatchItem[] {
  const items: BatchItem[] = [];
  const entityTypes = ["Hotel", "Attraction", "Transfer", "Restaurant"];
  const hotelNames = [
    "Grand Hyatt", "Marriott Resort", "Hilton Garden Inn", "Ritz-Carlton",
    "Four Seasons", "Sheraton Palace", "JW Marriott", "Waldorf Astoria",
    "Holiday Inn Express", "InterContinental",
  ];
  const attractionNames = [
    "Desert Safari Adventure", "Old Town Walking Tour", "Sunset Cruise",
    "Museum of Modern Art", "Aquarium Experience", "Theme Park Pass",
    "Hot Air Balloon Ride", "Snorkeling Tour", "City Sightseeing Bus",
    "Zip Line Adventure",
  ];

  let idx = 0;

  for (let i = 0; i < counts.created; i++) {
    const type = entityTypes[idx % 2];
    const name =
      type === "Hotel"
        ? hotelNames[i % hotelNames.length]
        : attractionNames[i % attractionNames.length];
    items.push({
      id: `item-${batchId}-c${i}`,
      entityType: type,
      entityId: `ent-${destination.toLowerCase()}-${idx}`,
      entityName: `${name} ${destination}`,
      operation: "create",
      status: "success",
      externalRecordId: `ext-${batchId}-${idx}`,
      errorMessage: null,
      changes: [
        { field: "name", oldValue: null, newValue: `${name} ${destination}` },
        { field: "status", oldValue: null, newValue: "active" },
      ],
    });
    idx++;
  }

  for (let i = 0; i < counts.updated; i++) {
    const type = entityTypes[idx % 4];
    const name =
      type === "Hotel"
        ? hotelNames[i % hotelNames.length]
        : attractionNames[i % attractionNames.length];
    items.push({
      id: `item-${batchId}-u${i}`,
      entityType: type,
      entityId: `ent-${destination.toLowerCase()}-existing-${idx}`,
      entityName: `${name} ${destination}`,
      operation: "update",
      status: "success",
      externalRecordId: `ext-${batchId}-${idx}`,
      errorMessage: null,
      changes: [
        {
          field: "pricing.amount",
          oldValue: `${150 + i * 10}`,
          newValue: `${160 + i * 10}`,
        },
        {
          field: "content.shortDesc",
          oldValue: "Previous description...",
          newValue: "Updated description with new details...",
        },
      ],
    });
    idx++;
  }

  for (let i = 0; i < counts.failed; i++) {
    items.push({
      id: `item-${batchId}-f${i}`,
      entityType: entityTypes[idx % 4],
      entityId: `ent-${destination.toLowerCase()}-fail-${idx}`,
      entityName: `Unknown Product #${idx}`,
      operation: "update",
      status: "failed",
      externalRecordId: null,
      errorMessage:
        i % 2 === 0
          ? "External API timeout: destination server did not respond within 30s"
          : "Validation error: required field 'pricing.currency' is missing",
      changes: [],
    });
    idx++;
  }

  for (let i = 0; i < counts.skipped; i++) {
    items.push({
      id: `item-${batchId}-s${i}`,
      entityType: entityTypes[idx % 4],
      entityId: `ent-${destination.toLowerCase()}-skip-${idx}`,
      entityName: `Skipped Product #${idx}`,
      operation: "update",
      status: "skipped",
      externalRecordId: null,
      errorMessage: "No changes detected since last push",
      changes: [],
    });
    idx++;
  }

  return items;
}

// ---- Push Batches ----
export const MOCK_PUSH_BATCHES: PushBatch[] = [
  {
    id: "pb-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    destination: "Dubai",
    environment: "production",
    status: "completed",
    records: { created: 45, updated: 112, failed: 3, skipped: 5 },
    triggeredBy: "Ahmed Hassan",
    approvedBy: "Sarah Ahmed",
    triggeredAt: "2026-03-26T08:30:00Z",
    completedAt: "2026-03-26T08:34:32Z",
    approvedAt: "2026-03-26T08:00:00Z",
    duration: 272000,
    items: generateBatchItems("pb-a1b2c3d4", "Dubai", {
      created: 45,
      updated: 112,
      failed: 3,
      skipped: 5,
    }),
  },
  {
    id: "pb-b2c3d4e5-f6a7-8901-bcde-f12345678901",
    destination: "Istanbul",
    environment: "production",
    status: "completed",
    records: { created: 34, updated: 78, failed: 2, skipped: 0 },
    triggeredBy: "Ahmed Hassan",
    approvedBy: "Sarah Ahmed",
    triggeredAt: "2026-03-25T14:00:00Z",
    completedAt: "2026-03-25T14:03:45Z",
    approvedAt: "2026-03-25T13:30:00Z",
    duration: 225000,
    items: generateBatchItems("pb-b2c3d4e5", "Istanbul", {
      created: 34,
      updated: 78,
      failed: 2,
      skipped: 0,
    }),
  },
  {
    id: "pb-c3d4e5f6-a7b8-9012-cdef-234567890123",
    destination: "Georgia",
    environment: "staging",
    status: "pending_approval",
    records: { created: 28, updated: 67, failed: 1, skipped: 3 },
    triggeredBy: "Sarah Ahmed",
    approvedBy: null,
    triggeredAt: "2026-03-25T06:15:00Z",
    completedAt: "2026-03-25T06:18:22Z",
    approvedAt: null,
    duration: 202000,
    items: generateBatchItems("pb-c3d4e5f6", "Georgia", {
      created: 28,
      updated: 67,
      failed: 1,
      skipped: 3,
    }),
  },
  {
    id: "pb-d4e5f6a7-b8c9-0123-defa-345678901234",
    destination: "Maldives",
    environment: "production",
    status: "failed",
    records: { created: 0, updated: 0, failed: 67, skipped: 0 },
    triggeredBy: "Sarah Ahmed",
    approvedBy: "Ahmed Hassan",
    triggeredAt: "2026-03-24T15:00:00Z",
    completedAt: "2026-03-24T15:01:12Z",
    approvedAt: "2026-03-24T14:45:00Z",
    duration: 72000,
    items: generateBatchItems("pb-d4e5f6a7", "Maldives", {
      created: 0,
      updated: 0,
      failed: 67,
      skipped: 0,
    }),
  },
  {
    id: "pb-e5f6a7b8-c9d0-1234-efab-456789012345",
    destination: "Abu Dhabi",
    environment: "production",
    status: "rolled_back",
    records: { created: 45, updated: 67, failed: 0, skipped: 2 },
    triggeredBy: "Ahmed Hassan",
    approvedBy: "Sarah Ahmed",
    triggeredAt: "2026-03-23T10:00:00Z",
    completedAt: "2026-03-23T10:05:30Z",
    approvedAt: "2026-03-23T09:45:00Z",
    duration: 330000,
    items: generateBatchItems("pb-e5f6a7b8", "Abu Dhabi", {
      created: 45,
      updated: 67,
      failed: 0,
      skipped: 2,
    }),
  },
  {
    id: "pb-f6a7b8c9-d0e1-2345-fabc-567890123456",
    destination: "Bangkok",
    environment: "staging",
    status: "completed",
    records: { created: 56, updated: 89, failed: 5, skipped: 8 },
    triggeredBy: "Sarah Ahmed",
    approvedBy: null,
    triggeredAt: "2026-03-22T18:00:00Z",
    completedAt: "2026-03-22T18:06:15Z",
    approvedAt: null,
    duration: 375000,
    items: generateBatchItems("pb-f6a7b8c9", "Bangkok", {
      created: 56,
      updated: 89,
      failed: 5,
      skipped: 8,
    }),
  },
  {
    id: "pb-a7b8c9d0-e1f2-3456-abcd-678901234567",
    destination: "Oman",
    environment: "production",
    status: "completed",
    records: { created: 42, updated: 88, failed: 3, skipped: 1 },
    triggeredBy: "Ahmed Hassan",
    approvedBy: "Sarah Ahmed",
    triggeredAt: "2026-03-21T11:00:00Z",
    completedAt: "2026-03-21T11:04:10Z",
    approvedAt: "2026-03-21T10:50:00Z",
    duration: 250000,
    items: generateBatchItems("pb-a7b8c9d0", "Oman", {
      created: 42,
      updated: 88,
      failed: 3,
      skipped: 1,
    }),
  },
  {
    id: "pb-b8c9d0e1-f2a3-4567-bcde-789012345678",
    destination: "Dubai",
    environment: "staging",
    status: "approved",
    records: { created: 67, updated: 134, failed: 2, skipped: 4 },
    triggeredBy: "Ahmed Hassan",
    approvedBy: "Sarah Ahmed",
    triggeredAt: "2026-03-20T08:00:00Z",
    completedAt: "2026-03-20T08:07:45Z",
    approvedAt: "2026-03-20T09:00:00Z",
    duration: 465000,
    items: generateBatchItems("pb-b8c9d0e1", "Dubai", {
      created: 67,
      updated: 134,
      failed: 2,
      skipped: 4,
    }),
  },
  {
    id: "pb-c9d0e1f2-a3b4-5678-cdef-890123456789",
    destination: "Istanbul",
    environment: "staging",
    status: "rolled_back",
    records: { created: 28, updated: 56, failed: 8, skipped: 0 },
    triggeredBy: "Sarah Ahmed",
    approvedBy: null,
    triggeredAt: "2026-03-19T14:00:00Z",
    completedAt: "2026-03-19T14:05:00Z",
    approvedAt: null,
    duration: 300000,
    items: generateBatchItems("pb-c9d0e1f2", "Istanbul", {
      created: 28,
      updated: 56,
      failed: 8,
      skipped: 0,
    }),
  },
  {
    id: "pb-d0e1f2a3-b4c5-6789-defa-901234567890",
    destination: "Abu Dhabi",
    environment: "production",
    status: "completed",
    records: { created: 33, updated: 72, failed: 1, skipped: 0 },
    triggeredBy: "Sarah Ahmed",
    approvedBy: "Ahmed Hassan",
    triggeredAt: "2026-03-18T09:30:00Z",
    completedAt: "2026-03-18T09:33:20Z",
    approvedAt: "2026-03-18T09:15:00Z",
    duration: 230000,
    items: generateBatchItems("pb-d0e1f2a3", "Abu Dhabi", {
      created: 33,
      updated: 72,
      failed: 1,
      skipped: 0,
    }),
  },
  {
    id: "pb-e1f2a3b4-c5d6-7890-efab-012345678901",
    destination: "Georgia",
    environment: "production",
    status: "in_progress",
    records: { created: 15, updated: 30, failed: 0, skipped: 0 },
    triggeredBy: "Ahmed Hassan",
    approvedBy: "Sarah Ahmed",
    triggeredAt: "2026-03-27T07:00:00Z",
    completedAt: null,
    approvedAt: "2026-03-27T06:45:00Z",
    duration: null,
    items: generateBatchItems("pb-e1f2a3b4", "Georgia", {
      created: 15,
      updated: 30,
      failed: 0,
      skipped: 0,
    }),
  },
  {
    id: "pb-f2a3b4c5-d6e7-8901-fabc-123456789012",
    destination: "Maldives",
    environment: "staging",
    status: "pending",
    records: { created: 12, updated: 34, failed: 0, skipped: 0 },
    triggeredBy: "Sarah Ahmed",
    approvedBy: null,
    triggeredAt: "2026-03-27T06:00:00Z",
    completedAt: null,
    approvedAt: null,
    duration: null,
    items: generateBatchItems("pb-f2a3b4c5", "Maldives", {
      created: 12,
      updated: 34,
      failed: 0,
      skipped: 0,
    }),
  },
];

// ---- Rollback History ----
export const MOCK_ROLLBACK_HISTORY: RollbackHistoryEntry[] = [
  {
    id: "rb-001",
    originalBatchId: "pb-e5f6a7b8-c9d0-1234-efab-456789012345",
    destination: "Abu Dhabi",
    initiatedBy: "Sarah Ahmed",
    reason:
      "Incorrect pricing data detected in 12 hotel products after production push. Rolled back pending data correction.",
    status: "completed",
    recordsAffected: 112,
    initiatedAt: "2026-03-23T12:00:00Z",
    completedAt: "2026-03-23T12:02:45Z",
  },
  {
    id: "rb-002",
    originalBatchId: "pb-c9d0e1f2-a3b4-5678-cdef-890123456789",
    destination: "Istanbul",
    initiatedBy: "Ahmed Hassan",
    reason:
      "Duplicate records found: 8 attractions were created that already existed. Rolling back to prevent duplicates in production.",
    status: "completed",
    recordsAffected: 84,
    initiatedAt: "2026-03-19T16:00:00Z",
    completedAt: "2026-03-19T16:03:10Z",
  },
  {
    id: "rb-003",
    originalBatchId: "pb-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    destination: "Dubai",
    initiatedBy: "Ahmed Hassan",
    reason:
      "Client requested immediate rollback due to incorrect category mappings affecting 15 attraction products.",
    status: "failed",
    recordsAffected: 0,
    initiatedAt: "2026-03-26T10:00:00Z",
    completedAt: "2026-03-26T10:01:30Z",
  },
];

// ---- Compute summary stats ----
export function computePushHistorySummary(
  batches: PushBatch[],
  dateFrom: string | null,
  dateTo: string | null,
  envFilter: "all" | PushEnvironment
): PushHistorySummary {
  const filtered = batches.filter((b) => {
    if (envFilter !== "all" && b.environment !== envFilter) return false;
    if (dateFrom && new Date(b.triggeredAt) < new Date(dateFrom)) return false;
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (new Date(b.triggeredAt) > to) return false;
    }
    return true;
  });

  return {
    totalPushes: filtered.length,
    totalCreated: filtered.reduce((sum, b) => sum + b.records.created, 0),
    totalUpdated: filtered.reduce((sum, b) => sum + b.records.updated, 0),
    totalFailed: filtered.reduce((sum, b) => sum + b.records.failed, 0),
  };
}
