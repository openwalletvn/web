import React from 'react';
import {type Bank, type Card, getCardImageUrl} from '@/lib/api';
import type {WalletCard} from '@/lib/db';
import {cn} from '@/lib/utils';
import {type Milestone, resolveStatementDay, getTimelineForCard} from '@/lib/card-dates';

export const MONTH_VI = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

/** Formats a date as "D/M" (e.g. "20/2", "6/3"). */
function formatDM(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}`;
}

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

// ─── Milestone type labels ─────────────────────────────────────────────────────

function milestoneLabel(m: Milestone): string {
    if (m.type === 'today')  return 'Hôm nay';
    if (m.type === 'close')  return 'Sao kê';
    if (m.type === 'due')    return 'Hạn TT';
    return 'Mở kỳ';
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
    const daysUntil = Math.round((date.getTime() - today.getTime()) / 86_400_000);
    const isPast = variant === 'past';
    const isToday = variant === 'today';

    // Build timeline for non-custom cards
    const statementDay = resolveStatementDay(walletCard.statementDate, catalogCard?.statement_date);
    const displayMilestones: Milestone[] = (
        walletCard.paymentDueDateSource !== 'custom'
        && statementDay != null
        && catalogCard?.interest_free_days != null
    )
        ? getTimelineForCard(statementDay, catalogCard.interest_free_days, today)
        : [];

    // Summary line: first upcoming milestone drives the label
    const firstUpcoming = displayMilestones.find((m) => m.isUpcoming) ?? null;
    const daysToNext = firstUpcoming
        ? Math.round((firstUpcoming.date.getTime() - today.getTime()) / 86_400_000)
        : null;

    return (
        <div className="flex items-start gap-4 py-4 border-b border-dashed border-slate-100 last:border-0">
            {/* Date block — payment due date */}
            <div className="shrink-0 w-12 text-center">
                <p className={`text-3xl font-bold leading-none ${isPast ? 'text-slate-400' : isToday ? 'text-brand-blue' : 'text-slate-800'}`}>
                    {date.getDate()}
                </p>
                <p className="text-sm text-slate-600 mt-0.5">{MONTH_VI[date.getMonth()]}</p>
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

                {/* Horizontal timeline */}
                {displayMilestones.length > 0 && (
                    <div className="mt-2 overflow-x-auto">
                        <div className="flex items-start">
                            {displayMilestones.map((m, i) => {
                                const isThisToday    = m.type === 'today';
                                const isThisPast     = m.isPast;
                                const isThisUpcoming = m.isUpcoming;

                                // Line connecting this node to the previous one
                                const prevMs = i > 0 ? displayMilestones[i - 1] : null;
                                const lineIsPast = prevMs?.isPast === true;

                                return (
                                    <React.Fragment key={i}>
                                        {i > 0 && (
                                            <div className={cn(
                                                'h-px w-6 shrink-0 mt-2',
                                                lineIsPast ? 'bg-slate-200' : 'bg-brand-blue/30',
                                            )}/>
                                        )}
                                        <div className="flex flex-col items-center text-center w-[52px] shrink-0">
                                            {/* Dot */}
                                            <div className={cn(
                                                'w-4 h-4 rounded-full shrink-0',
                                                isThisToday ? 'bg-brand-blue ring-2 ring-brand-blue/20' :
                                                    isThisPast ? 'bg-slate-200' :
                                                        'border-2 border-brand-blue bg-white',
                                            )}/>

                                            {/* Date */}
                                            <p className={cn(
                                                'text-[10px] font-medium mt-0.5 leading-tight',
                                                isThisToday ? 'text-brand-blue' :
                                                    isThisPast ? 'text-slate-400' : 'text-slate-700',
                                            )}>
                                                {formatDM(m.date)}
                                            </p>

                                            {/* Type label */}
                                            <p className={cn(
                                                'text-[10px] leading-tight',
                                                isThisToday ? 'text-brand-blue font-semibold' :
                                                    isThisPast ? 'text-slate-400' : 'text-slate-600',
                                            )}>
                                                {milestoneLabel(m)}
                                            </p>

                                            {/* Cycle label */}
                                            {m.type !== 'today' && m.statement && (
                                                <p className="text-[9px] text-slate-400 leading-tight mt-0.5">
                                                    {`kỳ ${formatDM(m.statement.start)}`}
                                                    <br/>
                                                    {`-${formatDM(m.statement.close)}`}
                                                </p>
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Summary line */}
                {firstUpcoming && daysToNext !== null && (
                    <p className={cn(
                        'text-xs mt-1.5',
                        firstUpcoming.type === 'due' ? 'text-amber-600' : 'text-slate-500',
                    )}>
                        {firstUpcoming.type === 'close'
                            ? `📅 Kỳ sao kê tiếp theo: ${formatDM(firstUpcoming.date)} (còn ${daysToNext} ngày)`
                            : firstUpcoming.type === 'due'
                            ? `⚠ Hạn thanh toán tiếp theo: ${formatDM(firstUpcoming.date)} (còn ${daysToNext} ngày)`
                            : `📋 Kỳ mới bắt đầu: ${formatDM(firstUpcoming.date)} (còn ${daysToNext} ngày)`
                        }
                    </p>
                )}
            </div>
        </div>
    );
}
