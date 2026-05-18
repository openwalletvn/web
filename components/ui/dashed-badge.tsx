import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'blue' | 'red' | 'amber' | 'green';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-border-mid text-text-muted',
  blue:    'border-blue-500 text-blue-600',
  red:     'border-primary text-primary',
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
        'ow-dashed-badge text-xs px-1.5 py-0.5 border border-dashed rounded-sm shrink-0',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
