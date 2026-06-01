import Link from 'next/link';
import type {CashbackRule, Intent} from '@/lib/api';
import type {CashbackBreakdownItem, RankedCard} from '@/lib/card-ranker';
import {CATCHALL_SLUGS, getRateDisplay} from '@/lib/card-display-utils';
import {OwCardImage} from '@/components/ow-ui/ow-card-image';
import {OwRankBadge} from '@/components/ow-ui/ow-rank-badge';
import {OwFeeAmount} from '@/components/ow-ui/ow-fee-amount';
import {IconBulb, IconCaretDownFilled, IconCaretUpFilled} from '@tabler/icons-react';
import {OwBadge, OwBadges} from '@/components/ow-ui/ow-badge';

type IntentMap = Map<string, Pick<Intent, 'slug' | 'label' | 'icon'>>;

function catchallLabel(rule: CashbackRule): string {
    const intentSlug = rule.intents?.find(i => CATCHALL_SLUGS.has(i));
    const channel = rule.scope?.channel ?? (intentSlug === 'all-online' ? 'online' : intentSlug === 'all-offline' ? 'offline' : undefined);
    const geo = rule.scope?.geography;

    const channelPart = channel === 'online' ? 'Online' : channel === 'offline' ? 'Offline' : null;
    const geoPart = geo === 'foreign' ? 'quốc tế' : geo === 'domestic' ? 'nội địa' : geo ? geo : null;

    if (channelPart && geoPart) return `🌐 ${channelPart} ${geoPart}`;
    if (channelPart) return `🌐 ${channelPart}`;
    if (geoPart) return `🌐 Tất cả chi tiêu ${geoPart}`;
    return '🌐 Tất cả chi tiêu';
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
    const slugs = [...(item.matched_intents ?? item.intents ?? []), ...(item.merchants ?? [])];
    return slugs.map(s => resolveLabel(s, intentMap)).join(' · ') || 'Hoàn tiền';
}

