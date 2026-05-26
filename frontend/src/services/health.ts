import { httpGet } from './http';

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export function getHealth() {
  return httpGet<HealthResponse>('/health');
}
