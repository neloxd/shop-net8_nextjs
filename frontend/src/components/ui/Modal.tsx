"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({ title, description, children, onClose, busy = false }: {
  title: string; description: string; children: ReactNode; onClose: () => void; busy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} className="modal" aria-labelledby="modal-title" aria-describedby="modal-description"
    onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
    <div className="modal-heading"><div><p className="eyebrow">DIRECTORIO COMERCIAL</p><h2 id="modal-title">{title}</h2></div>
      <button type="button" className="icon-button" aria-label="Cerrar ventana" onClick={onClose} disabled={busy}><X size={20} /></button>
    </div>
    <p className="muted" id="modal-description">{description}</p>
    {children}
  </dialog>;
}
