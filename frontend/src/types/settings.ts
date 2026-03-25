// ── Tab 1: General ──

export interface SystemIdentity {
  systemName: string;
  defaultCurrency: string;
  defaultTimezone: string;
  defaultLanguage: string;
}

export interface PipelineDefaults {
  autoClassifyThreshold: number;
  humanReviewThreshold: number;
  scrapingConfidenceMin: number;
  contentReviewSamplingRate: number;
  maxContentRegenAttempts: number;
}

export interface IngestionDefaults {
  filterAutoProceedTimeoutHours: number;
  maxRecordsPerMinute: number;
  maxRetryAttempts: number;
}

export interface GeneralSettings {
  identity: SystemIdentity;
  pipeline: PipelineDefaults;
  ingestion: IngestionDefaults;
}

// ── Tab 2: Data Freshness ──

export type StaleAction =
  | "flag_refresh"
  | "flag_human_review"
  | "auto_refresh_ai"
  | "flag_manual_review"
  | "flag_manual_verification";

export interface FreshnessRule {
  id: string;
  dataType: string;
  thresholdHours: number;
  humanReadable: string;
  staleAction: StaleAction;
}

// ── Tab 3: Package Rules ──

export interface PackageType {
  id: string;
  typeName: string;
  code: string;
  defaultMarginPercent: number;
  minNights: number;
  maxNights: number;
  active: boolean;
  rules: PackageRules;
  ruleVersions: PackageRuleVersion[];
}

export interface PackageRules {
  min_hotels: number;
  max_hotels: number;
  min_attractions: number;
  max_attractions: number;
  min_transfers: number;
  requires_booking_source: boolean;
  requires_tag_match: boolean;
  [key: string]: number | boolean | string;
}

export interface PackageRuleVersion {
  version: number;
  savedAt: string;
  savedBy: string;
  rules: PackageRules;
}

export interface PackagePricingDefaults {
  defaultMarginPercent: number;
  floorMarginPercent: number;
  currencyCode: string;
}

// ── Tab 4: API Integrations ──

export type ConnectionStatus = "connected" | "not_configured" | "error";

export interface ApiIntegration {
  id: string;
  name: string;
  status: ConnectionStatus;
  lastSuccessfulCall: string | null;
  config: Record<string, string | number | boolean>;
  configFields: ApiConfigField[];
}

export interface ApiConfigField {
  key: string;
  label: string;
  type: "text" | "password" | "select" | "number" | "toggle";
  options?: string[];
  placeholder?: string;
}

// ── Tab 5: Notifications ──

export type NotifyChannel = "in_app" | "email" | "in_app_email";

export interface NotificationRule {
  id: string;
  eventType: string;
  notifyRoles: string[];
  channel: NotifyChannel;
  active: boolean;
}

export interface EmailSenderConfig {
  fromName: string;
  fromEmail: string;
}

// ── Tab 6: API Audit Log ──

export type AuditStatus = "passed" | "failed" | "pending" | "conditional_pass";

export interface ApiAuditRecord {
  id: string;
  systemName: string;
  environment: string;
  bulkUpsert: AuditStatus;
  idempotency: AuditStatus;
  rollback: AuditStatus;
  staging: AuditStatus;
  overallStatus: AuditStatus;
  reviewedBy: string;
  date: string;
  notes: string;
}
