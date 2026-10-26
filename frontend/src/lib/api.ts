export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/${path}`, {
      ...options, credentials: "same-origin", cache: "no-store",
      headers: { "Content-Type": "application/json", ...options.headers },
      signal: options.signal ?? AbortSignal.timeout(15000),
    });
  } catch {
    throw new ApiError("No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.", 0);
  }
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && path !== "auth/login") {
      window.location.replace("/login?expired=1");
    }
    const errors = data?.errors ? Object.values(data.errors).flat().join(" ") : null;
    throw new ApiError(data?.message ?? errors ?? data?.title ?? "No pudimos completar la operación.", response.status);
  }
  return data as T;
}
