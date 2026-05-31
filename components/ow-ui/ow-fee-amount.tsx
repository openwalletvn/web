import * as React from 'react';

interface Props {
    amount: number;
    period?: 'năm' | 'tháng' | 'kỳ' | string;
    compact?: boolean;
}

function formatAmount(amount: number, compact: boolean): { value: string; unit: string | null } {
    if (amount === 0) return {value: 'Miễn phí', unit: null};
    if (!compact) return {value: amount.toLocaleString('vi-VN'), unit: 'đ'};
    if (amount >= 1_000_000 && amount % 1_000_000 === 0) return {value: `${amount / 1_000_000}tr`, unit: null};
    if (amount >= 1_000_000) return {value: `${(amount / 1_000_000).toFixed(1).replace('.0', '')}tr`, unit: null};
    if (amount >= 1_000 && amount % 1_000 === 0) return {value: `${amount / 1_000}k`, unit: null};
    return {value: amount.toLocaleString('vi-VN'), unit: 'đ'};
}

export function OwFeeAmount({amount, period = 'năm', compact = false}: Props) {
    const {value, unit} = formatAmount(amount, compact);

    if (amount === 0) {
        return <span className="ow-fee-amount text-body-md text-slate-800">{value}</span>;
    }

    return (
        <span className="ow-fee-amount text-body-md text-slate-800">
            {value}
            {unit && <span className="text-slate-500">{unit}</span>}
            {period && <span className="text-xs text-slate-400">/{period}</span>}
        </span>
    );
}
