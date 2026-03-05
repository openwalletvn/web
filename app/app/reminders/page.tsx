'use client';

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconBell, IconBellOff } from '@tabler/icons-react';
import { getBanks, getCard, type Bank, type Card } from '@/lib/api';
import { appDb, type NotificationAdapter } from '@/lib/app-db';
import { PageContainer } from '@/components/ui/page-container';
import { useWalletDb } from '@/providers/wallet-db-provider';
import { ReminderCardRow } from './reminder-card-row';

const MAX_REMINDERS = 5;

export default function RemindersPage() {
  const db = useWalletDb();
  const walletCards = useLiveQuery(() => db.walletCards.toArray(), [db], []);
  const adapters = useLiveQuery(() => appDb.notificationAdapters.toArray(), [], []);
  const [banks, setBanks] = useState<Record<string, Bank>>({});
  const [catalogCards, setCatalogCards] = useState<Record<string, Card>>({});

  const activeAdapter = useMemo(
    () => adapters?.find((a) => a.enabled),
    [adapters],
  );

  const activeCards = useMemo(
    () => (walletCards ?? []).filter((c) => c.status !== 'expired' && c.status !== 'canceled'),
    [walletCards],
  );

  const activeRemoteCount = useMemo(
    () =>
      activeCards.reduce((count, c) => {
        const n = c.notifications;
        if (n?.statementDate?.remoteId) count++;
        if (n?.paymentDueDate?.remoteId) count++;
        return count;
      }, 0),
    [activeCards],
  );

  useEffect(() => {
    getBanks().then((list) =>
      setBanks(Object.fromEntries(list.map((b) => [b.id, b]))),
    );
  }, []);

  useEffect(() => {
    const missing = activeCards.map((c) => c.cardId).filter((id) => !catalogCards[id]);
    if (!missing.length) return;
    const unique = [...new Set(missing)];
    Promise.all(
      unique.map((id) => getCard(id).then((card) => [id, card] as const).catch(() => null)),
    ).then((results) => {
      const entries = Object.fromEntries(results.filter((r): r is [string, Card] => r !== null));
      setCatalogCards((prev) => ({ ...prev, ...entries }));
    });
  }, [activeCards]);

  return (
    <PageContainer>
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Nhắc nhở</h1>
      </div>
      <div className="border-t border-dashed border-slate-200 mb-6" />

      {/* Adapter banner */}
      {!activeAdapter ? (
        <div className="mb-6 flex items-center gap-3 p-4 border border-dashed border-amber-300 bg-amber-50/40 rounded-sm">
          <IconBellOff size={20} className="text-amber-500 shrink-0" />
          <div className="flex-1 text-sm text-amber-700">
            Chưa cài kênh thông báo.{' '}
            <Link href="/app/settings" className="underline text-brand-blue">Cài đặt ngay</Link>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-3 p-4 border border-dashed border-green-300 bg-green-50/40 rounded-sm">
          <IconBell size={20} className="text-green-600 shrink-0" />
          <span className="text-sm text-green-700">
            Đã kết nối {activeAdapter.id === 'discord' ? 'Discord' : activeAdapter.id}
          </span>
        </div>
      )}

      {/* Card list */}
      <div className="border border-dashed border-slate-200 rounded-sm px-4">
        {activeCards.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-slate-300">
            <IconBell size={28} />
            <p className="text-sm">Chưa có thẻ nào trong ví</p>
          </div>
        ) : (
          activeCards.map((card) => (
            <ReminderCardRow
              key={card.id}
              walletCard={card}
              catalogCard={catalogCards[card.cardId]}
              bank={banks[card.bankId]}
              adapter={activeAdapter}
              db={db}
              limitReached={activeRemoteCount >= MAX_REMINDERS}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <p className="mt-4 text-sm text-slate-400 text-center">
        {activeRemoteCount}/{MAX_REMINDERS} nhắc nhở đã dùng
        {activeAdapter ? ` (${activeAdapter.id === 'discord' ? 'Discord' : activeAdapter.id})` : ''}
      </p>
    </PageContainer>
  );
}
