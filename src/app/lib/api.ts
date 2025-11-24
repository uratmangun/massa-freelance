const API_BASE_URL =
  process.env.NEXT_PUBLIC_DEPLOY_TARGET === "deweb"
    ? process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
    : "";

export function apiUrl(path: string): string {
  if (!path.startsWith("/")) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
}

export function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(input), init);
}
