import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'blue' | 'red' | 'amber' | 'green';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-slate-300 text-slate-500',
  blue:    'border-brand-blue text-brand-blue',
  red:     'border-brand-red text-brand-red',
  amber:   'border-amber-500 text-amber-600',
  green:   'border-green-600 text-green-700',
};

export function DashedBadge({
  children,
  variant = 'default',
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'text-xs px-1.5 py-0.5 border border-dashed rounded-sm shrink-0',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
