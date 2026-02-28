import { CommandEmpty } from '@/components/ui/command';
import { IconLoader2 } from '@tabler/icons-react';

export function SearchLoading() {
  return (
    <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
      <IconLoader2 className="size-4 animate-spin" />
      <span>Đang tìm...</span>
    </div>
  );
}

export function SearchError({ message }: { message: string }) {
  return (
    <div className="py-6 text-center text-sm text-red-500">
      {message}
    </div>
  );
}

export function SearchNoResults() {
  return <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>;
}
