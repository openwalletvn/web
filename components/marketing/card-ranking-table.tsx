'use client';

import {useState, useCallback, useEffect, useRef} from 'react';
import type {RankedCard} from '@/lib/card-ranker';
import {getTiebreakerReason, DEFAULT_MONTHLY_SPEND} from '@/lib/card-ranker';
import {SpendSelector} from '@/components/cards/spend-selector';
import {RankedRow} from '@/components/cards/ranked-row';
import {IconInfoCircle} from '@tabler/icons-react';

function withViewTransition(fn: () => void) {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        (document as Document & {startViewTransition: (cb: () => void) => void}).startViewTransition(fn);
    } else {
        fn();
    }
}

interface Props {
    initialRanked: RankedCard[];
    intentSlug: string;
    monthlySpend?: number;
    title?: string;
}

export function CardRankingTable({initialRanked, intentSlug, monthlySpend = DEFAULT_MONTHLY_SPEND, title}: Props) {
    const [spend, setSpend] = useState(monthlySpend);
    const [ranked, setRanked] = useState<RankedCard[]>(initialRanked);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const changeSpend = useCallback((v: number) => withViewTransition(() => setSpend(v)), []);

    const isInitial = useRef(true);
    useEffect(() => {
        if (isInitial.current) {
            isInitial.current = false;
            return;
        }
        setLoading(true);
        const t = setTimeout(async () => {
            try {
                const res = await fetch('/api/ranking', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({spend: {[intentSlug]: spend}, limit: 50}),
                });
                const json = await res.json();
                if (json.data) withViewTransition(() => setRanked(json.data));
            } finally {
                setLoading(false);
            }
        }, 200);
        return () => clearTimeout(t);
    }, [spend, intentSlug]);

    const withCashback = ranked.filter(r => r.cashback_result.cashback > 0);
    const noCashback = ranked.filter(r => r.cashback_result.cashback === 0);

    const tiebreakerReasons = new Map<string, string>();
    const tiebreakerDelta = new Map<string, number>();

    let gi = 0;
    while (gi < withCashback.length) {
        let gj = gi;
        while (gj < withCashback.length && withCashback[gj].cashback_result.cashback === withCashback[gi].cashback_result.cashback) gj++;
        if (gj - gi > 1) {
            const naturalRank = withCashback[gi].rank;
            for (let k = gi; k < gj - 1; k++) {
                const reason = getTiebreakerReason(withCashback[k].card, withCashback[k + 1].card);
                if (reason) tiebreakerReasons.set(withCashback[k].card.id, reason);
            }
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
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                {title && <h2 className="mb-0 text-card-heading">{title}</h2>}
                {mounted && (
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-body-sm text-text-muted">Chi tiêu mỗi kỳ</span>
                        <SpendSelector spend={spend} onChange={changeSpend}/>
                    </div>
                )}
            </div>

            <div className={`flex flex-col gap-3 transition-opacity ${loading ? 'opacity-60' : ''}`}>
                {withCashback.map(ranked => (
                    <RankedRow
                        key={ranked.card.id}
                        ranked={ranked}
                        tiebreakerReason={tiebreakerReasons.get(ranked.card.id)}
                        tiebreakerDelta={tiebreakerDelta.get(ranked.card.id)}
                        viewTransitionName={`card-row-${ranked.card.id}`}
                        intentSlug={intentSlug}
                    />
                ))}

                {noCashback.length > 0 && (
                    <>
                        <p className="text-body-sm text-text-muted mt-2 mb-1">Các thẻ khác trong nhóm</p>
                        {noCashback.map(ranked => (
                            <RankedRow
                                key={ranked.card.id}
                                ranked={ranked}
                                muted
                                viewTransitionName={`card-row-${ranked.card.id}`}
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
