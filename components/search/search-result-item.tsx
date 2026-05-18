import type { ReactNode } from 'react';
import { CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface SearchResultItemProps {
  value: string;
  title: string | ReactNode;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  isSquare?: boolean;
  url: string;
  onSelect: (url: string) => void;
}

export function SearchResultItem({
  value,
  title,
  subtitle,
  imageUrl,
  imageAlt,
  isSquare = false,
  url,
  onSelect,
}: SearchResultItemProps) {
  return (
    <CommandItem
      value={value}
      onSelect={() => onSelect(url)}
      className="ow-search-result-item cursor-pointer gap-3"
    >
      {imageUrl && (
        <div
          className={cn(
            'shrink-0 overflow-hidden rounded bg-slate-100',
            isSquare ? 'aspect-square w-10' : 'aspect-[16/10] w-12',
          )}
        >
          <img
            src={imageUrl}
            alt={imageAlt ?? ''}
            className="h-full w-full object-contain"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{title}</div>
        {subtitle && (
          <div className="truncate text-xs text-slate-500">{subtitle}</div>
        )}
      </div>
    </CommandItem>
  );
}
