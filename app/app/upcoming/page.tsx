'use client';

import { useMemo, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconCreditCard } from '@tabler/icons-react';
import { getBanks, getCard, type Bank, type Card } from '@/lib/api';
import { PageContainer } from '@/components/ui/page-container';
import { PaymentRow, getNextOccurrence, getPreviousOccurrence } from '@/components/wallet/payment-row';
import { useWalletDb } from '@/providers/wallet-db-provider';
import type { WalletCard } from '@/lib/db';

type PaymentEntry = { walletCard: WalletCard; date: Date };

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-dashed border-slate-200">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-slate-400">{count} thẻ</p>
    </div>
  );
}

export default function UpcomingPage() {
  const db = useWalletDb();
  const walletCards = useLiveQuery(() => db.walletCards.toArray(), [db], []);
  const [banks, setBanks] = useState<Record<string, Bank>>({});
  const [catalogCards, setCatalogCards] = useState<Record<string, Card>>({});

  useEffect(() => {
    getBanks().then((list) => setBanks(Object.fromEntries(list.map((b) => [b.id, b]))));
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const activeCards = useMemo(
    () => (walletCards ?? []).filter((c) => c.status !== 'expired' && c.status !== 'canceled'),
    [walletCards],
  );

  const { lastWeek, thisWeek, upcoming } = useMemo(() => {
    const sevenDaysAgo = new Date(today.getTime() - 7 * 86_400_000);
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 86_400_000);
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 86_400_000);

    const lastWeek: PaymentEntry[] = [];
    const thisWeek: PaymentEntry[] = [];
    const upcoming: PaymentEntry[] = [];

    for (const c of activeCards) {
      if (!c.paymentDueDate) continue;

      const prev = getPreviousOccurrence(c.paymentDueDate, today);
      const next = getNextOccurrence(c.paymentDueDate, today);

      if (prev >= sevenDaysAgo && prev < today) {
        lastWeek.push({ walletCard: c, date: prev });
      }
      if (next >= today && next < sevenDaysFromNow) {
        thisWeek.push({ walletCard: c, date: next });
      } else if (next >= sevenDaysFromNow && next <= thirtyDaysFromNow) {
        upcoming.push({ walletCard: c, date: next });
      }
    }

    lastWeek.sort((a, b) => b.date.getTime() - a.date.getTime()); // most recent first
    thisWeek.sort((a, b) => a.date.getTime() - b.date.getTime());
    upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());

    return { lastWeek, thisWeek, upcoming };
  }, [activeCards, today]);

  const allEntries = useMemo(
    () => [...lastWeek, ...thisWeek, ...upcoming],
    [lastWeek, thisWeek, upcoming],
  );

  useEffect(() => {
    const missing = allEntries.map((u) => u.walletCard.cardId).filter((id) => !catalogCards[id]);
    if (!missing.length) return;
    Promise.all(
      missing.map((id) => getCard(id).then((card) => [id, card] as const).catch(() => null)),
    ).then((results) => {
      const entries = Object.fromEntries(results.filter((r): r is [string, Card] => r !== null));
      setCatalogCards((prev) => ({ ...prev, ...entries }));
    });
  }, [allEntries]);

  const totalCount = lastWeek.length + thisWeek.length + upcoming.length;
  const isEmpty = totalCount === 0;

  function renderRows(entries: PaymentEntry[], highlightToday = false) {
    return entries.map(({ walletCard, date }) => (
      <PaymentRow
        key={`${walletCard.id}-${date.getTime()}`}
        date={date}
        walletCard={walletCard}
        catalogCard={catalogCards[walletCard.cardId]}
        bank={banks[walletCard.bankId]}
        isNext={highlightToday && date.getTime() === today.getTime()}
      />
    ));
  }

  return (
    <PageContainer>
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Đến hạn thanh toán</h1>
        <span className="text-sm text-slate-500">{totalCount} thẻ</span>
      </div>
      <div className="border-t border-dashed border-slate-200 mb-6" />

      {isEmpty ? (
        <div className="border border-dashed border-slate-200 rounded-sm py-12 flex flex-col items-center gap-2 text-slate-300">
          <IconCreditCard size={28} />
          <p className="text-sm">Chưa có thẻ nào có ngày đến hạn</p>
        </div>
      ) : (
        <div className="border border-dashed border-slate-200 rounded-sm overflow-hidden">
          {lastWeek.length > 0 && (
            <>
              <SectionHeader label="Tuần trước" count={lastWeek.length} />
              <div className="px-4">{renderRows(lastWeek, false)}</div>
            </>
          )}
          {thisWeek.length > 0 && (
            <>
              <SectionHeader label="Tuần này" count={thisWeek.length} />
              <div className="px-4">{renderRows(thisWeek, true)}</div>
            </>
          )}
          {upcoming.length > 0 && (
            <>
              <SectionHeader label="30 ngày tới" count={upcoming.length} />
              <div className="px-4">{renderRows(upcoming, false)}</div>
            </>
          )}
        </div>
      )}
    </PageContainer>
  );
}
