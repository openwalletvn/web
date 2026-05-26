import type {Card, Intent} from '@/lib/api';
import type {RankedCard, CashbackBreakdownItem} from '@/lib/card-ranker';

type IntentMap = Map<string, Pick<Intent, 'slug' | 'label' | 'icon'>>;

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

function fmtRate(rate: number, rateMax?: number): string {
    const f = (n: number) => `${Math.round(n * 10000) / 100}%`;
    return rateMax ? `${f(rate)}–${f(rateMax)}` : f(rate);
}

function resolveLabel(slug: string, intentMap?: IntentMap): string {
    return intentMap?.get(slug)?.label ?? slug;
}

function breakdownLabel(item: CashbackBreakdownItem, intentMap?: IntentMap): string {
    if (item.is_catchall) return 'Chi tiêu khác';
    const slugs = [...(item.matched_intents ?? item.categories ?? []), ...(item.merchants ?? [])];
    return slugs.map(s => resolveLabel(s, intentMap)).join(' · ') || 'Hoàn tiền';
}

function IntentBreakdown({item, intentMap}: {item: CashbackBreakdownItem; intentMap?: IntentMap}) {
    const {intent_breakdown} = item;
    if (!intent_breakdown || intent_breakdown.length <= 1) return null;
    return (
        <span className="text-[10px] text-text-muted/70 max-w-[200px] leading-3">
            {intent_breakdown.map((b, i) => (
                <span key={b.intent}>
                    {i > 0 && ' + '}
                    {resolveLabel(b.intent, intentMap)}: {b.cashback.toLocaleString('vi-VN')}đ{b.is_capped ? ' (tối đa)' : ''}
                </span>
            ))}
        </span>
    );
}

export function CashbackDisplay({ranked, intentSlug, intentMap}: {ranked: RankedCard; intentSlug?: string; intentMap?: IntentMap}) {
    const {max_cashback, breakdown} = ranked.cashback_result;

    if (max_cashback === 0) {
        return (
            <div className="ow-cashback-display flex flex-col items-start sm:items-end gap-0.5">
                <span className="text-body-sm text-text-muted">Chưa có ưu đãi</span>
            </div>
        );
    }

    const showBreakdown = breakdown && breakdown.length >= 1;
    const rateDisplay = !showBreakdown ? getRateDisplay(ranked.card, intentSlug) : null;

    return (
        <div className="ow-cashback-display flex flex-col items-start sm:items-end gap-0.5">
            <span className="text-body-lg font-semibold text-primary">
                {max_cashback.toLocaleString('vi-VN')}đ
            </span>
            {showBreakdown ? (
                breakdown.map((item, i) => (
                    <div key={i} className="flex flex-col items-start sm:items-end">
                        <span className="text-[11px] text-text-muted max-w-[200px] leading-3">
                            {breakdownLabel(item, intentMap)} · {fmtRate(item.rate)}: {item.cashback.toLocaleString('vi-VN')}đ
                        </span>
                        <IntentBreakdown item={item} intentMap={intentMap} />
                    </div>
                ))
            ) : rateDisplay ? (
                <span className="text-body-sm text-text-muted">
                    Hoàn {rateDisplay}/kỳ
                </span>
            ) : null}
        </div>
    );
}
