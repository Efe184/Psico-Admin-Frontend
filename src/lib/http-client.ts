import type { ApiResponse } from "@/types/dto/api";

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  return url.replace(/\/$/, "");
};

/** Returns API base URL or null when unset (e.g. mock-only dev). */
export function getOptionalApiBase(): string | null {
  const url = process.env.NEXT_PUBLIC_API_URL;
  return url ? url.replace(/\/$/, "") : null;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  method?: HttpMethod;
  body?: unknown;
  accessToken?: string | null;
}

/**
 * Thin fetch wrapper: base URL, JSON, Authorization, normalized ApiResponse errors.
 */
export async function httpRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, accessToken, headers: initHeaders, ...rest } =
    options;

  const headers = new Headers(initHeaders);
  if (!headers.has("Content-Type") && body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    ...rest,
  });

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;

  if (!res.ok || !json || typeof json.success !== "boolean") {
    const message =
      json?.message ?? res.statusText ?? "Request failed";
    throw new Error(message);
  }

  if (!json.success) {
    throw new Error(json.message || "Request unsuccessful");
  }

  return json;
}
