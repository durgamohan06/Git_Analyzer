import { httpGet } from "./http";
import type { HealthResponse } from "@/types/github";

export function getHealth() {
  return httpGet<HealthResponse>("/health");
}
