import * as React from 'react';
import {cn} from '@/lib/utils';

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
    amount: number;
    unit?: UnitKey;
    period?: PeriodKey | string | null;
    textOnly?: boolean;
    large?: boolean;
    medium?: boolean;
    zeroLabel?: string;
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

export function formatOwAmount(amount: number, unit?: UnitKey, period?: PeriodKey | string | null, zeroLabel?: string): string {
    if (amount === 0 && (unit === 'vnd' || unit === 'k')) return zeroLabel ?? 'Miễn phí';
    const {value, suffix} = formatAmount(amount, unit);
    const resolvedPeriod = resolvePeriod(period);
    return `${value}${suffix ?? ''}${resolvedPeriod ? `/${resolvedPeriod}` : ''}`;
}

function resolveClassName(textOnly: boolean, large: boolean, medium: boolean): string {
    if (textOnly) return 'ow-amount';
    if (large) return 'ow-amount sm:heading-2 heading-4';
    if (medium) return 'ow-amount heading-5';
    return 'ow-amount text-body-md text-slate-800';
}

export function OwAmount({amount, unit, period, textOnly = false, large = false, medium = false, zeroLabel}: Props) {
    if (amount === 0 && (unit === 'vnd' || unit === 'k')) {
        const label = zeroLabel ?? 'Miễn phí';
        return <span className={resolveClassName(textOnly, large, medium)}>{label}</span>;
    }
    const {value, suffix} = formatAmount(amount, unit);
    const resolvedPeriod = resolvePeriod(period);
    const className = resolveClassName(textOnly, large, medium);

    return (
        <span className={className}>
            {value}
            {suffix && <span className={textOnly ? undefined : 'opacity-70'}>{suffix}</span>}
            {unit !== 'percent' && resolvedPeriod &&
                <span className={textOnly ? undefined : 'text-xs opacity-70'}>/{resolvedPeriod}</span>}
        </span>
    );
}
