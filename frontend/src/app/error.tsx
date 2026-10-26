"use client";
import { Button } from "@/components/ui/Button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="error-page"><h1>No pudimos cargar el panel.</h1><p>Comprueba que el backend y la base de datos estén iniciados.</p><Button onClick={reset}>Reintentar</Button><a href="/login">Volver al inicio de sesión</a></main>;
}
