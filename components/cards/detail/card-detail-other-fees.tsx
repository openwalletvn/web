import type {Bank, FeeEntry} from '@/lib/api';
import {BankModel} from '@/lib/bank-model';
import type {CardModel} from '@/lib/card-model';
import {OwAmount} from '@/components/ow-ui/ow-amount';
import {OwWobbleCard} from '@/components/ow-ui/ow-wobble-card';

function NoteLines({ note }: { note: string }) {
    const lines = note.split('|').map((l) => l.trim()).filter(Boolean);
    return (
        <ul className="space-y-0.5 mt-1">
            {lines.map((line, i) => (
                <li key={i} className="text-xs text-white/70 leading-snug">{line}</li>
            ))}
        </ul>
    );
}

function FeeBox({
    label,
    entry,
                    brandColor,
}: {
    label: string | React.ReactNode;
    entry?: FeeEntry | null;
    brandColor?: string;
}) {
    return (
        <OwWobbleCard brandColor={brandColor} className="min-h-[100px] text-white flex flex-col text-center gap-1">
            {entry && <OwAmount medium amount={entry.amount} unit={entry.type === 'currency' ? 'vnd' : 'percent'}/>}
            {!entry && <OwAmount null medium/>}
            <p className="text-label text-white mt-0.5">{label}</p>
            {entry?.note && <NoteLines note={entry.note} />}
        </OwWobbleCard>
    );
}

interface Props {
    card: CardModel;
    bank: Bank | null;
}

export function CardDetailOtherFees({card, bank: bankRaw}: Props) {
    const fees = card.getFees();
    if (!fees) return null;

    const brandColor = bankRaw ? new BankModel(bankRaw).getBrandColor() : undefined;

    return (
        <div className="ow-card-detail-other-fees grid grid-cols-2 lg:grid-cols-4 sm:gap-3 gap-2">
            <FeeBox
                label={<span>
                    <span className="inline-block">Phí thường niên </span>
                    <span className="inline-block ml-1">thẻ phụ</span>
                </span>}
                entry={fees.annual_supplementary}
                brandColor={brandColor}
            />
            <FeeBox
                label="Phí hủy thẻ"
                entry={fees.cancellation}
                brandColor={brandColor}
            />
            <FeeBox
                label="Ngoại tệ"
                entry={fees.foreign}
                brandColor={brandColor}
            />
            <FeeBox
                label="Ngoại tệ bằng VND"
                entry={fees.foreign_dcc}
                brandColor={brandColor}
            />
        </div>
    );
}
