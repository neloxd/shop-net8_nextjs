import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Real Plaza | Directorio de tiendas", description: "Administración de locales comerciales" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
