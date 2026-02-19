import { IconDiamond } from '@tabler/icons-react';

interface Props {
  /** 'sm' for post cards, 'md' for post detail header */
  size?: 'sm' | 'md';
}

export function AiBadge({ size = 'sm' }: Props) {
  if (size === 'md') {
    return (
      <span
        title="Nội dung được tổng hợp hoặc hỗ trợ bởi AI"
        className="inline-flex items-center gap-1 px-2 py-0.5 border border-dashed border-slate-300 rounded-sm text-xs text-slate-400 select-none"
      >
        <IconDiamond size={11} strokeWidth={1.75} />
        AI
      </span>
    );
  }

  return (
    <span
      title="Nội dung được tổng hợp hoặc hỗ trợ bởi AI"
      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 border border-dashed border-slate-200 rounded-sm text-[10px] text-slate-400 select-none"
    >
      <IconDiamond size={9} strokeWidth={1.75} />
      AI
    </span>
  );
}
