"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorias, tiendaSchema, type TiendaValues } from "@/lib/validation";
import type { Tienda } from "@/lib/types";
import { Input, Select } from "@/components/ui/Fields";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function TiendaForm({ tienda, onSave, onClose }: {
  tienda?: Tienda; onSave: (values: TiendaValues) => Promise<void>; onClose: () => void;
}) {
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TiendaValues>({
    resolver: zodResolver(tiendaSchema),
    defaultValues: tienda ? { nombre: tienda.nombre, categoria: tienda.categoria, activo: tienda.activo } : { nombre: "", activo: true },
  });
  async function submit(values: TiendaValues) {
    setError("");
    try { await onSave(values); } catch (error) { setError(error instanceof Error ? error.message : "No se pudo guardar."); }
  }
  return <Modal title={tienda ? "Editar tienda" : "Nueva tienda"} description="Completa los datos del local. Puedes actualizar su estado cuando lo necesites." onClose={onClose} busy={isSubmitting}>
    <form onSubmit={handleSubmit(submit)} className="store-form" noValidate>
      {error && <p role="alert" className="error-banner">{error}</p>}
      <Input id="nombre" label="Nombre de la tienda" placeholder="Ej. Casa & Estilo" maxLength={120} {...register("nombre")} error={errors.nombre?.message} />
      <Select id="categoria" label="Categoría / Rubro" {...register("categoria")} error={errors.categoria?.message}>
        <option value="">Selecciona una categoría</option>{categorias.map(x => <option key={x} value={x}>{x}</option>)}
      </Select>
      <label className="toggle-row" htmlFor="activo"><span><strong>Tienda activa</strong><small>Indica si el local se encuentra operativo.</small></span>
        <input id="activo" type="checkbox" {...register("activo")} /></label>
      <div className="modal-actions"><Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" busy={isSubmitting}>{isSubmitting ? "Guardando…" : "Guardar tienda"}</Button></div>
    </form>
  </Modal>;
}
