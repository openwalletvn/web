import {IconArrowNarrowRightDashed, IconCircleCheckFilled, IconCircleDashed} from '@tabler/icons-react';
import {type Bank, type Card, getCardImageUrl} from '@/lib/api';
import type {WalletCard} from '@/lib/db';
import {cn} from "@/lib/utils";
import {getLastCloseDate, resolveStatementDay} from '@/lib/card-dates';

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
    const daysUntil = Math.ceil((date.getTime() - Date.now()) / 86_400_000);
    const dueLabel =
        variant === 'today' ? 'Hôm nay' :
            variant === 'past' ? (daysUntil === -1 ? 'Hôm qua' : `${Math.abs(daysUntil)} ngày trước`) :
                daysUntil === 1 ? 'Ngày mai' :
                    `${daysUntil} ngày nữa`;
    const isPast = variant === 'past';
    const isToday = variant === 'today';

    // Derive the statement close date directly from the billing cycle — avoids any
    // off-by-one from calcDueDate's +1 adjustment.
    const resolvedStatementDay = resolveStatementDay(walletCard.statementDate, catalogCard?.statement_date);
    const statementDate = (resolvedStatementDay != null && catalogCard?.interest_free_days != null)
        ? getLastCloseDate(walletCard.statementDate, catalogCard?.statement_date, catalogCard.interest_free_days)
        : null;
    const statementIsPast = statementDate ? statementDate.getTime() <= Date.now() : false;

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

                {/* Statement → due date flow */}
                {statementDate && (
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {/* Statement date */}
                        <div className={cn("flex items-center gap-1.5", statementIsPast ? "text-green-500" : "")}>
                            {resolvedStatementDay != null && (
                                <div className="relative group -translate-y-0.5">
                                    {statementIsPast
                                        ? <IconCircleCheckFilled size={16}/>
                                        : <IconCircleDashed size={16}/>
                                    }
                                    <div
                                        className="absolute left-0 bottom-full mb-1.5 w-60 px-2.5 py-1.5 bg-slate-800 text-white text-sm rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-snug">
                                        {walletCard.paymentDueDateSource === 'custom'
                                            ? 'Dựa trên ngày sao kê bạn đã tùy chỉnh'
                                            : `Dựa trên ngày sao kê mặc định của ${bank?.name ?? 'ngân hàng'}`}
                                    </div>
                                </div>
                            )}

                            <div className={cn("min-w-[150px]", "text-sm")}>
                                {statementIsPast ? 'Đã sao kê' : 'Sao kê tiếp theo'}:{' '}
                                <span className="font-medium">
                                    {statementDate.getDate()} {MONTH_VI[statementDate.getMonth()]}
                                </span>
                            </div>
                        </div>

                        {/* Arrow */}
                        <span className={`text-xs ${isPast ? 'text-slate-400' : 'text-slate-500'}`}>
                            <IconArrowNarrowRightDashed size={18}/>
                        </span>

                        {/* Payment due label */}
                        <span className={`text-sm font-medium ${
                            isPast ? 'text-slate-500' :
                                daysUntil === 0 ? 'text-brand-blue' :
                                    daysUntil <= 3 ? 'text-amber-500' :
                                        'text-slate-700'
                        }`}>
                            Hạn TT: {dueLabel}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
