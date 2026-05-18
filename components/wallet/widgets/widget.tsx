import { type ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export function Widget({ title, children }: Props) {
  return (
    <div className="ow-widget border border-dashed border-slate-200 rounded-sm bg-white">
      <div className="px-4 py-3 border-b border-dashed border-slate-200">
        <p className="font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}
