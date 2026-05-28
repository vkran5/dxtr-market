const API_BASE = ""; // uses same origin, Next.js rewrites proxy to external API

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status_code?: number;
}

export interface ApiErrorResponse {
  message: string;
  status_code?: number;
  data?: { field?: string };
}

export class ApiError extends Error {
  field?: string;
  statusCode?: number;

  constructor(message: string, statusCode?: number, field?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.field = field;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = typeof document !== "undefined"
    ? document.cookie.split("; ").find((c) => c.startsWith("auth_token="))?.split("=")[1]
    : null;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => null) as ApiResponse<T> | ApiErrorResponse | null;

  if (!res.ok) {
    const errorData = data as ApiErrorResponse | null;
    throw new ApiError(
      errorData?.message || "Request failed",
      errorData?.status_code,
      errorData?.data?.field
    );
  }

  return data as ApiResponse<T>;
}
