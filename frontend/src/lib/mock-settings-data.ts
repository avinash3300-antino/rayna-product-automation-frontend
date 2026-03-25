import type {
  GeneralSettings,
  FreshnessRule,
  PackageType,
  PackagePricingDefaults,
  ApiIntegration,
  NotificationRule,
  EmailSenderConfig,
  ApiAuditRecord,
} from "@/types/settings";

// ── Tab 1: General ──

export const MOCK_GENERAL_SETTINGS: GeneralSettings = {
  identity: {
    systemName: "Rayna Tours \u2013 Product Automation System",
    defaultCurrency: "AED",
    defaultTimezone: "Asia/Dubai",
    defaultLanguage: "en",
  },
  pipeline: {
    autoClassifyThreshold: 0.9,
    humanReviewThreshold: 0.7,
    scrapingConfidenceMin: 0.7,
    contentReviewSamplingRate: 25,
    maxContentRegenAttempts: 3,
  },
  ingestion: {
    filterAutoProceedTimeoutHours: 24,
    maxRecordsPerMinute: 100,
    maxRetryAttempts: 3,
  },
};

// ── Tab 2: Data Freshness Rules ──

export const MOCK_FRESHNESS_RULES: FreshnessRule[] = [
  {
    id: "fr-1",
    dataType: "hotel_pricing",
    thresholdHours: 48,
    humanReadable: "2 days",
    staleAction: "flag_refresh",
  },
  {
    id: "fr-2",
    dataType: "attraction_prices",
    thresholdHours: 72,
    humanReadable: "3 days",
    staleAction: "flag_refresh",
  },
  {
    id: "fr-3",
    dataType: "operating_hours",
    thresholdHours: 168,
    humanReadable: "7 days",
    staleAction: "flag_human_review",
  },
  {
    id: "fr-4",
    dataType: "descriptions",
    thresholdHours: 720,
    humanReadable: "30 days",
    staleAction: "auto_refresh_ai",
  },
  {
    id: "fr-5",
    dataType: "images",
    thresholdHours: 2160,
    humanReadable: "90 days",
    staleAction: "flag_manual_review",
  },
  {
    id: "fr-6",
    dataType: "geolocation",
    thresholdHours: 4320,
    humanReadable: "180 days",
    staleAction: "flag_manual_verification",
  },
];

// ── Tab 3: Package Rules ──

const DEFAULT_RULES = {
  min_hotels: 1,
  max_hotels: 5,
  min_attractions: 0,
  max_attractions: 10,
  min_transfers: 0,
  requires_booking_source: true,
  requires_tag_match: false,
};

