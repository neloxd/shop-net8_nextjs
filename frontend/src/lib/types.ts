export type Categoria = "Moda" | "Restaurantes" | "Tecnología" | "Hogar";
export interface Tienda {
  id: number;
  nombre: string;
  categoria: Categoria;
  activo: boolean;
  creadoEn: string;
}
