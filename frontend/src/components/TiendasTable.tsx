import { Pencil, Trash2, Store, Shirt, Utensils, Laptop, Armchair } from "lucide-react";
import type { Categoria, Tienda } from "@/lib/types";

const icons = { Moda: Shirt, Restaurantes: Utensils, Tecnología: Laptop, Hogar: Armchair };
export function CategoryIcon({ categoria }: { categoria: Categoria }) {
  const Icon = icons[categoria] ?? Store;
  return <span className={`category-icon category-${categoria === "Tecnología" ? "tech" : categoria.toLowerCase()}`}><Icon size={20} /></span>;
}
export function TiendasTable({ tiendas, onEdit, onDelete }: {
  tiendas: Tienda[]; onEdit: (tienda: Tienda) => void; onDelete: (tienda: Tienda) => void;
}) {
  return <div className="table-scroll"><table><caption className="sr-only">Directorio de tiendas registradas</caption>
    <thead><tr><th>Tienda</th><th>Categoría</th><th>Estado</th><th className="text-right">Acciones</th></tr></thead>
    <tbody>{tiendas.map(tienda => <tr key={tienda.id}>
      <td><div className="store-cell"><CategoryIcon categoria={tienda.categoria} /><div><strong>{tienda.nombre}</strong><small>Local #{String(tienda.id).padStart(3, "0")}</small></div></div></td>
      <td>{tienda.categoria}</td><td><span className={`badge ${tienda.activo ? "badge-active" : "badge-inactive"}`}><i />{tienda.activo ? "Activa" : "Inactiva"}</span></td>
      <td><div className="row-actions"><button className="icon-button" aria-label={`Editar ${tienda.nombre}`} title="Editar tienda" onClick={() => onEdit(tienda)}><Pencil size={17} /></button>
        <button className="icon-button delete-button" aria-label={`Eliminar ${tienda.nombre}`} title="Eliminar tienda" onClick={() => onDelete(tienda)}><Trash2 size={17} /></button></div></td>
    </tr>)}</tbody>
  </table></div>;
}