export const MOCK_PACKAGE_TYPES: PackageType[] = [
  {
    id: "pt-1",
    typeName: "City Explorer",
    code: "CITY_EXPLORER",
    defaultMarginPercent: 20,
    minNights: 2,
    maxNights: 5,
    active: true,
    rules: { ...DEFAULT_RULES, min_attractions: 2, max_attractions: 6 },
    ruleVersions: [
      {
        version: 1,
        savedAt: "2025-11-01T10:00:00Z",
        savedBy: "admin@rayna.com",
        rules: { ...DEFAULT_RULES, min_attractions: 1, max_attractions: 5 },
      },
      {
        version: 2,
        savedAt: "2025-12-15T14:30:00Z",
        savedBy: "admin@rayna.com",
        rules: { ...DEFAULT_RULES, min_attractions: 2, max_attractions: 6 },
      },
    ],
  },
  {
    id: "pt-2",
    typeName: "Beach Resort",
    code: "BEACH_RESORT",
    defaultMarginPercent: 25,
    minNights: 3,
    maxNights: 14,
    active: true,
    rules: { ...DEFAULT_RULES, min_hotels: 1, max_hotels: 3 },
    ruleVersions: [
      {
        version: 1,
        savedAt: "2025-11-01T10:00:00Z",
        savedBy: "admin@rayna.com",
        rules: { ...DEFAULT_RULES, min_hotels: 1, max_hotels: 3 },
      },
    ],
  },
  {
    id: "pt-3",
    typeName: "Adventure",
    code: "ADVENTURE",
    defaultMarginPercent: 22,
    minNights: 1,
    maxNights: 7,
    active: true,
    rules: {
      ...DEFAULT_RULES,
      min_attractions: 3,
      requires_tag_match: true,
    },
    ruleVersions: [
      {
        version: 1,
        savedAt: "2025-11-01T10:00:00Z",
        savedBy: "admin@rayna.com",
        rules: {
          ...DEFAULT_RULES,
          min_attractions: 3,
          requires_tag_match: true,
        },
      },
    ],
  },
  {
    id: "pt-4",
    typeName: "Cultural Heritage",
    code: "CULTURAL_HERITAGE",
    defaultMarginPercent: 18,
    minNights: 2,
    maxNights: 10,
    active: true,
    rules: { ...DEFAULT_RULES, min_attractions: 2, requires_tag_match: true },
    ruleVersions: [
      {
        version: 1,
        savedAt: "2025-11-01T10:00:00Z",
        savedBy: "admin@rayna.com",
        rules: {
          ...DEFAULT_RULES,
          min_attractions: 2,
          requires_tag_match: true,
        },
      },
    ],
  },
  {
    id: "pt-5",
    typeName: "Family Fun",
    code: "FAMILY_FUN",
    defaultMarginPercent: 20,
    minNights: 3,
    maxNights: 10,
    active: true,
    rules: { ...DEFAULT_RULES, min_attractions: 2, max_attractions: 8 },
    ruleVersions: [
      {
        version: 1,
        savedAt: "2025-11-01T10:00:00Z",
        savedBy: "admin@rayna.com",
        rules: { ...DEFAULT_RULES, min_attractions: 2, max_attractions: 8 },
      },
    ],
  },
  {
    id: "pt-6",
    typeName: "Luxury Escape",
    code: "LUXURY_ESCAPE",
    defaultMarginPercent: 30,
    minNights: 4,
    maxNights: 14,
    active: true,
    rules: {
      ...DEFAULT_RULES,
      min_hotels: 1,
      max_hotels: 2,
      requires_booking_source: true,
    },
    ruleVersions: [
      {
        version: 1,
        savedAt: "2025-11-01T10:00:00Z",
        savedBy: "admin@rayna.com",
        rules: {
          ...DEFAULT_RULES,
          min_hotels: 1,
          max_hotels: 2,
          requires_booking_source: true,
        },
      },
    ],
  },
  {
    id: "pt-7",
    typeName: "Budget Saver",
    code: "BUDGET_SAVER",
    defaultMarginPercent: 12,
    minNights: 1,
    maxNights: 5,
    active: false,
    rules: { ...DEFAULT_RULES, max_hotels: 2, max_attractions: 4 },
    ruleVersions: [
      {
        version: 1,
        savedAt: "2025-11-01T10:00:00Z",
        savedBy: "admin@rayna.com",
        rules: { ...DEFAULT_RULES, max_hotels: 2, max_attractions: 4 },
      },
    ],
  },
];

export const MOCK_PACKAGE_PRICING: PackagePricingDefaults = {
  defaultMarginPercent: 20,
  floorMarginPercent: 10,
  currencyCode: "AED",
};

// ── Tab 4: API Integrations ──

