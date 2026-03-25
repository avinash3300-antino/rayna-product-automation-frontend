import type {
  KpiStats,
  PipelineStageData,
  RecentJob,
  FreshnessRow,
  BookingSource,
  ProductsByDestination,
  ProductsByCategory,
  DataType,
  FreshnessLevel,
} from "@/types/dashboard";

export const MOCK_KPI_STATS: KpiStats = {
  totalProducts: 2847,
  productsByStatus: { draft: 312, staged: 145, published: 2390 },
  activeIngestionJobs: 3,
  isIngestionRunning: true,
  queueACount: 12,
  queueBCount: 8,
};

export const MOCK_PIPELINE_STAGES: PipelineStageData[] = [
  { id: "ingest", label: "Ingest", count: 24, color: "bg-chart-1" },
  { id: "classify", label: "Classify", count: 18, color: "bg-chart-2" },
  { id: "map", label: "Map", count: 12, color: "bg-chart-3" },
  { id: "content", label: "Content", count: 31, color: "bg-chart-4" },
  { id: "review", label: "Review", count: 20, color: "bg-chart-5" },
  { id: "stage", label: "Stage", count: 8, color: "bg-gold" },
  { id: "publish", label: "Publish", count: 5, color: "bg-emerald-500" },
];

export const MOCK_RECENT_JOBS: RecentJob[] = [
  {
    id: "job-001",
    destination: "Dubai",
    runType: "full",
    status: "completed",
    records: 1243,
    startedAt: "2026-03-25T08:30:00Z",
    durationMs: 342000,
  },
  {
    id: "job-002",
    destination: "Abu Dhabi",
    runType: "incremental",
    status: "running",
    records: 567,
    startedAt: "2026-03-25T09:15:00Z",
    durationMs: 0,
  },
  {
    id: "job-003",
    destination: "Oman",
    runType: "manual",
    status: "failed",
    records: 0,
    startedAt: "2026-03-25T07:00:00Z",
    durationMs: 18000,
  },
  {
    id: "job-004",
    destination: "Georgia",
    runType: "incremental",
    status: "completed",
    records: 389,
    startedAt: "2026-03-24T22:00:00Z",
    durationMs: 156000,
  },
  {
    id: "job-005",
    destination: "Maldives",
    runType: "full",
    status: "queued",
    records: 0,
    startedAt: "2026-03-25T10:00:00Z",
    durationMs: 0,
  },
];

const DATA_TYPES: DataType[] = [
  "hotel_pricing",
  "attraction_prices",
  "operating_hours",
  "descriptions",
  "images",
];

// Deterministic freshness data
const FRESHNESS_MAP: Record<string, FreshnessLevel[]> = {
  Dubai: ["fresh", "fresh", "fresh", "warning", "fresh"],
  "Abu Dhabi": ["fresh", "warning", "fresh", "fresh", "stale"],
  Oman: ["warning", "stale", "fresh", "warning", "fresh"],
  Georgia: ["stale", "fresh", "warning", "fresh", "warning"],
  Maldives: ["fresh", "fresh", "stale", "fresh", "fresh"],
  Bali: ["warning", "fresh", "fresh", "stale", "warning"],
  Thailand: ["fresh", "warning", "warning", "fresh", "fresh"],
};

export const MOCK_FRESHNESS_DATA: FreshnessRow[] = Object.entries(
  FRESHNESS_MAP
).map(([destination, levels]) => ({
  destination,
  cells: Object.fromEntries(
    DATA_TYPES.map((dt, i) => [
      dt,
      {
        level: levels[i],
        lastUpdated: new Date(
          Date.now() -
            (levels[i] === "fresh"
              ? 2 * 60 * 60 * 1000
              : levels[i] === "warning"
                ? 3 * 24 * 60 * 60 * 1000
                : 8 * 24 * 60 * 60 * 1000)
        ).toISOString(),
      },
    ])
  ) as FreshnessRow["cells"],
}));

export const MOCK_BOOKING_SOURCES: BookingSource[] = [
  {
    id: "viator",
    name: "Viator",
    status: "healthy",
    lastPing: "2026-03-25T10:29:00Z",
    responseMs: 142,
  },
  {
    id: "gyg",
    name: "GetYourGuide",
    status: "healthy",
    lastPing: "2026-03-25T10:29:00Z",
    responseMs: 198,
  },
  {
    id: "booking",
    name: "Booking.com",
    status: "degraded",
    lastPing: "2026-03-25T10:28:00Z",
    responseMs: 890,
  },
  {
    id: "hotelbeds",
    name: "Hotelbeds",
    status: "healthy",
    lastPing: "2026-03-25T10:29:00Z",
    responseMs: 234,
  },
];

export const MOCK_PRODUCTS_BY_DESTINATION: ProductsByDestination[] = [
  { destination: "Dubai", count: 892 },
  { destination: "Abu Dhabi", count: 534 },
  { destination: "Oman", count: 312 },
  { destination: "Georgia", count: 287 },
  { destination: "Maldives", count: 243 },
  { destination: "Bali", count: 198 },
  { destination: "Thailand", count: 156 },
  { destination: "Turkey", count: 125 },
];

export const MOCK_PRODUCTS_BY_CATEGORY: ProductsByCategory[] = [
  { category: "Attractions", count: 1240, color: "hsl(var(--chart-1))" },
  { category: "Hotels", count: 890, color: "hsl(var(--chart-2))" },
  { category: "Transfers", count: 412, color: "hsl(var(--chart-3))" },
  { category: "Restaurants", count: 305, color: "hsl(var(--chart-4))" },
];
