'use client';

import { useMemo, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconCreditCard } from '@tabler/icons-react';
import { getBanks, getCard, type Bank, type Card } from '@/lib/api';
import { PageContainer } from '@/components/ui/page-container';
import { PaymentRow, getNextOccurrence, getPastOccurrence } from '@/components/wallet/payment-row';
import { resolveStatementDay, getRelatedStatements } from '@/lib/card-dates';
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

/** Resolves the effective due date for a wallet card. Custom overrides take precedence. */
function resolveEffectiveDueDate(
  walletCard: WalletCard,
  catalogCard: Card | undefined,
  today: Date,
): Date | null {
  if (walletCard.paymentDueDateSource === 'custom' && walletCard.paymentDueDate) {
    return new Date(today.getFullYear(), today.getMonth(), walletCard.paymentDueDate);
  }
  const statementDay = resolveStatementDay(walletCard.statementDate, catalogCard?.statement_date);
  const interestFreeDays = catalogCard?.interest_free_days;
  if (statementDay == null || interestFreeDays == null) return null;
  return getRelatedStatements(today, statementDay, interestFreeDays).find((s) => s.due >= today)?.due ?? null;
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

  // Eagerly load catalog cards for all active cards — needed for calcDueDate
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

  const { past, todayCards, upcoming } = useMemo(() => {
    const past: PaymentEntry[] = [];
    const todayCards: PaymentEntry[] = [];
    const upcoming: PaymentEntry[] = [];

    for (const c of activeCards) {
      const dueDate = resolveEffectiveDueDate(c, catalogCards[c.cardId], today);
      if (!dueDate) continue;

      if (dueDate.getTime() === today.getTime()) {
        todayCards.push({ walletCard: c, date: dueDate });
      } else {
        const pastDate = getPastOccurrence(dueDate, today);
        if (pastDate) {
          past.push({ walletCard: c, date: pastDate });
        } else {
          upcoming.push({ walletCard: c, date: getNextOccurrence(dueDate, today) });
        }
      }
    }

    past.sort((a, b) => a.date.getTime() - b.date.getTime());
    upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());

    return { past, todayCards, upcoming };
  }, [activeCards, catalogCards, today]);

  const totalCount = past.length + todayCards.length + upcoming.length;
  const isEmpty = totalCount === 0;

  function renderRows(entries: PaymentEntry[], variant: 'past' | 'today' | 'upcoming') {
    return entries.map(({ walletCard, date }) => (
      <PaymentRow
        key={`${walletCard.id}-${date.getTime()}`}
        date={date}
        walletCard={walletCard}
        catalogCard={catalogCards[walletCard.cardId]}
        bank={banks[walletCard.bankId]}
        variant={variant}
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
        <div className="space-y-4">
          <div className="border border-dashed border-slate-200 rounded-sm overflow-hidden">
            <SectionHeader label="Đã qua" count={past.length} />
            {past.length > 0 ? (
              <div className="px-4">{renderRows(past, 'past')}</div>
            ) : (
              <p className="px-4 py-4 text-sm text-slate-400">Không có thẻ nào đến hạn trong 7 ngày qua</p>
            )}
          </div>
          <div className="border border-dashed border-slate-200 rounded-sm overflow-hidden">
            <SectionHeader label="Hôm nay" count={todayCards.length} />
            {todayCards.length > 0 ? (
              <div className="px-4">{renderRows(todayCards, 'today')}</div>
            ) : (
              <p className="px-4 py-4 text-sm text-slate-400">Không có thẻ nào đến hạn hôm nay</p>
            )}
          </div>
          <div className="border border-dashed border-slate-200 rounded-sm overflow-hidden">
            <SectionHeader label="Sắp tới" count={upcoming.length} />
            {upcoming.length > 0 ? (
              <div className="px-4">{renderRows(upcoming, 'upcoming')}</div>
            ) : (
              <p className="px-4 py-4 text-sm text-slate-400">Không có thẻ nào sắp đến hạn</p>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
