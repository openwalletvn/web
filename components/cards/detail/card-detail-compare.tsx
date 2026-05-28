import type { RelatedCard } from '@/lib/api';
import { CardTile } from '@/components/cards/variants/card-tile';
import { getTool } from '@/lib/tools';

const MAX_CARDS = 12;
const cardBattleHref = getTool('Card Battle').href;

interface Props {
    currentCard: { id: string; name: string };
    compareCards: RelatedCard[];
}

export function CardDetailCompare({ currentCard, compareCards }: Props) {
    const cards = compareCards.slice(0, MAX_CARDS);
    if (cards.length === 0) return null;

    return (
        <div className="ow-card-detail-compare mt-16">
            <h2 className="mb-2">
                Các thẻ liên quan đến {currentCard.name}
            </h2>
            <p className="text-slate-500 mb-8">
                Được gợi ý bởi thuật toán OpenWallet dựa trên mức độ tương đồng về tính năng, loại thẻ và cashback.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 sm:gap-6 gap-4">
                {cards.map((card) => (
                    <CardTile
                        key={card.id}
                        card={card}
                        href={`/the/${card.id}`}
                        // href={`${cardBattleHref}${card.compare_path}`}
                        badge={`So sánh ${currentCard.name} với ${card.name}`}
                    />
                ))}
            </div>
        </div>
    );
}
