import { frontendEnv } from "@/config/env";

export class ApiError extends Error {
  public readonly status: number;

  public readonly code: string;

  public readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = "ApiError";
  }
}

interface RequestJsonOptions {
  timeoutMs?: number;
  headers?: HeadersInit;
}

function buildRequestUrl(baseUrl: string, path: string) {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedBase.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    return `${normalizedBase}${normalizedPath.slice(4)}`;
  }

  return `${normalizedBase}${normalizedPath}`;
}

async function parseJson(response: Response) {
  try {
    return (await response.json()) as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

export async function httpGet<T>(
  path: string,
  options: RequestJsonOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 10000;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      buildRequestUrl(frontendEnv.apiBaseUrl, path),
      {
        headers: {
          Accept: "application/json",
          ...options.headers,
        },
        signal: controller.signal,
      },
    );

    const payload = await parseJson(response);

    if (!response.ok) {
      const errorPayload = (payload?.error ?? {}) as Record<string, unknown>;

      throw new ApiError(
        response.status,
        String(errorPayload.code ?? `HTTP_${response.status}`),
        String(
          errorPayload.message ??
            `Request failed with status ${response.status}`,
        ),
        errorPayload.details,
      );
    }

    if (
      payload &&
      typeof payload === "object" &&
      "success" in payload &&
      payload.success === true &&
      "data" in payload
    ) {
      return payload.data as T;
    }

    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(504, "REQUEST_TIMEOUT", "Request timed out");
    }

    throw new ApiError(0, "NETWORK_ERROR", "Unable to reach the server");
  } finally {
    window.clearTimeout(timeoutId);
  }
}
