"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Fields";
import { Button } from "@/components/ui/Button";

export function LoginForm({ expired }: { expired: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  async function submit(values: LoginValues) {
    setError("");
    try {
      await api("auth/login", { method: "POST", body: JSON.stringify(values) });
      router.replace("/tiendas");
      router.refresh();
    } catch (error) { setError(error instanceof Error ? error.message : "No se pudo iniciar sesión."); }
  }
  return <form onSubmit={handleSubmit(submit)} noValidate className="login-form">
    {expired && <p className="notice">Tu sesión terminó. Ingresa nuevamente.</p>}
    {error && <p className="error-banner" role="alert">{error}</p>}
    <Input id="usuario" label="Usuario" placeholder="Ingresa tu usuario" autoComplete="username" {...register("usuario")} error={errors.usuario?.message} />
    <Input id="password" label="Contraseña" placeholder="Ingresa tu contraseña" type="password" autoComplete="current-password" {...register("password")} error={errors.password?.message} />
    <Button type="submit" busy={isSubmitting} className="w-full">{isSubmitting ? "Ingresando…" : "Ingresar al directorio"}<ArrowRight size={18} /></Button>
    <p className="secure-caption"><LockKeyhole size={14} /> Acceso para administradores autorizados</p>
  </form>;
}
