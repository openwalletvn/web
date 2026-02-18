'use client';

import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconWallet } from '@tabler/icons-react';
import { db } from '@/lib/db';

export function WalletNavButton() {
  const walletName = useLiveQuery(
    () => db.config.get('walletName').then((c) => c?.value ?? null),
    [],
    null,
  );

  const label = walletName ?? 'Ví của tôi';

  return (
    <Link
      href="/app"
      className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 rounded-sm text-sm font-medium text-slate-700 hover:border-brand-blue hover:text-brand-blue transition-colors"
    >
      <IconWallet size={15} />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
