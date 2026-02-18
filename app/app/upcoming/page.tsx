'use client';

import { useMemo, useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconCreditCard } from '@tabler/icons-react';
import { getBanks, getCard, type Bank, type Card } from '@/lib/api';
import { PageContainer } from '@/components/ui/page-container';
import { PaymentRow, getNextOccurrence } from '@/components/wallet/payment-row';
import { useWalletDb } from '@/providers/wallet-db-provider';

export default function UpcomingPage() {
  const db = useWalletDb();
  const walletCards = useLiveQuery(() => db.walletCards.toArray(), [db], []);
  const [banks, setBanks] = useState<Record<string, Bank>>({});
  const [catalogCards, setCatalogCards] = useState<Record<string, Card>>({});

  useEffect(() => {
    getBanks().then((list) =>
      setBanks(Object.fromEntries(list.map((b) => [b.id, b]))),
    );
  }, []);

  const activeCards = useMemo(
    () => (walletCards ?? []).filter((c) => c.status !== 'expired' && c.status !== 'canceled'),
    [walletCards],
  );

  const upcomingPayments = useMemo(() =>
    activeCards
      .filter((c) => c.paymentDueDate)
      .map((c) => ({ walletCard: c, date: getNextOccurrence(c.paymentDueDate!) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [activeCards],
  );

  useEffect(() => {
    const missing = upcomingPayments
      .map((u) => u.walletCard.cardId)
      .filter((id) => !catalogCards[id]);
    if (!missing.length) return;
    Promise.all(
      missing.map((id) =>
        getCard(id).then((card) => [id, card] as const).catch(() => null),
      ),
    ).then((results) => {
      const entries = Object.fromEntries(
        results.filter((r): r is [string, Card] => r !== null),
      );
      setCatalogCards((prev) => ({ ...prev, ...entries }));
    });
  }, [upcomingPayments]);

  return (
    <PageContainer>
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Đến hạn thanh toán</h1>
        <span className="text-sm text-slate-400">{upcomingPayments.length} thẻ</span>
      </div>
      <div className="border-t border-dashed border-slate-200 mb-6" />

      <div className="border border-dashed border-slate-200 rounded-sm px-4">
        {upcomingPayments.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-slate-300">
            <IconCreditCard size={28} />
            <p className="text-sm">Chưa có thẻ nào có ngày đến hạn</p>
          </div>
        ) : (
          upcomingPayments.map(({ walletCard, date }, i) => (
            <PaymentRow
              key={walletCard.id}
              date={date}
              walletCard={walletCard}
              catalogCard={catalogCards[walletCard.cardId]}
              bank={banks[walletCard.bankId]}
              isNext={i === 0}
            />
          ))
        )}
      </div>
    </PageContainer>
  );
}
