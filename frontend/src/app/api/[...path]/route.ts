import { NextRequest, NextResponse } from "next/server";
import { apiBase, appOrigin, sessionCookie } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, context: Context) {
  const { path: segments } = await context.params;
  const path = segments.join("/");
  const method = request.method;
  const login = path === "auth/login" && method === "POST";
  const logout = path === "auth/logout" && method === "POST";
  const allowed = login || logout || (path === "auth/me" && method === "GET") ||
    (path === "tiendas" && ["GET", "POST"].includes(method)) ||
    (/^tiendas\/[1-9][0-9]*$/.test(path) && ["GET", "PUT", "DELETE"].includes(method));
  if (!allowed) return NextResponse.json({ message: "Ruta no disponible." }, { status: 404 });
  if (method !== "GET" && request.headers.get("origin") !== appOrigin())
    return NextResponse.json({ message: "Origen de la solicitud no permitido." }, { status: 403 });
  const clearSession = (response: NextResponse) => {
    response.cookies.set(sessionCookie, "", { httpOnly: true, sameSite: "strict", secure: appOrigin().startsWith("https:"), path: "/", maxAge: 0 });
    return response;
  };
  if (logout) return clearSession(NextResponse.json({ message: "Sesión cerrada." }));
  const token = request.cookies.get(sessionCookie)?.value;
  if (!login && !token) return clearSession(NextResponse.json({ message: "Inicia sesión para continuar." }, { status: 401 }));
  let body: string | undefined;
  if (["POST", "PUT"].includes(method)) {
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      return NextResponse.json({ message: "Se requiere JSON." }, { status: 415 });
    body = await request.text();
    if (Buffer.byteLength(body) > 16384) return NextResponse.json({ message: "Solicitud demasiado grande." }, { status: 413 });
  }
  try {
    const upstream = await fetch(`${apiBase()}/api/${path}`, {
      method, body, cache: "no-store", signal: AbortSignal.timeout(10000),
      headers: { "Content-Type": "application/json", ...(token && !login ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (upstream.status === 204) return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
    const data = await upstream.json().catch(() => ({ message: "No se pudo completar la solicitud." }));
    if (upstream.status >= 500) return NextResponse.json({ message: "El servicio no está disponible. Inténtalo de nuevo." }, { status: 502 });
    if (login && upstream.ok) {
      const response = NextResponse.json({ usuario: data.usuario }, { headers: { "Cache-Control": "no-store" } });
      response.cookies.set(sessionCookie, data.token, {
        httpOnly: true, sameSite: "strict", secure: appOrigin().startsWith("https:"), path: "/",
        expires: new Date(data.expiresAt),
      });
      return response;
    }
    const response = NextResponse.json(data, { status: upstream.status, headers: { "Cache-Control": "no-store" } });
    return upstream.status === 401 ? clearSession(response) : response;
  } catch {
    return NextResponse.json({ message: "No se pudo conectar con la API. Comprueba que el backend esté iniciado." }, { status: 502 });
  }
}
export { handle as GET, handle as POST, handle as PUT, handle as DELETE };
