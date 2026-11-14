/*
 * Small fetch helpers for the three backend services.
 * In development, Vite forwards these paths to the services (see vite.config.ts):
 *   /api/cars -> Java Spring Boot API   (http://localhost:9090)
 *   /api/py   -> Python Flask service   (http://localhost:5000)
 *   /api/php  -> PHP service            (http://localhost:8000)
 */

export const JAVA_API = "/api/cars";
export const PYTHON_API = "/api/py";
export const PHP_API = "/api/php";

const TOKEN_KEY = "carverse_admin_token";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: unknown = null,
  ) {
    super(message);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

function serviceName(url: string): string {
  if (url.startsWith(JAVA_API)) return "Java API";
  if (url.startsWith(PYTHON_API)) return "Python service";
  return "PHP service";
}

type Options = Omit<RequestInit, "body"> & {
  body?: unknown;
  admin?: boolean;
  token?: string | null;
};

export async function request<T>(url: string, options: Options = {}): Promise<T> {
  const { body, admin, token, ...init } = options;
  const headers = new Headers(init.headers);
  if (body !== undefined) headers.set("Content-Type", "application/json");
  const adminToken = token ?? (admin ? getToken() : null);
  if (adminToken) headers.set("X-Admin-Token", adminToken);

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers,
      body: body === undefined ? null : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(`Cannot reach the ${serviceName(url)}. Is it running?`, 0);
  }

  const text = await res.text();
  let data: { message?: string; error?: string } | null = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `The ${serviceName(url)} is not responding (HTTP ${res.status}). Is it running?`;
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}

export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Something went wrong.";
}
