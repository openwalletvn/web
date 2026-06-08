import type {Card} from '@/lib/api';
import {getRankedCards} from '@/lib/api';
import {PersonaModel} from '@/lib/persona-model';

export async function getPersonaTopCards(limit = 12): Promise<Card[]> {
    const visibleSlugs = PersonaModel.all().map(p => p.getSlug());
    const results = await Promise.all(
        visibleSlugs.map(slug =>
            getRankedCards({persona: slug, intents: [], limit: 2}).catch(() => [])
        )
    );
    const seen = new Set<string>();
    const cards: Card[] = [];
    for (const ranked of results) {
        for (const {card} of ranked) {
            if (!seen.has(card.id)) {
                seen.add(card.id);
                cards.push(card);
                if (cards.length >= limit) return cards;
            }
        }
    }
    return cards;
}
