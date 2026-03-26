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
