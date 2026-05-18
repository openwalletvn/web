import type { ReactNode } from 'react';

export function FormField({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="ow-form-field">
      {label && <label className="block font-medium text-slate-600 mb-1">{label}</label>}
      {hint && <p className="text-slate-400 mb-1">{hint}</p>}
      {children}
    </div>
  );
}
