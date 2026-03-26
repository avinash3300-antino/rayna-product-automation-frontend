const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public detail?: string
  ) {
    super(detail || `API error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const { token, ...fetchOptions } = options || {};

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    let detail: string | undefined;
    try {
      const errorBody = await res.json();
      detail =
        typeof errorBody.detail === "string"
          ? errorBody.detail
          : errorBody.message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, res.statusText, detail);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return res.json();
}

export function createApiClient(token?: string) {
  const withToken = (opts?: RequestInit): FetchOptions => ({ ...opts, token });

  return {
    get: <T>(endpoint: string, opts?: RequestInit) =>
      fetchApi<T>(endpoint, withToken(opts)),
    post: <T>(endpoint: string, body?: unknown, opts?: RequestInit) =>
      fetchApi<T>(endpoint, withToken({
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
        ...opts,
      })),
    patch: <T>(endpoint: string, body: unknown, opts?: RequestInit) =>
      fetchApi<T>(endpoint, withToken({
        method: "PATCH",
        body: JSON.stringify(body),
        ...opts,
      })),
    put: <T>(endpoint: string, body: unknown, opts?: RequestInit) =>
      fetchApi<T>(endpoint, withToken({
        method: "PUT",
        body: JSON.stringify(body),
        ...opts,
      })),
    delete: <T>(endpoint: string, opts?: RequestInit) =>
      fetchApi<T>(endpoint, withToken({ method: "DELETE", ...opts })),
  };
}

// Default client (no token) for unauthenticated calls
export const api = createApiClient();
