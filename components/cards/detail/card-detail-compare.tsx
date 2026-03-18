import type { Card } from '@/lib/api';
import { CardItem } from '@/app/(marketing)/_components/card-item';

interface Props {
    currentCard: Card;
    compareCards: Card[];
    compareLinks: Record<string, string>;
}

export function CardDetailCompare({ currentCard, compareCards, compareLinks }: Props) {
    const top6 = [...compareCards]
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, 6);

    if (top6.length === 0) return null;

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
                So sánh thẻ {currentCard.name} với...
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {top6.map((card) => (
                    <CardItem
                        key={card.id}
                        card={card}
                        href={compareLinks[card.id]}
                        badge={`So sánh ${currentCard.name} với ${card.name}`}
                    />
                ))}
            </div>
        </div>
    );
}
