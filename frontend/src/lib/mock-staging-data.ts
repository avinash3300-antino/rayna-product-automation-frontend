import type {
  StagingBatch,
  PushHistoryEntry,
  BatchProductRecord,
} from "@/types/staging";

// ---- Helper: generate batch product records ----
function generateProducts(
  destination: string,
  counts: { created: number; updated: number; failed: number }
): BatchProductRecord[] {
  const products: BatchProductRecord[] = [];
  const categories = ["hotels", "attractions", "transfers", "restaurants"] as const;
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
    const cat = categories[idx % 2 === 0 ? 0 : 1];
    const name = cat === "hotels" ? hotelNames[i % hotelNames.length] : attractionNames[i % attractionNames.length];
    products.push({
      id: `rec-${destination.toLowerCase()}-c${i}`,
      productId: `prod-${destination.toLowerCase()}-${idx}`,
      productName: `${name} ${destination}`,
      destination,
      category: cat,
      changeType: "created",
      changes: [
        { field: "name", oldValue: null, newValue: `${name} ${destination}` },
        { field: "status", oldValue: null, newValue: "staged" },
        { field: "category", oldValue: null, newValue: cat },
      ],
      completeness: Math.floor(Math.random() * 30) + 70,
      qualityScore: Math.floor(Math.random() * 20) + 80,
    });
    idx++;
  }

  for (let i = 0; i < counts.updated; i++) {
    const cat = categories[idx % 4];
    const name = cat === "hotels" ? hotelNames[i % hotelNames.length] : attractionNames[i % attractionNames.length];
    products.push({
      id: `rec-${destination.toLowerCase()}-u${i}`,
      productId: `prod-${destination.toLowerCase()}-existing-${idx}`,
      productName: `${name} ${destination}`,
      destination,
      category: cat,
      changeType: "updated",
      changes: [
        { field: "pricing.amount", oldValue: `${150 + i * 10}`, newValue: `${160 + i * 10}` },
        { field: "content.shortDesc", oldValue: "Previous description text...", newValue: "Updated description with new details..." },
        { field: "attributes.operatingHours", oldValue: "9:00 AM - 5:00 PM", newValue: "8:00 AM - 6:00 PM" },
      ],
      completeness: Math.floor(Math.random() * 10) + 90,
      qualityScore: Math.floor(Math.random() * 10) + 88,
    });
    idx++;
  }

  for (let i = 0; i < counts.failed; i++) {
    const cat = categories[idx % 4];
    products.push({
      id: `rec-${destination.toLowerCase()}-f${i}`,
      productId: `prod-${destination.toLowerCase()}-fail-${idx}`,
      productName: `Unknown Product #${idx}`,
      destination,
      category: cat,
      changeType: "failed",
      changes: [],
      completeness: Math.floor(Math.random() * 30) + 20,
      qualityScore: Math.floor(Math.random() * 30) + 30,
    });
    idx++;
  }

  return products;
}

// ---- Pending Approval Batches ----
export const MOCK_STAGING_BATCHES: StagingBatch[] = [
  {
    id: "batch-001",
    jobId: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    destination: "Dubai",
    environment: "staging",
    status: "pending_approval",
    records: { created: 45, updated: 112, failed: 3 },
    products: generateProducts("Dubai", { created: 45, updated: 112, failed: 3 }),
    createdAt: "2026-03-25T08:30:00Z",
    reviewedAt: null,
    reviewedBy: null,
    reviewNotes: null,
    pushedAt: null,
    pushedBy: null,
  },
  {
    id: "batch-002",
    jobId: "e5f6a7b8-c9d0-1234-efab-345678901234",
    destination: "Georgia",
    environment: "staging",
    status: "pending_approval",
    records: { created: 28, updated: 67, failed: 1 },
    products: generateProducts("Georgia", { created: 28, updated: 67, failed: 1 }),
    createdAt: "2026-03-25T06:15:00Z",
    reviewedAt: null,
    reviewedBy: null,
    reviewNotes: null,
    pushedAt: null,
    pushedBy: null,
  },
  {
    id: "batch-003",
    jobId: "f6a7b8c9-d0e1-2345-fabc-456789012345",
    destination: "Maldives",
    environment: "staging",
    status: "pending_approval",
    records: { created: 12, updated: 34, failed: 0 },
    products: generateProducts("Maldives", { created: 12, updated: 34, failed: 0 }),
    createdAt: "2026-03-24T22:45:00Z",
    reviewedAt: null,
    reviewedBy: null,
    reviewNotes: null,
    pushedAt: null,
    pushedBy: null,
  },
  {
    id: "batch-004",
    jobId: "a7b8c9d0-e1f2-3456-abcd-567890123456",
    destination: "Bangkok",
    environment: "staging",
    status: "approved",
    records: { created: 56, updated: 89, failed: 5 },
    products: generateProducts("Bangkok", { created: 56, updated: 89, failed: 5 }),
    createdAt: "2026-03-24T18:00:00Z",
    reviewedAt: "2026-03-24T19:30:00Z",
    reviewedBy: "Sarah Ahmed",
    reviewNotes: "All products verified. Pricing looks correct. Approved for production push.",
    pushedAt: null,
    pushedBy: null,
  },
  {
    id: "batch-005",
    jobId: "b8c9d0e1-f2a3-4567-bcde-678901234567",
    destination: "Istanbul",
    environment: "production",
    status: "pushed",
    records: { created: 34, updated: 78, failed: 2 },
    products: generateProducts("Istanbul", { created: 34, updated: 78, failed: 2 }),
    createdAt: "2026-03-23T14:00:00Z",
    reviewedAt: "2026-03-23T15:30:00Z",
    reviewedBy: "Ahmed Hassan",
    reviewNotes: "Content quality is high. Minor failed records are acceptable.",
    pushedAt: "2026-03-23T16:00:00Z",
    pushedBy: "Ahmed Hassan",
  },
  {
    id: "batch-006",
    jobId: "c9d0e1f2-a3b4-5678-cdef-789012345678",
    destination: "Dubai",
    environment: "production",
    status: "rejected",
    records: { created: 120, updated: 245, failed: 18 },
    products: generateProducts("Dubai", { created: 120, updated: 245, failed: 18 }),
    createdAt: "2026-03-22T10:00:00Z",
    reviewedAt: "2026-03-22T11:45:00Z",
    reviewedBy: "Sarah Ahmed",
    reviewNotes: "Too many failed records (18). Pricing inconsistencies found in 5 hotel products. Needs re-ingestion.",
    pushedAt: null,
    pushedBy: null,
  },
];

