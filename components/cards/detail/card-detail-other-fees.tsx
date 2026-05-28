import type { Card, Bank, FeeEntry } from '@/lib/api';
import { formatFee, cn } from '@/lib/utils';

function NoteLines({ note }: { note: string }) {
    const lines = note.split('|').map((l) => l.trim()).filter(Boolean);
    return (
        <ul className="space-y-0.5 mt-1">
            {lines.map((line, i) => (
                <li key={i} className="text-xs text-slate-600 leading-snug">{line}</li>
            ))}
        </ul>
    );
}

function FeeBox({
    label,
    entry,
    red,
}: {
    label: string;
    entry?: FeeEntry | null;
    red?: boolean;
}) {
    const free = entry && entry.amount === 0;
    return (
        <div className="border border-slate-200 rounded-xl px-4 py-4 flex flex-col items-center text-center gap-1">
            {entry ? (
                <p className={cn('text-2xl font-bold leading-tight', free ? 'text-green-600' : red ? 'text-brand-red' : 'text-slate-900')}>
                    {formatFee(entry)}
                </p>
            ) : (
                <p className="text-lg font-medium text-slate-500">—</p>
            )}
            <p className="text-xs text-slate-700 mt-0.5">{label}</p>
            {entry?.note && <NoteLines note={entry.note} />}
            {!entry && (
                <p className="text-xs text-slate-600 mt-0.5">Chưa có thông tin</p>
            )}
        </div>
    );
}

interface Props {
    card: Card;
    bank: Bank | null;
}

export function CardDetailOtherFees({ card }: Props) {
    if (!card.fees) return null;
    const { fees } = card;

    return (
        <div className="ow-card-detail-other-fees grid grid-cols-2 sm:grid-cols-4 gap-3">
            <FeeBox
                label="Thẻ phụ · Phí thường niên"
                entry={fees.annual_supplementary}
            />
            <FeeBox
                label="Phí hủy thẻ"
                entry={fees.cancellation}
                red
            />
            <FeeBox
                label="Ngoại tệ"
                entry={fees.foreign}
            />
            <FeeBox
                label="Ngoại tệ bằng VND"
                entry={fees.foreign_dcc}
            />
        </div>
    );
}
