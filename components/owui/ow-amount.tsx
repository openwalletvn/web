import * as React from 'react';
import {cn} from "@/lib/utils";

type PeriodKey = 'year' | 'month' | 'period' |'day'| 'statementperiod';

const PERIOD_LABELS: Record<PeriodKey, string> = {
    year: 'năm',
    month: 'tháng',
    period: 'kỳ',
    day: 'ngày',
    statementperiod: 'kỳ sao kê',
};

function resolvePeriod(period: PeriodKey | string | null | undefined): string | null {
    if (!period) return null;
    return PERIOD_LABELS[period as PeriodKey] ?? period;
}

type UnitKey = 'vnd' | 'k' | 'percent';

interface Props {
    amount?: number;
    unit?: UnitKey;
    period?: PeriodKey | string | null;
    textOnly?: boolean;
    large?: boolean;
    medium?: boolean;
    zeroLabel?: string;
    null?: boolean;
    nullLabel?: string;
}

function formatAmount(amount: number, unit: UnitKey | undefined): { value: string; suffix: string | null } {
    if (unit === 'percent') return {value: amount.toFixed(2), suffix: '%'};
    if (unit === 'k') {
        if (amount >= 1_000_000 && amount % 1_000_000 === 0) return {value: `${amount / 1_000_000}tr`, suffix: null};
        if (amount >= 1_000_000) return {value: `${(amount / 1_000_000).toFixed(1).replace('.0', '')}tr`, suffix: null};
        if (amount >= 1_000 && amount % 1_000 === 0) return {value: `${amount / 1_000}k`, suffix: null};
        return {value: amount.toLocaleString('vi-VN'), suffix: null};
    }
    if (unit === 'vnd') return {value: amount.toLocaleString('vi-VN'), suffix: 'đ'};
    return {value: amount.toLocaleString('vi-VN'), suffix: null};
}

export function formatOwAmount(amount: number | undefined, unit?: UnitKey, period?: PeriodKey | string | null, zeroLabel?: string): string {
    if (amount === undefined) return 'n/a';
    if (amount === 0 && (unit === 'vnd' || unit === 'k')) return zeroLabel ?? 'Miễn phí';
    const {value, suffix} = formatAmount(amount, unit);
    const resolvedPeriod = resolvePeriod(period);
    return `${value}${suffix ?? ''}${resolvedPeriod ? `/${resolvedPeriod}` : ''}`;
}


export function OwAmount({
                             amount,
                             unit,
                             period,
                             textOnly = false,
                             large = false,
                             medium = false,
                             zeroLabel,
                             null: isNull,
                             nullLabel = '~'
                         }: Props) {
    const showNull = isNull || amount === undefined;
    const className = cn("ow-amount", large && "sm:heading-2 heading-4", medium && "sm:heading-5 heading-4");

    if (!showNull && amount === 0 && (unit === 'vnd' || unit === 'k')) {
        return <span className={className}>{zeroLabel ?? 'Miễn phí'}</span>;
    }

    const {value, suffix} = showNull
        ? {value: nullLabel, suffix: unit === 'percent' ? '%' : unit === 'vnd' ? 'đ' : null}
        : formatAmount(amount!, unit);
    const resolvedPeriod = resolvePeriod(period);

    return (
        <span className={className}>
            {value}
            {suffix && <span className={textOnly ? undefined : 'opacity-70'}>{suffix}</span>}
            {unit !== 'percent' && resolvedPeriod &&
                <span className={textOnly ? undefined : 'text-xs opacity-70'}>/{resolvedPeriod}</span>}
        </span>
    );
}
