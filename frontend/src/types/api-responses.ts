// Raw backend response types (snake_case, matches OpenAPI spec)

export interface BackendRoleResponse {
  id: string;
  code: string;
  name: string;
}

export interface BackendUserResponse {
  id: string;
  email: string;
  full_name: string;
  job_title: string | null;
  department: string | null;
  phone: string | null;
  timezone: string | null;
  profile_picture_url: string | null;
  status: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  roles: BackendRoleResponse[];
}

export interface BackendUserBrief {
  id: string;
  email: string;
  full_name: string;
  profile_picture_url: string | null;
  roles: string[];
  status: string;
}

export interface BackendLoginResponse {
  access_token: string;
  token_type: string;
  user: BackendUserBrief;
}

export interface BackendAuditLogResponse {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string;
}

export interface BackendPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ---- Destination responses ----

export interface BackendLastIngestionRun {
  date: string | null;
  status: string;
  records_processed: number;
  duration_ms: number;
}

export interface BackendProductCountSummary {
  hotels: number;
  attractions: number;
  transfers: number;
  restaurants: number;
  total: number;
}

export interface BackendDestinationListItem {
  id: string;
  code: string | null;
  name: string;
  country_code: string | null;
  country_name: string | null;
  country_flag: string | null;
  region_name: string | null;
  city_name: string | null;
  timezone: string | null;
  latitude: number | null;
  longitude: number | null;
  status: string;
  enabled_categories: string[];
  created_at: string;
  updated_at: string;
  location_count: number;
  product_counts: BackendProductCountSummary;
  last_ingestion_run: BackendLastIngestionRun | null;
}