// ---- Push History ----
export const MOCK_PUSH_HISTORY: PushHistoryEntry[] = [
  {
    id: "push-001",
    batchId: "batch-005",
    destination: "Istanbul",
    environment: "production",
    status: "success",
    records: { created: 34, updated: 78, failed: 2 },
    triggeredBy: "Ahmed Hassan",
    pushedAt: "2026-03-23T16:00:00Z",
    rolledBackAt: null,
    rollbackReason: null,
  },
  {
    id: "push-002",
    batchId: "batch-prev-001",
    destination: "Dubai",
    environment: "production",
    status: "success",
    records: { created: 89, updated: 156, failed: 4 },
    triggeredBy: "Sarah Ahmed",
    pushedAt: "2026-03-22T14:30:00Z",
    rolledBackAt: null,
    rollbackReason: null,
  },
  {
    id: "push-003",
    batchId: "batch-prev-002",
    destination: "Abu Dhabi",
    environment: "production",
    status: "rolled_back",
    records: { created: 45, updated: 67, failed: 0 },
    triggeredBy: "Ahmed Hassan",
    pushedAt: "2026-03-21T10:00:00Z",
    rolledBackAt: "2026-03-21T12:30:00Z",
    rollbackReason: "Incorrect pricing data detected in 12 hotel products after production push. Rolled back pending data correction.",
  },
  {
    id: "push-004",
    batchId: "batch-prev-003",
    destination: "Georgia",
    environment: "staging",
    status: "success",
    records: { created: 23, updated: 45, failed: 1 },
    triggeredBy: "Sarah Ahmed",
    pushedAt: "2026-03-20T18:00:00Z",
    rolledBackAt: null,
    rollbackReason: null,
  },
  {
    id: "push-005",
    batchId: "batch-prev-004",
    destination: "Maldives",
    environment: "production",
    status: "success",
    records: { created: 15, updated: 30, failed: 0 },
    triggeredBy: "Ahmed Hassan",
    pushedAt: "2026-03-20T09:00:00Z",
    rolledBackAt: null,
    rollbackReason: null,
  },
  {
    id: "push-006",
    batchId: "batch-prev-005",
    destination: "Bangkok",
    environment: "production",
    status: "failed",
    records: { created: 0, updated: 0, failed: 67 },
    triggeredBy: "Sarah Ahmed",
    pushedAt: "2026-03-19T15:00:00Z",
    rolledBackAt: null,
    rollbackReason: null,
  },
  {
    id: "push-007",
    batchId: "batch-prev-006",
    destination: "Dubai",
    environment: "staging",
    status: "success",
    records: { created: 67, updated: 134, failed: 2 },
    triggeredBy: "Ahmed Hassan",
    pushedAt: "2026-03-19T08:00:00Z",
    rolledBackAt: null,
    rollbackReason: null,
  },
  {
    id: "push-008",
    batchId: "batch-prev-007",
    destination: "Oman",
    environment: "production",
    status: "success",
    records: { created: 42, updated: 88, failed: 3 },
    triggeredBy: "Sarah Ahmed",
    pushedAt: "2026-03-18T11:00:00Z",
    rolledBackAt: null,
    rollbackReason: null,
  },
  {
    id: "push-009",
    batchId: "batch-prev-008",
    destination: "Istanbul",
    environment: "staging",
    status: "rolled_back",
    records: { created: 28, updated: 56, failed: 8 },
    triggeredBy: "Ahmed Hassan",
    pushedAt: "2026-03-17T14:00:00Z",
    rolledBackAt: "2026-03-17T16:45:00Z",
    rollbackReason: "Duplicate records found: 8 attractions were created that already existed. Rolling back to prevent duplicates in production.",
  },
  {
    id: "push-010",
    batchId: "batch-prev-009",
    destination: "Abu Dhabi",
    environment: "production",
    status: "success",
    records: { created: 33, updated: 72, failed: 1 },
    triggeredBy: "Sarah Ahmed",
    pushedAt: "2026-03-16T09:30:00Z",
    rolledBackAt: null,
    rollbackReason: null,
  },
];
