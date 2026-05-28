'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconCreditCard, IconArrowRight } from '@tabler/icons-react';
import { useWalletCatalog } from '@/hooks/use-wallet-catalog';
import { PageContainer } from '@/components/ui/page-container';
import { EmptyState } from '@/components/ui/empty-state';
import { PaymentRow, getNextOccurrence } from '@/components/wallet/payment-row';
import { resolveStatementDay, getRelatedStatements } from '@/lib/card-dates';
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

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
 return (
 <div className="animate-pulse space-y-8">
 <div className="grid grid-cols-3 gap-3">
 <div className="col-span-3 h-20 bg-slate-100 rounded-sm" />
 {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-slate-100 rounded-sm" />)}
 </div>
 <div className="space-y-3">
 <div className="h-4 w-48 bg-slate-100 rounded" />
 <div className="border border-dashed border-slate-200 rounded-sm p-4 space-y-3">
 {[1, 2].map((i) => <div key={i} className="h-12 bg-slate-100 rounded-sm" />)}
 </div>
 </div>
 <div className="space-y-3">
 <div className="h-4 w-32 bg-slate-100 rounded" />
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-sm" />)}
 </div>
 </div>
 </div>
 );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
 const db = useWalletDb();
 const walletCards = useLiveQuery(() => db.walletCards.toArray(), [db]);
 const creditAccounts = useLiveQuery(() => db.creditAccounts.toArray(), [db], []);

 const { banks, catalogCards } = useWalletCatalog(walletCards);

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
 dueDate = getRelatedStatements(today, statementDay, interestFreeDays).find((s) => s.due >= today)?.due ?? null;
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


 const isLoading = walletCards === undefined;
 const isEmpty = !isLoading && walletCards.length === 0;

 const now = new Date();
 const monthLabel = `Tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;

 return (
 <PageContainer>
 {/* Header */}
 <div className="flex items-baseline justify-between mb-2">
 <h1 className="">Tổng quan</h1>
 <span className="text-sm text-slate-500">{monthLabel}</span>
 </div>
 <div className="border-t border-dashed border-slate-200 mb-6" />

 {isLoading && <DashboardSkeleton />}

 {isEmpty && (
 <EmptyState
 icon={<IconCreditCard size={26} className="text-slate-300" />}
 title="Ví trống"
 description="Thêm thẻ đầu tiên để bắt đầu theo dõi sao kê và hạn thanh toán."
 action={{ label: 'Thêm thẻ đầu tiên', href: '/app/add' }}
 />
 )}

 {!isLoading && !isEmpty && (
 <>
 {/* ── Top stats ── */}
 <div className="grid grid-cols-3 gap-3 mb-8">
 <div className="col-span-3 border border-dashed border-slate-200 rounded-sm p-4">
 <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Tổng hạn mức tín dụng</p>
 <p className="">{formatVND(totalCreditLimit)}</p>
 </div>
 <div className="border border-dashed border-slate-200 rounded-sm p-4">
 <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Thẻ hoạt động</p>
 <p className="">{activeCards.length}</p>
 </div>
 <div className="border border-dashed border-slate-200 rounded-sm p-4">
 <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Ngân hàng</p>
 <p className="">{totalBanks}</p>
 </div>
 <div className="border border-dashed border-slate-200 rounded-sm p-4">
 <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Đến hạn / 30 ngày</p>
 <p className="">{allUpcoming.length}</p>
 </div>
 </div>

 {/* ── Upcoming payments preview ── */}
 <div className="mb-8">
 <div className="flex items-center justify-between mb-3">
 <h2 className="text-label text-text-muted">
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
 {previewUpcoming.map(({ walletCard }) => (
 <PaymentRow
 key={walletCard.id}
 walletCard={walletCard}
 catalogCard={catalogCards[walletCard.cardId]}
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
 <h2 className="text-label text-text-muted mb-3">
 Trạng thái thẻ
 </h2>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {Object.entries(STATUS_LABELS).map(([status, label]) => (
 <div key={status} className="border border-dashed border-slate-200 rounded-sm p-3">
 <p className="">{statusCounts[status] ?? 0}</p>
 <p className="text-sm text-slate-500 mt-0.5">{label}</p>
 </div>
 ))}
 </div>
 </div>
 </>
 )}
 </PageContainer>
 );
}
