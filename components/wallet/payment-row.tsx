import {type Bank, type Card, getCardImageUrl} from '@/lib/api';
import type {WalletCard} from '@/lib/db';
import {getTimelineForCard, resolveStatementDay} from '@/lib/card-dates';
import {CardTimeline} from './card-timeline';

export const MONTH_VI = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

/**
 * Returns dueDate if it is >= today (this month's cycle), otherwise advances by one month.
 * Callers should pass the result of calcDueDate() as a full Date.
 */
export function getNextOccurrence(dueDate: Date, today: Date = new Date()): Date {
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dueDate >= t
        ? dueDate
        : new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, dueDate.getDate());
}

/**
 * Returns dueDate if it is < today, otherwise retreats by one month.
 */
export function getPreviousOccurrence(dueDate: Date, today: Date = new Date()): Date {
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dueDate < t
        ? dueDate
        : new Date(dueDate.getFullYear(), dueDate.getMonth() - 1, dueDate.getDate());
}

/**
 * Returns dueDate if it fell exactly 1–7 days ago (i.e. recently past), otherwise null.
 */
export function getPastOccurrence(dueDate: Date, today: Date = new Date()): Date | null {
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.floor((t.getTime() - dueDate.getTime()) / 86_400_000);
    return diffDays >= 1 && diffDays <= 7 ? dueDate : null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PaymentRow({
                               date,
                               walletCard,
                               catalogCard,
                               bank,
                               variant,
                           }: {
    date: Date;
    walletCard: WalletCard;
    catalogCard: Card | undefined;
    bank: Bank | undefined;
    variant: 'past' | 'today' | 'upcoming';
}) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isToday = variant === 'today';

    // Build timeline for non-custom cards
    const statementDay = resolveStatementDay(walletCard.statementDate, catalogCard?.statement_date);
    const timeline = (
        walletCard.paymentDueDateSource !== 'custom'
        && statementDay != null
        && catalogCard?.interest_free_days != null
    )
        ? getTimelineForCard(statementDay, catalogCard.interest_free_days, today)
        : null;

    // Days to the next event — mirrors the timeline summary
    const milestones = timeline?.milestones ?? [];
    const todayMilestone  = milestones.find((m) => m.isToday && m.type !== 'today') ?? null;
    const firstUpcoming   = milestones.find((m) => m.isUpcoming) ?? null;
    const daysToNext = firstUpcoming
        ? Math.round((firstUpcoming.date.getTime() - today.getTime()) / 86_400_000)
        : null;

    return (
        <div className="flex items-start gap-4 py-4 border-b border-dashed border-slate-100 last:border-0">
            {/* Date block — days to next milestone */}
            <div className="shrink-0 w-16 text-center">
                {todayMilestone ? (
                    <p className="text-xl font-bold leading-none text-brand-blue">Hôm nay</p>
                ) : daysToNext !== null ? (
                    <>
                        <p className="text-3xl font-bold leading-none text-slate-800">{daysToNext}</p>
                        <p className="text-sm text-slate-600 mt-0.5">ngày nữa</p>
                    </>
                ) : null}
            </div>

            {/* Divider */}
            <div className={`self-stretch w-px shrink-0 ${isToday ? 'bg-brand-blue' : 'bg-slate-100'}`}/>

            {/* Card image */}
            <div className="shrink-0 w-16 aspect-[16/10] bg-slate-50 rounded-sm overflow-hidden self-center">
                {catalogCard ? (
                    <img src={getCardImageUrl(catalogCard)} alt={catalogCard.name}
                         className="w-full h-full object-contain"/>
                ) : (
                    <div className="w-full h-full bg-slate-100 animate-pulse"/>
                )}
            </div>

            {/* Card info */}
            <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">
                    {walletCard.nickname ?? catalogCard?.name ?? '-'}
                </p>
                {walletCard.nickname && catalogCard?.name && (
                    <p className="text-sm text-slate-600 truncate">{catalogCard.name}</p>
                )}

                {/* Billing cycle timeline */}
                {timeline && (
                    <div className="mt-2">
                        <CardTimeline timeline={timeline}/>
                    </div>
                )}
            </div>
        </div>
    );
}
