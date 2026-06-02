import * as React from 'react';

type PeriodKey = 'year' | 'month' | 'period' | 'statementperiod';

const PERIOD_LABELS: Record<PeriodKey, string> = {
    year: 'năm',
    month: 'tháng',
    period: 'kỳ',
    statementperiod: 'kỳ sao kê',
};

function resolvePeriod(period: PeriodKey | string | null | undefined): string | null {
    if (!period) return null;
    return PERIOD_LABELS[period as PeriodKey] ?? period;
}

interface Props {
    amount: number;
    type?: 'currency' | 'rate';
    period?: PeriodKey | string | null;
    compact?: boolean;
    textOnly?: boolean;
}

function formatAmount(amount: number, type: 'currency' | 'rate', compact: boolean): { value: string; unit: string | null } {
    if (amount === 0) return {value: 'Miễn phí', unit: null};
    if (type === 'rate') return {value: amount.toFixed(2), unit: '%'};
    if (!compact) return {value: amount.toLocaleString('vi-VN'), unit: 'đ'};
    if (amount >= 1_000_000 && amount % 1_000_000 === 0) return {value: `${amount / 1_000_000}tr`, unit: null};
    if (amount >= 1_000_000) return {value: `${(amount / 1_000_000).toFixed(1).replace('.0', '')}tr`, unit: null};
    if (amount >= 1_000 && amount % 1_000 === 0) return {value: `${amount / 1_000}k`, unit: null};
    return {value: amount.toLocaleString('vi-VN'), unit: 'đ'};
}

export function OwFeeAmount({amount, type = 'currency', period, compact = false, textOnly = false}: Props) {
    const {value, unit} = formatAmount(amount, type, compact);
    const resolvedPeriod = resolvePeriod(period);

    if (amount === 0) {
        return <span className={textOnly ? 'ow-fee-amount' : 'ow-fee-amount text-body-md text-slate-800'}>{value}</span>;
    }

    return (
        <span className={textOnly ? 'ow-fee-amount' : 'ow-fee-amount text-body-md text-slate-800'}>
            {value}
            {unit && <span className={textOnly ? undefined : 'text-slate-500'}>{unit}</span>}
            {type !== 'rate' && resolvedPeriod && <span className={textOnly ? undefined : 'text-xs text-slate-400'}>/{resolvedPeriod}</span>}
        </span>
    );
}
