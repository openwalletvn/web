import { cn } from '@/lib/utils';
import { formatFeeParts } from '@/lib/utils';
import type { FeeEntry } from '@/lib/api';

interface Props {
    entry: FeeEntry | null | undefined;
    fallback?: string;
    className?: string;
}

export function FeeDisplay({ entry, fallback = 'Miễn phí', className }: Props) {
    if (!entry) return <span className={cn('text-numeral text-slate-500', className)}>—</span>;

    const { value, unit } = formatFeeParts(entry);

    if (!unit) {
        return <span className={cn('text-numeral text-green-600', className)}>{value}</span>;
    }

    return (
        <span className={cn('text-numeral', className)}>
            {value}<span className="text-body-sm ml-0.5">{unit}</span>
        </span>
    );
}
