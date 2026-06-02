import type {RelatedCard} from '@/lib/api';
// import {getTool} from '@/lib/tools';
import {CardMasonry} from "@/components/cards/card-masonry";

const MAX_CARDS = 6;

// const cardBattleHref = getTool('Card Battle').href;

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
            <CardMasonry cards={cards}/>
        </div>
    );
}
