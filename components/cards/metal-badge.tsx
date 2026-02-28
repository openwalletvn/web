import { cn } from '@/lib/utils';

interface MetalBadgeProps {
  className?: string;
}

export function MetalBadge({ className }: MetalBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium border border-slate-300 bg-gradient-to-r from-slate-200 via-white to-slate-300 text-slate-600',
        className,
      )}
    >
      Kim loại
    </span>
  );
}
