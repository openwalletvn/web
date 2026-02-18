'use client';

import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconSettings, IconArrowLeft } from '@tabler/icons-react';
import { db } from '@/lib/db';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const walletName = useLiveQuery(
    () => db.config.get('walletName').then((c) => c?.value ?? 'My Wallet'),
    [],
    'My Wallet',
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-dashed border-slate-200 px-4 py-3 sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              title="Card Catalog"
            >
              <IconArrowLeft size={18} />
            </Link>
            <span className="font-bold text-slate-900 text-sm">{walletName}</span>
          </div>
          <Link
            href="/app/settings"
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            title="Cài đặt"
          >
            <IconSettings size={18} />
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
