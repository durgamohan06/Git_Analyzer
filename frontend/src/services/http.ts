import { frontendEnv } from '@/config/env';

export async function httpGet<T>(path: string): Promise<T> {
  const response = await fetch(`${frontendEnv.apiBaseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
