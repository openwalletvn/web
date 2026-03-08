'use client';

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconCreditCard, IconArrowRight } from '@tabler/icons-react';
import { getBanks, getCard, type Bank, type Card } from '@/lib/api';
import { PageContainer } from '@/components/ui/page-container';
import { PaymentRow, getNextOccurrence } from '@/components/wallet/payment-row';
import { resolveStatementDay, StatementCalendar } from '@/lib/card-dates';
import { useWalletDb } from '@/providers/wallet-db-provider';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Đang dùng',
  locked: 'Đã khoá',
  expired: 'Hết hạn',
  canceled: 'Đã huỷ',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const db = useWalletDb();
  const walletCards = useLiveQuery(() => db.walletCards.toArray(), [db], []);
  const creditAccounts = useLiveQuery(() => db.creditAccounts.toArray(), [db], []);

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

  const totalCreditLimit = useMemo(
    () => (creditAccounts ?? []).reduce((sum, a) => sum + a.creditLimit, 0),
    [creditAccounts],
  );

  const totalBanks = useMemo(
    () => new Set(activeCards.map((c) => c.bankId)).size,
    [activeCards],
  );

  const allUpcoming = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const limit = today.getTime() + 30 * 86_400_000;
    return activeCards
      .flatMap((c) => {
        let dueDate: Date | null = null;
        if (c.paymentDueDateSource === 'custom' && c.paymentDueDate) {
          dueDate = new Date(today.getFullYear(), today.getMonth(), c.paymentDueDate);
        } else {
          const statementDay = resolveStatementDay(c.statementDate, catalogCards[c.cardId]?.statement_date);
          const interestFreeDays = catalogCards[c.cardId]?.interest_free_days;
          if (statementDay != null && interestFreeDays != null) {
            dueDate = new StatementCalendar(statementDay, interestFreeDays).getContext(today).nextDueDate;
          }
        }
        if (!dueDate) return [];
        return [{ walletCard: c, date: getNextOccurrence(dueDate, today) }];
      })
      .filter(({ date }) => date.getTime() <= limit)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [activeCards, catalogCards]);

  const previewUpcoming = allUpcoming.slice(0, 2);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { active: 0, locked: 0, expired: 0, canceled: 0 };
    for (const c of walletCards ?? []) {
      const s = c.status ?? 'active';
      counts[s] = (counts[s] ?? 0) + 1;
    }
    return counts;
  }, [walletCards]);

  // Load catalog cards for all active cards — needed for calcDueDate
  useEffect(() => {
    const missing = activeCards.map((c) => c.cardId).filter((id) => !catalogCards[id]);
    if (!missing.length) return;
    const unique = [...new Set(missing)];
    Promise.all(
      unique.map((id) =>
        getCard(id).then((card) => [id, card] as const).catch(() => null),
      ),
    ).then((results) => {
      const entries = Object.fromEntries(
        results.filter((r): r is [string, Card] => r !== null),
      );
      setCatalogCards((prev) => ({ ...prev, ...entries }));
    });
  }, [activeCards]);

  const now = new Date();
  const monthLabel = `Tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
        <span className="text-sm text-slate-500">{monthLabel}</span>
      </div>
      <div className="border-t border-dashed border-slate-200 mb-6" />

      {/* ── Top stats ── */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="col-span-3 border border-dashed border-slate-200 rounded-sm p-4">
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Tổng hạn mức tín dụng</p>
          <p className="text-4xl font-bold text-slate-900">{formatVND(totalCreditLimit)}</p>
        </div>
        <div className="border border-dashed border-slate-200 rounded-sm p-4">
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Thẻ hoạt động</p>
          <p className="text-3xl font-bold text-slate-900">{activeCards.length}</p>
        </div>
        <div className="border border-dashed border-slate-200 rounded-sm p-4">
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Ngân hàng</p>
          <p className="text-3xl font-bold text-slate-900">{totalBanks}</p>
        </div>
        <div className="border border-dashed border-slate-200 rounded-sm p-4">
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Đến hạn / 30 ngày</p>
          <p className="text-3xl font-bold text-slate-900">{allUpcoming.length}</p>
        </div>
      </div>

      {/* ── Upcoming payments preview ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Đến hạn thanh toán · 30 ngày tới
          </h2>
          {allUpcoming.length > 0 && (
            <Link
              href="/app/upcoming"
              className="flex items-center gap-1 text-sm text-brand-blue hover:underline"
            >
              Xem tất cả <IconArrowRight size={12} />
            </Link>
          )}
        </div>
        <div className="border border-dashed border-slate-200 rounded-sm px-4">
          {previewUpcoming.length === 0 ? (
            <div className="py-8 flex flex-col items-center gap-2 text-slate-300">
              <IconCreditCard size={28} />
              <p className="text-sm">Không có thẻ nào đến hạn trong 30 ngày tới</p>
            </div>
          ) : (
            <>
              {previewUpcoming.map(({ walletCard, date }, i) => (
                <PaymentRow
                  key={walletCard.id}
                  date={date}
                  walletCard={walletCard}
                  catalogCard={catalogCards[walletCard.cardId]}
                  bank={banks[walletCard.bankId]}
                  variant="upcoming"
                />
              ))}
              {allUpcoming.length > 2 && (
                <div className="py-3 text-center border-t border-dashed border-slate-100">
                  <Link href="/app/upcoming" className="text-sm text-brand-blue hover:underline">
                    + {allUpcoming.length - 2} thẻ nữa
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Status breakdown ── */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Trạng thái thẻ
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <div key={status} className="border border-dashed border-slate-200 rounded-sm p-3">
              <p className="text-2xl font-bold text-slate-900">{statusCounts[status] ?? 0}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
