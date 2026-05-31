import * as React from 'react';
import type {FeeEntry} from '@/lib/api';
import {formatFeeParts, formatFeePartsCompact} from '@/lib/utils';

interface Props {
    fee: FeeEntry;
    period?: 'năm' | 'tháng' | null;
    compact?: boolean;
}

export function OwFeeAmount({fee, period = 'năm', compact = false}: Props) {
    const {value, unit} = compact ? formatFeePartsCompact(fee) : formatFeeParts(fee);

    if (fee.amount === 0) {
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
