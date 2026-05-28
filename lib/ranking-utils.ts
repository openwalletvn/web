import type {RankedCard} from '@/lib/card-ranker';

export function computeTiebreakerDeltas(withCashback: RankedCard[]): Map<string, number> {
    const delta = new Map<string, number>();
    let gi = 0;
    while (gi < withCashback.length) {
        let gj = gi;
        while (gj < withCashback.length && withCashback[gj].cashback_result.max_cashback === withCashback[gi].cashback_result.max_cashback) gj++;
        if (gj - gi > 1) {
            const naturalRank = withCashback[gi].rank;
            const groupSize = gj - gi;
            delta.set(withCashback[gi].card.id, groupSize - 1);
            for (let k = gi + 1; k < gj; k++) {
                delta.set(withCashback[k].card.id, naturalRank - withCashback[k].rank);
            }
        }
        gi = gj;
    }
    return delta;
}
