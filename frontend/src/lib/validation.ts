import { z } from "zod";

export const categorias = ["Moda", "Restaurantes", "Tecnología", "Hogar"] as const;
export const tiendaSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresa un nombre de al menos 2 caracteres.").max(120, "Usa como máximo 120 caracteres."),
  categoria: z.enum(categorias, { error: "Selecciona una categoría." }),
  activo: z.boolean(),
});
export const loginSchema = z.object({
  usuario: z.string().trim().min(1, "Ingresa tu usuario.").max(50, "Usa como máximo 50 caracteres."),
  password: z.string().min(1, "Ingresa tu contraseña.").max(128, "Usa como máximo 128 caracteres."),
});
export type TiendaValues = z.infer<typeof tiendaSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
