'use client';

import {IconChevronLeft, IconChevronRight} from '@tabler/icons-react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {SPEND_OPTIONS} from '@/lib/spend-options';

interface SpendSelectorProps {
    spend: number;
    onChange: (v: number) => void;
}

export function SpendSelector({spend, onChange}: SpendSelectorProps) {
    const idx = SPEND_OPTIONS.findIndex(o => o.value === spend);
    const canDec = idx > 0;
    const canInc = idx < SPEND_OPTIONS.length - 1;

    return (
        <div className="ow-spend-selector flex items-center gap-1">
            <button
                onClick={() => canDec && onChange(SPEND_OPTIONS[idx - 1].value)}
                disabled={!canDec}
                className="p-1 rounded hover:bg-bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                aria-label="Giảm chi tiêu"
            >
                <IconChevronLeft size={16}/>
            </button>
            <Select value={String(spend)} onValueChange={v => onChange(Number(v))}>
                <SelectTrigger className="w-40">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    {SPEND_OPTIONS.map(o => (
                        <SelectItem key={o.value} value={String(o.value)}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <button
                onClick={() => canInc && onChange(SPEND_OPTIONS[idx + 1].value)}
                disabled={!canInc}
                className="p-1 rounded hover:bg-bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                aria-label="Tăng chi tiêu"
            >
                <IconChevronRight size={16}/>
            </button>
        </div>
    );
}