export const MOCK_API_INTEGRATIONS: ApiIntegration[] = [
  {
    id: "api-1",
    name: "Booking.com Affiliate API",
    status: "connected",
    lastSuccessfulCall: "2026-03-25T08:12:00Z",
    config: {
      partnerId: "RAYNA-2847",
      apiKey: "bk_live_••••••••••••3f9a",
      affiliateId: "1924837",
      environment: "production",
    },
    configFields: [
      { key: "partnerId", label: "Partner ID", type: "text" },
      { key: "apiKey", label: "API Key", type: "password" },
      { key: "affiliateId", label: "Affiliate ID", type: "text" },
      {
        key: "environment",
        label: "Environment",
        type: "select",
        options: ["production", "sandbox"],
      },
    ],
  },
  {
    id: "api-2",
    name: "Viator Partner API",
    status: "connected",
    lastSuccessfulCall: "2026-03-25T07:55:00Z",
    config: {
      apiKey: "vt_live_••••••••••••8b2e",
      partnerId: "RAYNA-VT-001",
      environment: "production",
    },
    configFields: [
      { key: "apiKey", label: "API Key", type: "password" },
      { key: "partnerId", label: "Partner ID", type: "text" },
      {
        key: "environment",
        label: "Environment",
        type: "select",
        options: ["production", "sandbox"],
      },
    ],
  },
  {
    id: "api-3",
    name: "GetYourGuide API",
    status: "connected",
    lastSuccessfulCall: "2026-03-25T06:30:00Z",
    config: {
      apiKey: "gyg_••••••••••••a1c7",
      partnerId: "RAYNA-GYG-001",
    },
    configFields: [
      { key: "apiKey", label: "API Key", type: "password" },
      { key: "partnerId", label: "Partner ID", type: "text" },
    ],
  },
  {
    id: "api-4",
    name: "Google Places API",
    status: "connected",
    lastSuccessfulCall: "2026-03-25T09:01:00Z",
    config: {
      apiKey: "AIza••••••••••••Qw8K",
      usageQuotaRemaining: "14,230 / 25,000",
    },
    configFields: [
      { key: "apiKey", label: "API Key", type: "password" },
      {
        key: "usageQuotaRemaining",
        label: "Usage Quota Remaining",
        type: "text",
      },
    ],
  },
  {
    id: "api-5",
    name: "Ahrefs API",
    status: "connected",
    lastSuccessfulCall: "2026-03-24T22:15:00Z",
    config: {
      apiToken: "ah_••••••••••••d4f2",
      planLevel: "Enterprise",
      requestsRemaining: "8,450",
    },
    configFields: [
      { key: "apiToken", label: "API Token", type: "password" },
      { key: "planLevel", label: "Plan Level", type: "text" },
      {
        key: "requestsRemaining",
        label: "Requests Remaining This Month",
        type: "text",
      },
    ],
  },
  {
    id: "api-6",
    name: "Anthropic (Claude API)",
    status: "connected",
    lastSuccessfulCall: "2026-03-25T09:10:00Z",
    config: {
      apiKey: "sk-ant-••••••••••••7e3b",
      defaultModel: "claude-sonnet-4-6",
      maxTokens: 1000,
      usageThisMonth: "12,847 requests",
    },
    configFields: [
      { key: "apiKey", label: "API Key", type: "password" },
      {
        key: "defaultModel",
        label: "Default Model",
        type: "select",
        options: ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"],
      },
      { key: "maxTokens", label: "Max Tokens", type: "number" },
      {
        key: "usageThisMonth",
        label: "Usage This Month",
        type: "text",
      },
    ],
  },
  {
    id: "api-7",
    name: "Apify (Scraping)",
    status: "not_configured",
    lastSuccessfulCall: null,
    config: {
      apiToken: "",
      actorIds: "",
    },
    configFields: [
      { key: "apiToken", label: "API Token", type: "password" },
      {
        key: "actorIds",
        label: "Actor IDs (comma-separated)",
        type: "text",
        placeholder: "actor-id-1, actor-id-2",
      },
    ],
  },
  {
    id: "api-8",
    name: "Bright Data (Scraping)",
    status: "error",
    lastSuccessfulCall: "2026-03-20T14:00:00Z",
    config: {
      customerId: "CID-RAYNA-001",
      apiToken: "bd_••••••••••••9c1a",
      zoneNames: "residential_zone1, datacenter_zone2",
    },
    configFields: [
      { key: "customerId", label: "Customer ID", type: "text" },
      { key: "apiToken", label: "API Token", type: "password" },
      { key: "zoneNames", label: "Zone Names", type: "text" },
    ],
  },
];

// ── Tab 5: Notifications ──

