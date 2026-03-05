'use client';

import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { IconCheck, IconCopy, IconX } from '@tabler/icons-react';

export function JsonViewerDialog({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] z-50 bg-white border border-dashed border-slate-300 rounded-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-dashed border-slate-200 shrink-0">
            <Dialog.Title className="font-semibold text-slate-900">Dữ liệu JSON</Dialog.Title>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 rounded-sm text-sm text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors"
              >
                {copied ? <IconCheck size={14} className="text-green-500" /> : <IconCopy size={14} />}
                {copied ? 'Đã sao chép' : 'Sao chép'}
              </button>
              <Dialog.Close className="p-1.5 text-slate-500 hover:text-slate-700 transition-colors">
                <IconX size={18} />
              </Dialog.Close>
            </div>
          </div>
          <div className="overflow-auto flex-1 p-4">
            <pre className="text-xs text-slate-700 whitespace-pre-wrap break-all font-mono leading-relaxed">
              {data}
            </pre>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
