import { IconSearch } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface SearchTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SearchTrigger({ onClick, className }: SearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-400 transition-colors hover:border-slate-300 hover:bg-white',
        className,
      )}
    >
      <IconSearch className="size-4 shrink-0" />
      <span className="flex-1 text-left">Tìm kiếm</span>
      <kbd className="hidden items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 text-xs text-slate-400 md:flex">
        <span className="text-[16px]">⌘</span>K
      </kbd>
    </button>
  );
}
