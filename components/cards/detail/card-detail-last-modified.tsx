import type {Bank} from '@/lib/api';
import type {CardModel} from '@/lib/card-model';
import {fmtIsoDateLong} from '@/lib/utils';

interface Props {
    card: CardModel;
    bank: Bank | null;
}

export function CardDetailLastModified({ card }: Props) {
    const lastModified = card.getLastModified();
    if (!lastModified) return null;

    const formatted = fmtIsoDateLong(lastModified);

    return (
        <p className="ow-card-detail-last-modified text-xs text-slate-600">Cập nhật lần cuối: {formatted}</p>
    );
}
