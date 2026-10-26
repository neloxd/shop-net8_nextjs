import { ArrowUpRight, Store, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";

export default async function Login({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const { expired } = await searchParams;
  return <main className="login-page"><section className="login-story"><div className="brand"><span className="brand-symbol">r<span>p</span></span><span>real plaza<span className="brand-subtitle">GESTIÓN COMERCIAL</span></span></div>
    <div className="story-content"><span className="story-tag"><Sparkles size={16} /> ESPACIOS QUE CONECTAN</span><h1>Cada tienda.<br />Una nueva<br /><span>posibilidad.</span></h1><p>La comunidad crece cuando cada espacio cuenta.<br />Gestiona nuestros locales desde un solo lugar.</p>
      <div className="story-card"><span className="story-store"><Store size={30} /></span><div><strong>Un directorio, todos tus locales</strong><span>Conecta información. Simplifica tu día.</span></div><ArrowUpRight size={24} /></div></div>
    <p className="story-footer">Real Plaza · Administración de tiendas</p></section>
    <section className="login-panel"><div className="login-box"><p className="eyebrow">BIENVENIDO A TU ESPACIO</p><h2>Todo listo para<br />un nuevo día.</h2><p className="muted">Ingresa a tu cuenta para gestionar el directorio de tiendas.</p><LoginForm expired={expired === "1"} /></div><p className="login-footer">Panel de gestión comercial · Acceso privado</p></section>
  </main>;
}
