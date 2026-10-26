import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { TiendasDashboard } from "@/components/TiendasDashboard";

export const dynamic = "force-dynamic";
export default async function TiendasPage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect("/login");
  return <TiendasDashboard usuario={usuario} />;
}
