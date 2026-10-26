import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost"; busy?: boolean };
export function Button({ variant = "primary", busy, children, className = "", disabled, ...props }: Props) {
  return <button {...props} disabled={disabled || busy} className={`btn btn-${variant} ${className}`} aria-busy={busy || undefined}>
    {busy && <span className="spinner" aria-hidden="true" />}{children}
  </button>;
}
