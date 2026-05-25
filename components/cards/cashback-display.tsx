import type {Card} from '@/lib/api';
import type {RankedCard} from '@/lib/card-ranker';

export function getRateDisplay(card: Card, intentSlug?: string): string {
    const rules = card.cashback?.rules ?? [];
    const matched = intentSlug
        ? rules.filter(r => r.categories?.includes(intentSlug) || r.merchants?.includes(intentSlug))
        : [];
    const relevant = matched.length > 0
        ? matched
        : rules.filter(r => !r.categories?.length && !r.merchants?.length);
    if (!relevant.length) return '';
    const rates = relevant.flatMap(r => [r.rate, ...(r.rate_max != null ? [r.rate_max] : [])]);
    const min = Math.min(...rates) * 100;
    const max = Math.max(...rates) * 100;
    const fmt = (n: number) => Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.?0+$/, '');
    return min === max ? `${fmt(min)}%` : `${fmt(min)}%–${fmt(max)}%`;
}

export function CashbackDisplay({ranked, intentSlug}: {ranked: RankedCard; intentSlug?: string}) {
    const {cashback, actual_rate, optimal_spend} = ranked.cashback_result;

    if (cashback === 0) {
        return (
            <div className="ow-cashback-display flex flex-col items-start sm:items-end gap-0.5">
                <span className="text-body-sm text-text-muted">Chưa có ưu đãi</span>
            </div>
        );
    }

    const rateDisplay = getRateDisplay(ranked.card, intentSlug) || `${actual_rate}%`;

    return (
        <div className="ow-cashback-display flex flex-col items-start sm:items-end gap-0.5">
            <span className="text-body-lg font-semibold text-primary">
                +{cashback.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-body-sm text-text-muted">
                Hoàn {rateDisplay}/kỳ
            </span>
            {optimal_spend > 0 && (
                <span className="text-body-sm text-text-muted">
                    Tối đa từ {optimal_spend.toLocaleString('vi-VN')}đ
                </span>
            )}
        </div>
    );
}
