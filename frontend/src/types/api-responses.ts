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

// ---- Discovery responses ----

export interface BackendSourceDiscoveryRunResponse {
  id: string;
  city_id: string;
  category: string;
  status: string;
  ahrefs_results: Record<string, unknown> | null;
  searchapi_results: Record<string, unknown> | null;
  claude_synthesis: Record<string, unknown> | null;
  sources_found: number;
  sources_approved: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface BackendScrapeSourceResponse {
  id: string;
  city_id: string;
  category: string;
  source_name: string;
  source_url: string;
  tier: number;
  authority_score: number | null;
  approved: boolean;
  approved_at: string | null;
  added_by: string;
  is_active: boolean;
  last_scraped_at: string | null;
  created_at: string;
}

// ---- Scraping responses ----

export interface BackendScrapeJobResponse {
  id: string;
  discovery_run_id: string | null;
  city_id: string;
  category: string;
  status: string;
  source_id: string | null;
  source_url: string;
  scrape_type: string;
  pages_scraped: number;
  records_found: number;
  records_saved: number;
  records_skipped_dup: number;
  records_enriched: number;
  errors_json: Record<string, unknown> | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

// ---- Review responses ----

export interface BackendReviewResponse {
  id: string;
  activity_id: string;
  reviewer_name: string;
  reviewer_avatar_url: string | null;
  rating: number | null;
  review_title: string | null;
  review_text: string;
  review_date: string | null;
  source_platform: string;
  source_url: string | null;
  verified: boolean;
  language: string;
  created_at: string;
}

export interface BackendReviewListResponse {
  activity_id: string;
  total: number;
  avg_rating: number | null;
  platform_counts: Record<string, number>;
  reviews: BackendReviewResponse[];
}

// ---- Activity responses ----

export interface BackendActivityCard {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  price_from: number;
  currency: string;
  rating: number | null;
  review_count: number;
  cover_image_url: string | null;
  instant_confirmation: boolean;
  free_cancellation: boolean;
  duration_minutes: number;
  quality_score: number;
  status: string;
}

export interface BackendActivityResponse {
  id: string;
  name: string;
  slug: string;
  city_id: string;
  category: string;
  sub_category: string | null;
  activity_type: string;
  tags: string[] | null;
  status: string;
  description_short: string;
  description_long: string;
  highlights: string[] | null;
  included: string[] | null;
  excluded: string[] | null;
  what_to_bring: string | null;
  important_notes: string | null;
  price_adult: number;
  price_child: number | null;
  price_infant: number | null;
  price_group: number | null;
  price_original: number | null;
  currency: string;
  price_type: string;
  discount_pct: number | null;
  price_from: number;
  duration_minutes: number;
  start_times: string[] | null;
  operating_days: string[] | null;
  instant_confirmation: boolean;
  free_cancellation: boolean;
  cancellation_hours: number | null;
  cancellation_policy: string | null;
  min_participants: number | null;
  max_participants: number | null;
  advance_booking_days: number | null;
  country: string;
  city: string;
  area: string | null;
  address: string;
  lat: number;
  lng: number;
  maps_link: string | null;
  meeting_point_name: string | null;
  meeting_point_desc: string | null;
  nearby_landmark: string | null;
  pickup_available: boolean;
  pickup_locations: string[] | null;
  hotel_pickup_included: boolean;
  dropoff_available: boolean;
  refund_policy_details: string | null;
  min_age: number | null;
  max_age: number | null;
  fitness_level: string | null;
  difficulty: string | null;
  pregnancy_restriction: boolean;
  wheelchair_access: string | null;
  languages: string[] | null;
  cover_image_url: string | null;
  gallery_json: string[] | null;
  video_url: string | null;
  rating: number | null;
  review_count: number;
  rating_5: number;
  rating_4: number;
  rating_3: number;
  review_snippets: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  json_ld: Record<string, unknown> | null;
  canonical_url: string | null;
  source_url: string;
  source_type: string;
  operator_name: string | null;
  verified: boolean;
  dedup_hash: string;
  quality_score: number;
  created_at: string;
  updated_at: string;
}
