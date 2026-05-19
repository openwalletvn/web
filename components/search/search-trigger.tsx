import {IconSearch} from '@tabler/icons-react';
import {cn} from '@/lib/utils';

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
          'ow-search-trigger cursor-pointer flex w-full items-center gap-2 rounded-md border-2 border-black bg-slate-50 p-0.5 transition-colors hover:border-primary hover:bg-white',
        className,
      )}
    >
      <span className="bg-primary rounded-sm w-8 h-8 flex justify-center items-center text-white">
          <IconSearch className="size-4 shrink-0"/>
      </span>
      <span className="flex-1 text-left">Tìm kiếm</span>
      <kbd className="hidden items-center gap-0.5 rounded px-1.5 text-xs md:flex opacity-50">
        <span className="text-[16px]">⌘</span>K
      </kbd>
    </button>
  );
}
