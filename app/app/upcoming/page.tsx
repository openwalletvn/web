'use client';

import { useMemo, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconCreditCard, IconAlertTriangle } from '@tabler/icons-react';
import { getBanks, getCard, type Bank, type Card } from '@/lib/api';
import { PageContainer } from '@/components/ui/page-container';
import { PaymentRow } from '@/components/wallet/payment-row';
import { useWalletDb } from '@/providers/wallet-db-provider';
import type { WalletCard } from '@/lib/db';
import type { Milestone } from '@/lib/card-dates';
import { toCardWithMilestones, sortCardsByMilestones, type CardWithMilestones } from '@/lib/card-milestones';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-dashed border-slate-200">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-slate-400">{count} thẻ</p>
    </div>
  );
}

/**
 * Derives the display date and variant for PaymentRow from a card's milestones.
 * - Past due → date = most recent past due, variant = 'past'
 * - Due today → date = today, variant = 'today'
 * - Otherwise → date = next due ?? next close ?? today, variant = 'upcoming'
 */
function resolveDisplay(
  card: CardWithMilestones,
  today: Date,
): { date: Date; variant: 'past' | 'today' | 'upcoming' } {
  const milestones: Milestone[] = card.timeline?.milestones ?? [];

  const todayDue  = milestones.find((m) => m.type === 'due' && m.isToday);
  const pastDue   = [...milestones].reverse().find((m) => m.type === 'due' && m.isPast);
  const nextDue   = milestones.find((m) => m.type === 'due'   && m.isUpcoming);
  const nextClose = milestones.find((m) => m.type === 'close' && m.isUpcoming);

  if (todayDue)  return { date: todayDue.date, variant: 'today' };
  if (pastDue)   return { date: pastDue.date,  variant: 'past' };
  return { date: (nextDue ?? nextClose)?.date ?? today, variant: 'upcoming' };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  const creditCards = useMemo(
    () => (walletCards ?? []).filter(
      (c) => c.status !== 'expired' && c.status !== 'canceled'
        && (c.cardType === 'credit' || c.cardType === '2in1'),
    ),
    [walletCards],
  );

  // Eagerly load catalog cards for all credit cards
  useEffect(() => {
    const missing = creditCards.map((c) => c.cardId).filter((id) => !catalogCards[id]);
    if (!missing.length) return;
    const unique = [...new Set(missing)];
    Promise.all(
      unique.map((id) => getCard(id).then((card) => [id, card] as const).catch(() => null)),
    ).then((results) => {
      const entries = Object.fromEntries(results.filter((r): r is [string, Card] => r !== null));
      setCatalogCards((prev) => ({ ...prev, ...entries }));
    });
  }, [creditCards]);

  const { warningCards, mainCards } = useMemo(() => {
    const all = creditCards.map((c) => toCardWithMilestones(c, catalogCards[c.cardId], today));
    const warning = all.filter((c) => c.timeline === null);
    const main    = sortCardsByMilestones(all.filter((c) => c.timeline !== null));
    return { warningCards: warning, mainCards: main };
  }, [creditCards, catalogCards, today]);

  const totalCount = warningCards.length + mainCards.length;
  const isEmpty = totalCount === 0;

  function renderCard(card: CardWithMilestones) {
    const { date, variant } = resolveDisplay(card, today);
    return (
      <PaymentRow
        key={card.walletCard.id}
        date={date}
        walletCard={card.walletCard}
        catalogCard={card.catalogCard}
        bank={banks[card.walletCard.bankId]}
        variant={variant}
      />
    );
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
          <p className="text-sm">Chưa có thẻ tín dụng nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Warning: cards missing billing data */}
          {warningCards.length > 0 && (
            <div className="border border-dashed border-amber-200 rounded-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-dashed border-amber-200">
                <IconAlertTriangle size={14} className="text-amber-500 shrink-0" />
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider flex-1">
                  Thiếu thông tin sao kê
                </p>
                <p className="text-sm text-amber-500">{warningCards.length} thẻ</p>
              </div>
              <div className="px-4">
                {warningCards.map((card) => (
                  <PaymentRow
                    key={card.walletCard.id}
                    date={today}
                    walletCard={card.walletCard}
                    catalogCard={card.catalogCard}
                    bank={banks[card.walletCard.bankId]}
                    variant="upcoming"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Main: sorted by billing urgency */}
          {mainCards.length > 0 && (
            <div className="border border-dashed border-slate-200 rounded-sm overflow-hidden">
              <SectionHeader label="Lịch thanh toán" count={mainCards.length} />
              <div className="px-4">
                {mainCards.map(renderCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
