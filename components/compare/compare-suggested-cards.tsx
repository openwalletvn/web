import type { Card } from '@/lib/api';
import { CardTile } from '@/components/cards/variants/card-tile';

interface Props {
    cards: Card[];
    /** Tailwind grid-cols class — defaults to match CardDetailCompare */
    gridClassName?: string;
}

export function CompareSuggestedCards({
    cards,
    gridClassName = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
}: Props) {
    if (cards.length === 0) return null;

    return (
        <div className="mt-16 pt-10 border-t border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Có thể bạn muốn xem</h2>
            <div className={`grid ${gridClassName} gap-6`}>
                {cards.map((card) => (
                    <CardTile key={card.id} card={card} />
                ))}
            </div>
        </div>
    );
}
