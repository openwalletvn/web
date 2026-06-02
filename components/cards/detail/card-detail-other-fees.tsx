import type {Bank, FeeEntry} from '@/lib/api';
import type {CardModel} from '@/lib/card-model';
import {OwAmount} from '@/components/ow-ui/ow-amount';

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

function FeeValue({entry}: { entry?: FeeEntry | null }) {
    if (!entry) return <span className="ow-amount text-body-md text-slate-400">—</span>;
    if (entry.amount === 0) return <span className="ow-amount text-body-md text-green-600">Miễn phí</span>;
    return <OwAmount amount={entry.amount} unit={entry.type === 'currency' ? 'vnd' : 'percent'}/>;
}

function FeeBox({
    label,
    entry,
}: {
    label: string;
    entry?: FeeEntry | null;
}) {
    return (
        <div className="border border-slate-200 rounded-lg px-4 py-4 flex flex-col items-center text-center gap-1">
            <FeeValue entry={entry}/>
            <p className="text-xs text-slate-700 mt-0.5">{label}</p>
            {entry?.note && <NoteLines note={entry.note} />}
            {!entry && (
                <p className="text-xs text-slate-600 mt-0.5">Chưa có thông tin</p>
            )}
        </div>
    );
}

interface Props {
    card: CardModel;
    bank: Bank | null;
}

export function CardDetailOtherFees({ card }: Props) {
    const fees = card.getFees();
    if (!fees) return null;

    return (
        <div className="ow-card-detail-other-fees grid grid-cols-2 sm:grid-cols-4 gap-3">
            <FeeBox
                label="Thẻ phụ · Phí thường niên"
                entry={fees.annual_supplementary}
            />
            <FeeBox
                label="Phí hủy thẻ"
                entry={fees.cancellation}
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
