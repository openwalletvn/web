'use client';

import {useMemo} from 'react';
import {useLiveQuery} from 'dexie-react-hooks';
import {IconAlertTriangle, IconCreditCard} from '@tabler/icons-react';
import {useWalletCatalog} from '@/hooks/use-wallet-catalog';
import {PageContainer} from '@/components/ui/page-container';
import {EmptyState} from '@/components/ui/empty-state';
import {PaymentRow} from '@/components/wallet/payment-row';
import {WalletCardListSkeleton} from '@/components/wallet/wallet-card-list-skeleton';
import {useWalletDb} from '@/providers/wallet-db-provider';
import type {Milestone} from '@/lib/card-dates';
import {type CardWithMilestones, sortCardsByMilestones, toCardWithMilestones} from '@/lib/card-milestones';

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

 const todayDue = milestones.find((m) => m.type === 'due' && m.isToday);
 const pastDue = [...milestones].reverse().find((m) => m.type === 'due' && m.isPast);
 const nextDue = milestones.find((m) => m.type === 'due' && m.isUpcoming);
 const nextClose = milestones.find((m) => m.type === 'close' && m.isUpcoming);

 if (todayDue) return { date: todayDue.date, variant: 'today' };
 if (pastDue) return { date: pastDue.date, variant: 'past' };
 return { date: (nextDue ?? nextClose)?.date ?? today, variant: 'upcoming' };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UpcomingPage() {
 const db = useWalletDb();
 const walletCards = useLiveQuery(() => db.walletCards.toArray(), [db]);
 const { banks, catalogCards } = useWalletCatalog(walletCards);

 const today = useMemo(() => {
 const d = new Date();
 return new Date(d.getFullYear(), d.getMonth(), d.getDate());
 }, []);

 const creditCards = useMemo(
 () => (walletCards ?? []).filter( // ?? [] handles undefined during loading
 (c) => c.status !== 'expired' && c.status !== 'canceled'
 && (c.cardType === 'credit' || c.cardType === 'hybrid'),
 ),
 [walletCards],
 );


 const { warningCards, mainCards } = useMemo(() => {
 const all = creditCards.map((c) => toCardWithMilestones(c, catalogCards[c.cardId], today));
 const warning = all.filter((c) => c.timeline === null);
 const main = sortCardsByMilestones(all.filter((c) => c.timeline !== null));
 return { warningCards: warning, mainCards: main };
 }, [creditCards, catalogCards, today]);

 const isLoading = walletCards === undefined;
 const totalCount = warningCards.length + mainCards.length;
 const isEmpty = !isLoading && totalCount === 0;

 function renderCard(card: CardWithMilestones) {
 const { date, variant } = resolveDisplay(card, today);
 return (
 <PaymentRow
 key={card.walletCard.id}
 walletCard={card.walletCard}
 catalogCard={card.catalogCard}
 variant={variant}
 />
 );
 }

 return (
 <PageContainer>
 <div className="flex items-baseline justify-between mb-2">
 <h1 className="">Đến hạn thanh toán</h1>
 <span className="text-sm text-slate-500">{totalCount} thẻ</span>
 </div>
 <div className="border-t border-dashed border-slate-200 mb-6" />

 {isLoading && <WalletCardListSkeleton />}

 {isEmpty && (
 <EmptyState
 icon={<IconCreditCard size={26} className="text-slate-300" />}
 title="Chưa có thẻ tín dụng nào"
 description="Thêm thẻ tín dụng để theo dõi ngày sao kê và đến hạn."
 action={{ label: 'Thêm thẻ', href: '/app/add' }}
 />
 )}

 {!isLoading && !isEmpty && (
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
 walletCard={card.walletCard}
 catalogCard={card.catalogCard}
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
