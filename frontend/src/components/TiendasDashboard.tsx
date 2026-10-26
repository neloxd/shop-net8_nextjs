"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, LayoutGrid, LogOut, Plus, Search, ArrowUpRight, CircleCheck, CirclePause, RefreshCw, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { categorias, type TiendaValues } from "@/lib/validation";
import type { Tienda } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TiendaForm } from "@/components/TiendaForm";
import { TiendasTable } from "@/components/TiendasTable";

export function TiendasDashboard({ usuario }: { usuario: string }) {
  const router = useRouter();
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [editing, setEditing] = useState<Tienda | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Tienda | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  async function load() {
    setLoading(true); setError("");
    try { setTiendas(await api<Tienda[]>("tiendas")); }
    catch (e) { setError(e instanceof Error ? e.message : "No se pudo cargar el directorio."); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    api<Tienda[]>("tiendas", { signal: controller.signal })
      .then(data => { if (active) setTiendas(data); })
      .catch(error => { if (active) setError(error instanceof Error ? error.message : "No se pudo cargar el directorio."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, []);
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filtered = tiendas.filter(t => normalize(t.nombre).includes(normalize(search)) && (!category || t.categoria === category));
  const active = tiendas.filter(t => t.activo).length;
  async function save(values: TiendaValues) {
    const tienda = await api<Tienda>(editing ? `tiendas/${editing.id}` : "tiendas", { method: editing ? "PUT" : "POST", body: JSON.stringify(values) });
    setTiendas(previous => [...previous.filter(t => t.id !== tienda.id), tienda].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")));
    setNotice(editing ? "Los cambios se guardaron correctamente." : "La tienda se creó correctamente.");
    setEditing(undefined);
  }
  async function remove() {
    if (!deleting) return;
    setBusy(true); setDeleteError("");
    try {
      await api(`tiendas/${deleting.id}`, { method: "DELETE" });
      setTiendas(previous => previous.filter(t => t.id !== deleting.id));
      setDeleting(null); setNotice("La tienda se eliminó correctamente.");
    } catch (e) { setDeleteError(e instanceof Error ? e.message : "No se pudo eliminar."); }
    finally { setBusy(false); }
  }
  async function logout() {
    setLoggingOut(true);
    try { await api("auth/logout", { method: "POST" }); router.replace("/login"); router.refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "No se pudo cerrar la sesión."); setLoggingOut(false); }
  }
  return <div className="app-shell">
    <aside className="sidebar"><a href="/tiendas" className="brand"><span className="brand-symbol">r<span>p</span></span><span>real plaza<span className="brand-subtitle">GESTIÓN COMERCIAL</span></span></a>
      <p className="nav-label">ESPACIO DE TRABAJO</p><nav aria-label="Principal"><a href="/tiendas" className="nav-item" aria-current="page"><LayoutGrid size={19} /> Directorio de tiendas <span className="nav-dot" /></a></nav>
      <div className="sidebar-note"><Store size={26} /><strong>Todo en un mismo lugar.</strong><p>Gestiona los locales que dan vida a nuestra comunidad.</p></div>
      <div className="sidebar-footer"><span className="status-light" /> Panel de administración<span className="version-label">v1.0</span></div>
    </aside>
    <div className="main-shell"><header className="topbar"><span className="breadcrumb">Administración <span>/</span> <strong>Tiendas</strong></span>
      <div className="user-actions"><span className="avatar">{usuario.slice(0, 1).toUpperCase()}</span><span className="user-name">{usuario}<small>Administrador</small></span><Button variant="ghost" onClick={logout} busy={loggingOut} aria-label="Cerrar sesión"><LogOut size={18} /><span className="logout-label">Cerrar sesión</span></Button></div>
    </header>
    <main className="workspace"><div className="page-heading"><div><p className="eyebrow">GESTIÓN DE LOCALES</p><h1>Directorio de tiendas<span>.</span></h1><p className="muted">Un espacio para organizar, actualizar y hacer crecer nuestra comunidad.</p></div>
      <Button onClick={() => { setNotice(""); setEditing(null); }}><Plus size={19} />Nueva tienda</Button></div>
      <div className="stats-grid"><article className="stat-card"><div><p>Total de tiendas</p><strong>{loading ? "—" : tiendas.length}</strong><small>Locales registrados</small></div><span className="stat-icon purple"><Store size={23} /></span></article>
        <article className="stat-card"><div><p>Tiendas activas</p><strong>{loading ? "—" : active}</strong><small>Listas para recibir visitantes</small></div><span className="stat-icon green"><CircleCheck size={23} /></span></article>
        <article className="stat-card"><div><p>Tiendas inactivas</p><strong>{loading ? "—" : tiendas.length - active}</strong><small>Fuera de operación</small></div><span className="stat-icon amber"><CirclePause size={23} /></span></article></div>
      {notice && <div className="success-banner" role="status"><CircleCheck size={18} />{notice}<button aria-label="Cerrar notificación" onClick={() => setNotice("")}>×</button></div>}
      <section className="directory-card" aria-labelledby="directory-title"><div className="directory-heading"><div><h2 id="directory-title">Nuestros locales <span>{tiendas.length}</span></h2><p className="muted">Mantén la información de cada tienda al día.</p></div><Button variant="ghost" onClick={() => void load()} disabled={loading} aria-label="Actualizar listado"><RefreshCw size={17} /></Button></div>
        <div className="filters"><div className="search-field"><Search size={18} /><input aria-label="Buscar tienda" placeholder="Buscar por nombre de tienda…" value={search} onChange={e => setSearch(e.target.value)} /></div>
          <select aria-label="Filtrar por categoría" value={category} onChange={e => setCategory(e.target.value)}><option value="">Todas las categorías</option>{categorias.map(x => <option key={x}>{x}</option>)}</select></div>
        {error ? <div className="empty-state"><p className="error-banner" role="alert">{error}</p><Button variant="secondary" onClick={() => void load()}>Reintentar</Button></div> : loading ? <div className="empty-state" role="status"><span className="spinner" />Cargando tiendas…</div> : filtered.length ? <TiendasTable tiendas={filtered} onEdit={t => setEditing(t)} onDelete={t => { setDeleting(t); setDeleteError(""); }} /> :
          <div className="empty-state"><Store size={34} /><h3>{tiendas.length ? "No encontramos coincidencias" : "Tu directorio empieza aquí"}</h3><p>{tiendas.length ? "Prueba con otro nombre o categoría." : "Crea tu primera tienda para empezar a organizar tus locales."}</p>{!tiendas.length && <Button onClick={() => setEditing(null)}><Plus size={17} />Nueva tienda</Button>}</div>}
        <div className="table-footer"><span>{loading ? "Cargando…" : `${filtered.length} de ${tiendas.length} tiendas`}</span><span>Directorio comercial <ArrowUpRight size={14} /></span></div>
      </section><footer className="page-footer"><span>Real Plaza · Gestión comercial</span><span>Información que conecta espacios.</span></footer>
    </main></div>
    {editing !== undefined && <TiendaForm tienda={editing ?? undefined} onSave={save} onClose={() => setEditing(undefined)} />}
    {deleting && <Modal title="Eliminar tienda" description={`Vas a eliminar “${deleting.nombre}” del directorio. Esta acción no se puede deshacer.`} onClose={() => setDeleting(null)} busy={busy}>
      {deleteError && <p className="error-banner" role="alert">{deleteError}</p>}<div className="modal-actions"><Button variant="secondary" disabled={busy} onClick={() => setDeleting(null)}>Cancelar</Button><Button variant="danger" busy={busy} onClick={remove}><Trash2 size={16} />Eliminar tienda</Button></div>
    </Modal>}
  </div>;
}
