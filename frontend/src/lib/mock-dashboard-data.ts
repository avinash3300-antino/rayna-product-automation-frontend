import type {
  FreshnessRow,
  BookingSource,
  DataType,
  FreshnessLevel,
} from "@/types/dashboard";

// ── Static data kept until backend tracking is implemented ──────────

const DATA_TYPES: DataType[] = [
  "hotel_pricing",
  "attraction_prices",
  "operating_hours",
  "descriptions",
  "images",
];

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
