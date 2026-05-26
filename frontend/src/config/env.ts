const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "") ||
  "http://localhost:3001";

export const frontendEnv = {
  apiBaseUrl,
} as const;
