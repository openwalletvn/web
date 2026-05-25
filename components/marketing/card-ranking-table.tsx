'use client';

import {useState, useEffect} from 'react';
import type {RankedCard} from '@/lib/card-ranker';
import {RankedRow} from '@/components/cards/ranked-row';
import {IconInfoCircle} from '@tabler/icons-react';

interface Props {
    initialRanked: RankedCard[];
    intentSlug: string;
    title?: string;
}

export function CardRankingTable({initialRanked, intentSlug, title}: Props) {
    const [ranked] = useState<RankedCard[]>(initialRanked);

    const withCashback = ranked.filter(r => r.cashback_result.max_cashback > 0);
    const noCashback = ranked.filter(r => r.cashback_result.max_cashback === 0);

    const tiebreakerDelta = new Map<string, number>();
    let gi = 0;
    while (gi < withCashback.length) {
        let gj = gi;
        while (gj < withCashback.length && withCashback[gj].cashback_result.max_cashback === withCashback[gi].cashback_result.max_cashback) gj++;
        if (gj - gi > 1) {
            const naturalRank = withCashback[gi].rank;
            const groupSize = gj - gi;
            tiebreakerDelta.set(withCashback[gi].card.id, groupSize - 1);
            for (let k = gi + 1; k < gj; k++) {
                tiebreakerDelta.set(withCashback[k].card.id, naturalRank - withCashback[k].rank);
            }
        }
        gi = gj;
    }

    return (
        <section className="ow-card-ranking-table">
            {title && (
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                    <h2 className="mb-0 text-card-heading">{title}</h2>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {withCashback.map(r => (
                    <RankedRow
                        key={r.card.id}
                        ranked={r}
                        tiebreakerReason={r.rank_reason_type === 'lower_annual_fee' || r.rank_reason_type === 'better_network' || r.rank_reason_type === 'no_min_spend' ? r.rank_reason : undefined}
                        tiebreakerDelta={tiebreakerDelta.get(r.card.id)}
                        viewTransitionName={`card-row-${r.card.id}`}
                        intentSlug={intentSlug}
                    />
                ))}

                {noCashback.length > 0 && (
                    <>
                        <p className="text-body-sm text-text-muted mt-2 mb-1">Các thẻ khác trong nhóm</p>
                        {noCashback.map(r => (
                            <RankedRow
                                key={r.card.id}
                                ranked={r}
                                muted
                                viewTransitionName={`card-row-${r.card.id}`}
                                intentSlug={intentSlug}
                            />
                        ))}
                    </>
                )}
            </div>

            <p className="flex items-center gap-1.5 text-body-sm text-text-muted mt-4">
                <IconInfoCircle size={14} className="shrink-0"/>
                Xếp hạng theo hoàn tiền ước tính · cùng hoàn tiền thì ưu tiên phí thường niên thấp hơn, sau đó Visa/Mastercard.
            </p>
        </section>
    );
}
