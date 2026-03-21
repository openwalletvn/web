import type { RelatedCard } from '@/lib/api';
import { CardTile } from '@/components/cards/variants/card-tile';

interface Props {
    currentCard: { id: string; name: string };
    compareCards: RelatedCard[];
}

export function CardDetailCompare({ currentCard, compareCards }: Props) {
    if (compareCards.length === 0) return null;

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
                So sánh thẻ {currentCard.name} với...
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {compareCards.map((card) => (
                    <CardTile
                        key={card.id}
                        card={card}
                        href={`/so-sanh${card.compare_path}`}
                        badge={`So sánh ${currentCard.name} với ${card.name}`}
                    />
                ))}
            </div>
        </div>
    );
}
