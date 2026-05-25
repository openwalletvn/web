import type {Card} from '@/lib/api';
import type {RankedCard, CashbackBreakdownItem} from '@/lib/card-ranker';

const CATCHALL_SLUGS = new Set(['all', 'all-online', 'all-offline']);

export function getRateDisplay(card: Card, intentSlug?: string): string {
    const rules = card.cashback?.rules ?? [];
    const matched = intentSlug
        ? rules.filter(r => r.categories?.includes(intentSlug) || r.merchants?.includes(intentSlug))
        : [];
    const relevant = matched.length > 0
        ? matched
        : rules.filter(r => r.categories?.some(c => CATCHALL_SLUGS.has(c)));
    if (!relevant.length) return '';
    const rates = relevant.flatMap(r => [r.rate, ...(r.rate_max != null ? [r.rate_max] : [])]);
    const min = Math.min(...rates) * 100;
    const max = Math.max(...rates) * 100;
    const fmt = (n: number) => Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.?0+$/, '');
    return min === max ? `${fmt(min)}%` : `${fmt(min)}%–${fmt(max)}%`;
}

function breakdownLabel(item: CashbackBreakdownItem): string {
    if (item.is_catchall) return 'Chi tiêu khác';
    const parts = [...(item.categories ?? []), ...(item.merchants ?? [])];
    return parts.join(' · ') || 'Hoàn tiền';
}

export function CashbackDisplay({ranked, intentSlug}: {ranked: RankedCard; intentSlug?: string}) {
    const {max_cashback, breakdown} = ranked.cashback_result;

    if (max_cashback === 0) {
        return (
            <div className="ow-cashback-display flex flex-col items-start sm:items-end gap-0.5">
                <span className="text-body-sm text-text-muted">Chưa có ưu đãi</span>
            </div>
        );
    }

    const showBreakdown = breakdown && breakdown.length > 1;
    const rateDisplay = !showBreakdown ? getRateDisplay(ranked.card, intentSlug) : null;

    return (
        <div className="ow-cashback-display flex flex-col items-start sm:items-end gap-0.5">
            <span className="text-body-lg font-semibold text-primary">
                {max_cashback.toLocaleString('vi-VN')}đ
            </span>
            {showBreakdown ? (
                breakdown.map((item, i) => (
                    <span key={i} className="text-[11px] text-text-muted">
                        {breakdownLabel(item)}: {item.cashback.toLocaleString('vi-VN')}đ
                    </span>
                ))
            ) : rateDisplay ? (
                <span className="text-body-sm text-text-muted">
                    Hoàn {rateDisplay}/kỳ
                </span>
            ) : null}
        </div>
    );
}
