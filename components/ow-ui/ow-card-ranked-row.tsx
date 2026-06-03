import Link from 'next/link';
import type {CashbackRule, Intent} from '@/lib/api';
import type {RankedCard} from '@/lib/card-ranker';
import {CATCHALL_SLUGS} from '@/lib/card-display-utils';
import {IconAlertTriangle} from '@tabler/icons-react';
import {CardModel} from '@/lib/card-model';
import {OwCardImage} from '@/components/ow-ui/ow-card-image';
import {OwRankBadge} from '@/components/ow-ui/ow-rank-badge';
import {OwAmount} from '@/components/ow-ui/ow-amount';
import {IconBulb, IconCaretDownFilled, IconCaretUpFilled} from '@tabler/icons-react';
import {OwBadge, OwBadges} from '@/components/ow-ui/ow-badge';
import {OwCardIntentBadges} from '@/components/ow-ui/ow-card-intent-badges';

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


export function OwCardRankedRow({ranked, intentMap, highlightedSlugs, intentSlug}: {
    ranked: RankedCard;
    intentMap?: Map<string, Pick<Intent, 'slug' | 'label' | 'icon'>>;
    highlightedSlugs?: string[];
    intentSlug?: string;
}) {
    const {card, rank, rank_reason, rank_reason_type, tiebreaker_delta} = ranked;
    const highlighted = new Set(highlightedSlugs ?? []);

    const cardModel = new CardModel(card);
    const cashbackData = cardModel.getCashback();
    const catchallRules = cashbackData?.rules.filter(r => r.intents?.some(c => CATCHALL_SLUGS.has(c))) ?? [];
    const slugRateMap = cardModel.buildSlugRateMap();
    const cardIntents = intentMap
        ? [...new Set(cashbackData?.rules.flatMap(r => [
              ...(r.merchants ?? []),
              ...(r.intents ?? []).filter(c => !CATCHALL_SLUGS.has(c)),
          ]) ?? [])]
            .map(slug => {
                const intent = intentMap.get(slug);
                return intent ? {slug: intent.slug, icon: intent.icon, label: intent.label, rate: slugRateMap.get(slug)} : undefined;
            })
            .filter((i): i is NonNullable<typeof i> => !!i)
        : [];

    const showReason = rank_reason && rank_reason_type !== 'higher_cashback';

    const {cashback} = ranked.cashback_result;
    const rateDisplay = cashback > 0 ? cardModel.getRateDisplay(intentSlug) : null;
    const cardTypes = cardModel.getCardTypes();

    const breakdown = ranked.cashback_breakdown;
    const byIntentEntries = breakdown?.by_intent
        ? Object.entries(breakdown.by_intent).filter(([, v]) => (v.cashback ?? 0) > 0)
        : [];
    const cardNotes = breakdown?.by_card?.[card.id]?.notes ?? [];
    const suggestions = breakdown?.suggestions ?? [];
    const showBreakdown = cashback > 0 && byIntentEntries.length > 0;

    return (
        <div className="ow-card-ranked-row grid grid-cols-12 gap-3 items-start">
            {/*col 1 — card image [2]*/}
            <div className="col-span-2">
                <Link href={`/the/${cardModel.getId()}`}>
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
                    <Link href={`/the/${cardModel.getId()}`}
                          className="text-body font-semibold truncate hover:underline text-black">
                        {cardModel.getName()}
                    </Link>
                </div>

                {/*intent badges*/}
                {intentMap && (cardIntents.length > 0 || catchallRules.length > 0) && (
                    <OwBadges>
                        {cardTypes.length > 0 && (
                            <OwBadge small variant="card-type" cardTypes={cardTypes}/>
                        )}
                        {catchallRules.map((rule, i) => (
                            <OwBadge small key={i} colorHex={highlighted.size > 0 ? 'var(--color-primary)' : undefined}>
                                {catchallLabel(rule)}
                            </OwBadge>
                        ))}
                        <OwCardIntentBadges intents={cardIntents} highlighted={highlighted} small/>
                    </OwBadges>
                )}

                {/*min spend*/}
                {cashbackData?.min_spend_per_period != null && (
                    <p className="text-body-sm text-text-muted">
                        Chi tối thiểu {cashbackData.min_spend_per_period.toLocaleString('vi-VN')}đ/tháng
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
                ) : showBreakdown ? (
                    <div className="flex flex-col gap-0.5">
                        {byIntentEntries.map(([slug, v]) => {
                            const intent = intentMap?.get(slug);
                            return (
                                <span key={slug} className="text-[11px] text-text-muted leading-4">
                                    {intent?.icon && <span className="mr-0.5">{intent.icon}</span>}
                                    <span>{intent?.label ?? slug}</span>
                                    {v.budget != null && (
                                        <span className="text-text-muted/60"> {(v.budget / 1_000_000).toFixed(0)}tr →</span>
                                    )}
                                    <span className="font-medium text-slate-700"> {(v.cashback ?? 0).toLocaleString('vi-VN')}đ</span>
                                    {v.rate != null && (
                                        <span className="text-text-muted/60"> ({Math.round(v.rate * 10000) / 100}%)</span>
                                    )}
                                </span>
                            );
                        })}
                        {[...cardNotes, ...suggestions].slice(0, 1).map((msg, i) => (
                            <span key={i} className="flex items-center gap-1 text-[10px] text-amber-600 leading-4">
                                <IconAlertTriangle size={10} className="shrink-0"/>
                                {msg}
                            </span>
                        ))}
                    </div>
                ) : rateDisplay ? (
                    <span className="text-body-sm text-text-muted">Hoàn {rateDisplay}/kỳ</span>
                ) : null}
            </div>

            {/*col 3 — cashback amount [2]*/}
            <div className="col-span-2 flex flex-col items-end">
                <OwAmount amount={ranked.cashback_result.cashback} unit="k" period="period"/>
            </div>

            {/*col 4 — annual fee [2]*/}
            <div className="col-span-2 flex flex-col items-end">
                {cardModel.getFees()?.annual != null && (
                    <OwAmount amount={cardModel.getFees()!.annual!.amount} unit="k" period="year"/>
                )}
            </div>
        </div>
    );
}
