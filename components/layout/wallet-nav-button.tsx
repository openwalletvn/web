'use client';

import Link from 'next/link';
import { DropdownMenu } from 'radix-ui';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconWallet, IconPlus, IconSettings, IconChevronDown } from '@tabler/icons-react';
import { db } from '@/lib/db';

export function WalletNavButton() {
  const walletName = useLiveQuery(
    () => db.config.get('walletName').then((c) => c?.value ?? null),
    [],
    null,
  );

  const label = walletName ?? 'Ví của tôi';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 rounded-sm text-sm font-medium text-slate-700 hover:border-brand-blue hover:text-brand-blue transition-colors">
          <IconWallet size={15} />
          <span className="hidden sm:inline">{label}</span>
          <IconChevronDown size={13} className="hidden sm:block text-slate-400" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[180px] bg-white border border-dashed border-slate-200 rounded-sm shadow-sm py-1 animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenu.Item asChild>
            <Link
              href="/app"
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer outline-none"
            >
              <IconWallet size={14} className="text-slate-400" />
              {label}
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/app/add"
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer outline-none"
            >
              <IconPlus size={14} className="text-slate-400" />
              Thêm thẻ
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 border-t border-dashed border-slate-100" />

          <DropdownMenu.Item asChild>
            <Link
              href="/app/settings"
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer outline-none"
            >
              <IconSettings size={14} className="text-slate-400" />
              Cài đặt ví
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
