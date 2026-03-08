import React from 'react';
import {type Bank, type Card, getCardImageUrl} from '@/lib/api';
import type {WalletCard} from '@/lib/db';
import {cn} from '@/lib/utils';
import {type Milestone, resolveStatementDay, StatementCalendar} from '@/lib/card-dates';

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

// ─── Timeline rendering ────────────────────────────────────────────────────────

type TNode =
    | { kind: 'milestone'; data: Milestone }
    | { kind: 'today' };

/** Inserts a today marker between the last past and first upcoming milestone. */
function buildTimelineNodes(milestones: Milestone[], today: Date): TNode[] {
    const nodes: TNode[] = [];
    let todayInserted = false;
    for (const m of milestones) {
        if (!todayInserted && m.date > today) {
            nodes.push({kind: 'today'});
            todayInserted = true;
        }
        nodes.push({kind: 'milestone', data: m});
    }
    if (!todayInserted) {
        nodes.push({kind: 'today'});
    }
    return nodes;
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

    // Build StatementCalendar for non-custom cards
    const statementDay = resolveStatementDay(walletCard.statementDate, catalogCard?.statement_date);
    const cal = (walletCard.paymentDueDateSource !== 'custom'
        && statementDay != null
        && catalogCard?.interest_free_days != null)
        ? new StatementCalendar(statementDay, catalogCard.interest_free_days)
        : null;

    const milestones: Milestone[] = cal?.getTimeline(today) ?? [];
    console.log(catalogCard?.name,milestones)
    const timelineNodes = buildTimelineNodes(milestones, today);

    // Summary line: first upcoming milestone drives the label
    const firstUpcoming = milestones.find((m) => m.isUpcoming) ?? null;
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
                {timelineNodes.length > 0 && (
                    <div className="mt-2 overflow-x-auto">
                        <div className="flex items-start">
                            {timelineNodes.map((node, i) => {
                                const isThisToday = node.kind === 'today';
                                const isThisPast = node.kind === 'milestone' && node.data.isPast;
                                const isThisUpcoming = node.kind === 'milestone' && node.data.isUpcoming;
                                const nodeDate = node.kind === 'today' ? today : node.data.date;

                                // Line connecting this node to the previous one
                                const prevNode = i > 0 ? timelineNodes[i - 1] : null;
                                const lineIsPast = prevNode?.kind === 'milestone' && prevNode.data.isPast;

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
                                                {formatDM(nodeDate)}
                                            </p>

                                            {/* Type label */}
                                            <p className={cn(
                                                'text-[10px] leading-tight',
                                                isThisToday ? 'text-brand-blue font-semibold' :
                                                    isThisPast ? 'text-slate-400' : 'text-slate-600',
                                            )}>
                                                {isThisToday ? 'Hôm nay' :
                                                    node.data.type === 'closeDate' ? 'Sao kê' : 'Hạn TT'}
                                            </p>

                                            {/* Cycle label */}
                                            {node.kind === 'milestone' && (
                                                <p className="text-[9px] text-slate-400 leading-tight mt-0.5">
                                                    {`kỳ ${formatDM(node.data.cycle.from)}`}
                                                    <br/>
                                                    {`-${formatDM(node.data.cycle.to)}`}
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
                        firstUpcoming.type === 'dueDate' ? 'text-amber-600' : 'text-slate-500',
                    )}>
                        {firstUpcoming.type === 'closeDate'
                            ? `📅 Kỳ sao kê tiếp theo: ${formatDM(firstUpcoming.date)} (còn ${daysToNext} ngày)`
                            : `⚠ Hạn thanh toán tiếp theo: ${formatDM(firstUpcoming.date)} (còn ${daysToNext} ngày)`
                        }
                    </p>
                )}
            </div>
        </div>
    );
}
