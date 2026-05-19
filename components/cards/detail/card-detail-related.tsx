import type { Card } from '@/lib/api';
import { CardMasonry } from '@/components/cards/card-masonry';

interface Props {
    cards: Card[];
    currentCardId: string;
}

export function CardDetailRelated({ cards, currentCardId }: Props) {
    const related = cards.filter((c) => c.id !== currentCardId);
    if (related.length === 0) return null;

    return (
        <div className="ow-card-detail-related mt-16">
            <h2 className="mb-8">Thẻ cùng ngân hàng</h2>
            <CardMasonry cards={related} />
        </div>
    );
}
