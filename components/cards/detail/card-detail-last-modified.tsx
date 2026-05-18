import type { Card, Bank } from '@/lib/api';

interface Props {
    card: Card;
    bank: Bank | null;
}

export function CardDetailLastModified({ card }: Props) {
    if (!card.last_modified) return null;

    const formatted = new Date(card.last_modified).toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <p className="ow-card-detail-last-modified text-xs text-slate-600">Cập nhật lần cuối: {formatted}</p>
    );
}
