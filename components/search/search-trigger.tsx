import {IconSearch} from '@tabler/icons-react';
import {cn} from '@/lib/utils';
import {OwButtonHeader} from '@/components/owui/ow-button-header';

interface SearchTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SearchTrigger({ onClick, className }: SearchTriggerProps) {
  return (
    <OwButtonHeader
      onClick={onClick}
      icon={<IconSearch className="size-4 shrink-0"/>}
      kbd="K"
      className={cn('ow-search-trigger', className)}
    >
      Tìm kiếm
    </OwButtonHeader>
  );
}
