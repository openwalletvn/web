import type { Card } from '@/lib/api';
import { CardItem } from '@/app/(marketing)/_components/card-item';

// ─── Tuning knobs ────────────────────────────────────────────────────────────
const CARDS_BELOW = 3;              // cards with fee <= current card's fee
const CARDS_ABOVE = 3;              // cards with fee >  current card's fee
const MAX_FEE_RATIO = 0.5;          // strict pass: allow up to 50% above current fee
const MAX_PER_BANK_PRIMARY = 1;     // strict pass: 1 card per bank
const MAX_PER_BANK_FALLBACK = 2;    // relaxed pass: 2 cards per bank
// ─────────────────────────────────────────────────────────────────────────────

function annualFee(card: Card): number {
    return card.fees?.annual?.amount ?? 0;
}

function byScore(cards: Card[]): Card[] {
    return [...cards].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

function pickPerBank(cards: Card[], maxPerBank: number): Card[] {
    const countByBank = new Map<string, number>();
    const result: Card[] = [];
    for (const card of cards) {
        const count = countByBank.get(card.bank_id) ?? 0;
        if (count < maxPerBank) {
            result.push(card);
            countByBank.set(card.bank_id, count + 1);
        }
    }
    return result;
}

/**
 * From a pre-filtered pool, pick up to CARDS_BELOW cards with fee <= currentFee
 * and up to CARDS_ABOVE cards with fee > currentFee, closest fee to current first.
 */
function pick3Below3Above(pool: Card[], currentFee: number, maxPerBank: number): Card[] {
    const closestCheaper = [...pool]
        .filter((c) => annualFee(c) <= currentFee)
        .sort((a, b) => annualFee(b) - annualFee(a)); // desc → closest to current fee first

    const closestPricier = [...pool]
        .filter((c) => annualFee(c) > currentFee)
        .sort((a, b) => annualFee(a) - annualFee(b)); // asc → closest to current fee first

    const below = pickPerBank(closestCheaper, maxPerBank).slice(0, CARDS_BELOW);
    const above = pickPerBank(closestPricier, maxPerBank).slice(0, CARDS_ABOVE);

    return [...below, ...above];
}

function filterCompareCards(candidates: Card[], currentCard: Card): Card[] {
    const currentFee = annualFee(currentCard);
    const maxAllowedFee = currentFee * (1 + MAX_FEE_RATIO);

    // Pass 1 — strict: fee cap + 1 card per bank
    const withinFeeCap = candidates.filter((c) => annualFee(c) <= maxAllowedFee);
    const strictResult = pick3Below3Above(withinFeeCap, currentFee, MAX_PER_BANK_PRIMARY);

    if (strictResult.length >= CARDS_BELOW + CARDS_ABOVE) return byScore(strictResult);

    // Pass 2 — relaxed: no fee cap, 2 cards per bank
    const relaxedResult = pick3Below3Above(candidates, currentFee, MAX_PER_BANK_FALLBACK);
    return byScore(relaxedResult);
}

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
    currentCard: Card;
    compareCards: Card[];
    compareLinks: Record<string, string>;
}

export function CardDetailCompare({ currentCard, compareCards, compareLinks }: Props) {
    const cards = filterCompareCards(compareCards, currentCard);

    if (cards.length === 0) return null;

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
                So sánh thẻ {currentCard.name} với...
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {cards.map((card) => (
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
