import type {ReactNode} from 'react';
import Link from 'next/link';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="ow-empty-state flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 border border-dashed border-slate-200 rounded flex items-center justify-center mb-5">
        {icon}
      </div>
      <p className="text-slate-500 text-sm mb-1">{title}</p>
      {description && <p className="text-slate-400 mb-6">{description}</p>}
      {action && (
        <Link
          href={action.href}
          className="px-6 py-2.5 border border-dashed border-brand-blue text-brand-blue font-medium rounded hover:bg-blue-50/60 transition-colors text-sm"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