export const MOCK_NOTIFICATION_RULES: NotificationRule[] = [
  {
    id: "nr-1",
    eventType: "Queue A new items assigned",
    notifyRoles: ["Classification Reviewer"],
    channel: "in_app_email",
    active: true,
  },
  {
    id: "nr-2",
    eventType: "Queue B new items assigned",
    notifyRoles: ["Content Reviewer"],
    channel: "in_app_email",
    active: true,
  },
  {
    id: "nr-3",
    eventType: "Staging batch ready for approval",
    notifyRoles: ["Product Manager"],
    channel: "in_app_email",
    active: true,
  },
  {
    id: "nr-4",
    eventType: "Source health RED",
    notifyRoles: ["Product Manager", "Admin"],
    channel: "in_app_email",
    active: true,
  },
  {
    id: "nr-5",
    eventType: "Stale data threshold exceeded",
    notifyRoles: ["Product Manager"],
    channel: "in_app",
    active: true,
  },
  {
    id: "nr-6",
    eventType: "Rollback confirmation",
    notifyRoles: ["Product Manager", "Admin"],
    channel: "in_app_email",
    active: true,
  },
  {
    id: "nr-7",
    eventType: "Content escalated to copywriter",
    notifyRoles: ["Admin"],
    channel: "in_app_email",
    active: true,
  },
  {
    id: "nr-8",
    eventType: "Production push completed",
    notifyRoles: ["Product Manager"],
    channel: "in_app",
    active: true,
  },
  {
    id: "nr-9",
    eventType: "Job failed",
    notifyRoles: ["Admin"],
    channel: "in_app_email",
    active: true,
  },
];

export const MOCK_EMAIL_CONFIG: EmailSenderConfig = {
  fromName: "Rayna Product Automation",
  fromEmail: "automation@raynatours.com",
};

// ── Tab 6: API Audit Log ──

export const MOCK_AUDIT_RECORDS: ApiAuditRecord[] = [
  {
    id: "aud-1",
    systemName: "Rayna Product Master API",
    environment: "Production",
    bulkUpsert: "passed",
    idempotency: "passed",
    rollback: "passed",
    staging: "passed",
    overallStatus: "passed",
    reviewedBy: "Ahmed K.",
    date: "2026-03-15",
    notes: "All endpoints validated. Bulk upsert handles 500+ records.",
  },
  {
    id: "aud-2",
    systemName: "Rayna Pricing Engine",
    environment: "Production",
    bulkUpsert: "passed",
    idempotency: "passed",
    rollback: "conditional_pass",
    staging: "passed",
    overallStatus: "conditional_pass",
    reviewedBy: "Sarah M.",
    date: "2026-03-18",
    notes:
      "Rollback works for single records; bulk rollback needs manual trigger.",
  },
  {
    id: "aud-3",
    systemName: "Rayna Media Service",
    environment: "Staging",
    bulkUpsert: "pending",
    idempotency: "pending",
    rollback: "pending",
    staging: "pending",
    overallStatus: "pending",
    reviewedBy: "",
    date: "",
    notes: "Awaiting staging environment deployment.",
  },
  {
    id: "aud-4",
    systemName: "Rayna Booking Gateway",
    environment: "Production",
    bulkUpsert: "passed",
    idempotency: "passed",
    rollback: "passed",
    staging: "passed",
    overallStatus: "passed",
    reviewedBy: "Ahmed K.",
    date: "2026-03-20",
    notes: "Full CRUD with idempotent PUT. Rollback via versioned snapshots.",
  },
  {
    id: "aud-5",
    systemName: "Rayna CMS API",
    environment: "Production",
    bulkUpsert: "failed",
    idempotency: "passed",
    rollback: "pending",
    staging: "failed",
    overallStatus: "failed",
    reviewedBy: "Sarah M.",
    date: "2026-03-22",
    notes:
      "Bulk upsert returns 500 on >100 records. Staging endpoint not implemented.",
  },
];

// ── Dropdown options ──

export const CURRENCY_OPTIONS = [
  "AED",
  "USD",
  "EUR",
  "GBP",
  "SAR",
  "QAR",
  "BHD",
  "KWD",
  "OMR",
  "INR",
];

export const TIMEZONE_OPTIONS = [
  "Asia/Dubai",
  "Asia/Riyadh",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Europe/Paris",
  "Australia/Sydney",
];

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "zh", label: "Chinese" },
  { code: "ru", label: "Russian" },
];

export const STALE_ACTION_OPTIONS = [
  { value: "flag_refresh", label: "Flag & Refresh" },
  { value: "flag_human_review", label: "Flag for Human Review" },
  { value: "auto_refresh_ai", label: "Auto-Refresh via AI" },
  { value: "flag_manual_review", label: "Flag for Manual Review" },
  { value: "flag_manual_verification", label: "Flag for Manual Verification" },
];
