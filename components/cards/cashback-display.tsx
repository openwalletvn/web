import type {Intent} from '@/lib/api';
import type {CashbackBreakdownItem, RankedCard} from '@/lib/card-ranker';
import {getRateDisplay} from '@/lib/cashback-utils';

export {getRateDisplay};

type IntentMap = Map<string, Pick<Intent, 'slug' | 'label' | 'icon'>>;

function fmtRate(rate: number, rateMax?: number): string {
    const f = (n: number) => `${Math.round(n * 10000) / 100}%`;
    return rateMax ? `${f(rate)}–${f(rateMax)}` : f(rate);
}

function resolveLabel(slug: string, intentMap?: IntentMap): string {
    return intentMap?.get(slug)?.label ?? slug;
}

function breakdownLabel(item: CashbackBreakdownItem, intentMap?: IntentMap): string {
    if (item.is_catchall) return 'Chi tiêu khác';
    const slugs = [...(item.matched_intents ?? item.intents ?? []), ...(item.merchants ?? [])];
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
    const {cashback, breakdown} = ranked.cashback_result;

    if (cashback === 0) {
        return (
            <div className="ow-cashback-display flex flex-col items-start gap-0.5">
                <span className="text-body-sm text-text-muted">Đang cập nhật thông tin ưu đãi</span>
            </div>
        );
    }

    const showBreakdown = breakdown && breakdown.length >= 1;
    const rateDisplay = !showBreakdown ? getRateDisplay(ranked.card, intentSlug) : null;
    return (
        <div className="ow-cashback-display flex flex-col items-start gap-0.5">
            <span className="text-body-lg font-semibold text-primary">
                {cashback.toLocaleString('vi-VN')}đ
            </span>
            {showBreakdown ? (
                breakdown.map((item, i) => (
                    <div key={i} className="flex flex-col items-start sm:items-end">
                        <span className="text-[11px] text-text-muted max-w-[200px] leading-3">
                            {breakdownLabel(item, intentMap)} · {fmtRate(item.rate)}{item.spend ? ` · ${item.spend.toLocaleString('vi-VN')}đ` : ''}: {item.cashback.toLocaleString('vi-VN')}đ
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
