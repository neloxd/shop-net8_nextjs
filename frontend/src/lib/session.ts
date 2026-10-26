import { cookies } from "next/headers";

export const sessionCookie = "rp_session";
export const apiBase = () => process.env.API_BASE_URL ?? "http://127.0.0.1:5080";
export const appOrigin = () => new URL(process.env.APP_ORIGIN ?? "http://localhost:3000").origin;

export async function getCurrentUser(): Promise<string | null> {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;
  const response = await fetch(`${apiBase()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(10000),
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("La API no está disponible.");
  return (await response.json()).usuario;
}
