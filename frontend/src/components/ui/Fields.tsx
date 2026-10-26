import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };
export function Input({ label, error, id, ...props }: InputProps) {
  return <div className="field"><label htmlFor={id}>{label}</label>
    <input {...props} id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
    {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
  </div>;
}
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; children: ReactNode };
export function Select({ label, error, id, children, ...props }: SelectProps) {
  return <div className="field"><label htmlFor={id}>{label}</label>
    <select {...props} id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}>{children}</select>
    {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
  </div>;
}