function IntentBreakdown({item, intentMap}: { item: CashbackBreakdownItem; intentMap?: IntentMap }) {
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

export function OwCardRankedRow({ranked, intentMap, highlightedSlugs, intentSlug}: {
    ranked: RankedCard;
    intentMap?: Map<string, Pick<Intent, 'slug' | 'label' | 'icon'>>;
    highlightedSlugs?: string[];
    intentSlug?: string;
}) {
    const {card, rank, rank_reason, rank_reason_type, tiebreaker_delta} = ranked;
    const highlighted = new Set(highlightedSlugs ?? []);

    const catchallRules = card.cashback?.rules.filter(r => r.intents?.some(c => CATCHALL_SLUGS.has(c))) ?? [];
    const slugRateMap = new Map<string, number>();
    for (const rule of card.cashback?.rules ?? []) {
        for (const slug of [...(rule.merchants ?? []), ...(rule.intents ?? []).filter(c => !CATCHALL_SLUGS.has(c))]) {
            if (!slugRateMap.has(slug)) slugRateMap.set(slug, rule.rate);
        }
    }
    const cardIntents = intentMap
        ? [...new Set(card.cashback?.rules.flatMap(r => [
              ...(r.merchants ?? []),
              ...(r.intents ?? []).filter(c => !CATCHALL_SLUGS.has(c)),
          ]) ?? [])]
            .map(slug => {
                const intent = intentMap.get(slug);
                return intent ? {...intent, rate: slugRateMap.get(slug)} : undefined;
            })
            .filter((i): i is NonNullable<typeof i> => !!i)
        : [];

    const showReason = rank_reason && rank_reason_type !== 'higher_cashback';

    const {cashback, breakdown} = ranked.cashback_result;
    const activeBreakdown = breakdown?.filter(b => !b.cashback_expired);
    const showBreakdown = cashback > 0 && activeBreakdown && activeBreakdown.length >= 1;
    const rateDisplay = cashback > 0 && !showBreakdown ? getRateDisplay(card, intentSlug) : null;

    return (
        <div className="ow-card-ranked-row grid grid-cols-12 gap-3 items-start">
            {/*col 1 — card image [2]*/}
            <div className="col-span-2">
                <Link href={`/the/${card.id}`}>
                    <OwCardImage card={card} className="w-full"/>
                </Link>
            </div>

            {/*col 2 — card info [6]*/}
            <div className="col-span-6 flex flex-col gap-1 min-w-0">
                {/*rank badge row*/}
                <div className="flex items-center gap-0.5">
                    <OwRankBadge rank={rank}/>
                    {tiebreaker_delta !== undefined && tiebreaker_delta > 0 && (
                        <span
                            className="flex items-center gap-0.5 text-emerald-500 text-[10px] font-semibold leading-none">
                            <IconCaretUpFilled size={10}/>{tiebreaker_delta}
                        </span>
                    )}
                    {tiebreaker_delta !== undefined && tiebreaker_delta < 0 && (
                        <span
                            className="flex items-center gap-0.5 text-orange-400 text-[10px] font-semibold leading-none">
                            <IconCaretDownFilled size={10}/>{Math.abs(tiebreaker_delta)}
                        </span>
                    )}
                </div>

                {/*card name + type*/}
                <div className="flex items-center gap-1.5 min-w-0">
                    <Link href={`/the/${card.id}`}
                          className="text-body font-semibold truncate hover:underline text-black">
                        {card.name}
                    </Link>
                </div>

                {/*intent badges*/}
                {intentMap && (cardIntents.length > 0 || catchallRules.length > 0) && (
                    <OwBadges>
                        {card.card_type && card.card_type.length > 0 && (
                            <OwBadge small variant="card-type" cardTypes={card.card_type}/>
                        )}
                        {catchallRules.map((rule, i) => (
                            <OwBadge small key={i} colorHex={highlighted.size > 0 ? 'var(--color-primary)' : undefined}>
                                {catchallLabel(rule)}
                            </OwBadge>
                        ))}
                        {cardIntents.map(intent => (
                            <OwBadge
                                small
                                key={intent.slug}
                                variant="intent"
                                slug={intent.slug}
                                emoji={intent.icon}
                                label={intent.label}
                                rate={intent.rate}
                                highlighted={highlighted.has(intent.slug)}
                            />
                        ))}
                    </OwBadges>
                )}

                {/*min spend*/}
                {card.cashback?.min_spend_per_period != null && (
                    <p className="text-body-sm text-text-muted">
                        Chi tối thiểu {card.cashback.min_spend_per_period.toLocaleString('vi-VN')}đ/tháng
                    </p>
                )}

                {/*rank reason*/}
                {showReason && (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                        <IconBulb size={12} className="shrink-0 text-amber-400"/>
                        {rank_reason}
                    </span>
                )}

                {/*cashback display*/}
                {cashback === 0 ? (
                    <span className="text-body-sm text-text-muted">Đang cập nhật thông tin ưu đãi</span>
                ) : (
                    <div className="ow-cashback-display flex flex-col items-start gap-0.5">
                        {showBreakdown ? (
                            activeBreakdown!.map((item, i) => (
                                <div key={i} className="flex flex-col items-start sm:items-end">
                                    <span className="text-[11px] text-text-muted max-w-[200px] leading-3">
                                        {breakdownLabel(item, intentMap)} · {fmtRate(item.rate)}{item.spend ? ` · ${item.spend.toLocaleString('vi-VN')}đ` : ''}: {item.cashback.toLocaleString('vi-VN')}đ
                                    </span>
                                    <IntentBreakdown item={item} intentMap={intentMap}/>
                                </div>
                            ))
                        ) : rateDisplay ? (
                            <span className="text-body-sm text-text-muted">Hoàn {rateDisplay}/kỳ</span>
                        ) : null}
                    </div>
                )}
            </div>

            {/*col 3 — cashback amount [2]*/}
            <div className="col-span-2 flex flex-col items-end">
                <OwFeeAmount amount={ranked.cashback_result.cashback} compact period="kỳ"/>
            </div>

            {/*col 4 — annual fee [2]*/}
            <div className="col-span-2 flex flex-col items-end">
                {card.fees?.annual != null && (
                    <OwFeeAmount amount={card.fees.annual.amount} compact/>
                )}
            </div>
        </div>
    );
}
