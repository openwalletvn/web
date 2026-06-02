import type {CardModel} from '@/lib/card-model';
import { CardDisplay } from '@/components/cards/variants/card-display';

interface Props {
    poolCards: CardModel[];
    excludeIds?: Set<string>;
    excludeRanked?: boolean;
}

export function PersonaPoolCards({ poolCards, excludeIds, excludeRanked = true }: Props) {
    const cards = excludeRanked && excludeIds
        ? poolCards.filter((c) => !excludeIds.has(c.getId()))
        : poolCards;

    if (cards.length === 0) return null;

    return (
        <section className="ow-persona-pool-cards py-8">
            <h2 className="mb-6 heading-3">Thẻ khác trong danh mục ({cards.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {cards.map((card) => (
                    <CardDisplay key={card.getId()} variant="tile" card={card} />
                ))}
            </div>
        </section>
    );
}
