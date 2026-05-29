import React from 'react';
import Link from 'next/link';
import {cn} from '@/lib/utils';
import type {CashbackRule, Intent} from '@/lib/api';
import type {RankedCard} from '@/lib/card-ranker';
import {CATCHALL_SLUGS} from '@/lib/cashback-utils';
import {CardImage} from '@/components/cards/card-image';
import {RankBadge} from '@/components/cards/rank-badge';
import {CashbackDisplay} from '@/components/cards/cashback-display';
import {IconBulb, IconCaretDownFilled, IconCaretUpFilled} from '@tabler/icons-react';

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

export function RankedRow({ranked, muted = false, viewTransitionName, intentMap, highlightedSlugs, intentSlug}: {
    ranked: RankedCard;
    muted?: boolean;
    viewTransitionName?: string;
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

    const showReason = !muted && rank_reason && rank_reason_type !== 'higher_cashback';

    return (
        <div
            className="ow-ranked-row flex flex-col"
            style={viewTransitionName ? {viewTransitionName} as React.CSSProperties : undefined}
        >
            {/*row 1*/}
            <div className="shrink-0 flex gap-0.5 w-full mb-2">
                {muted ? (
                    <span className="text-label text-text-muted">#{ranked.rank}</span>
                ) : (
                    <RankBadge rank={rank}/>
                )}
                {tiebreaker_delta !== undefined && tiebreaker_delta > 0 && (
                    <span className="flex items-center gap-0.5 text-emerald-500 text-[10px] font-semibold leading-none">
                        <IconCaretUpFilled size={10}/>{tiebreaker_delta}
                    </span>
                )}
                {tiebreaker_delta !== undefined && tiebreaker_delta < 0 && (
                    <span className="flex items-center gap-0.5 text-orange-400 text-[10px] font-semibold leading-none">
                        <IconCaretDownFilled size={10}/>{Math.abs(tiebreaker_delta)}
                    </span>
                )}
            </div>

            {/*row 2*/}
            <div className="grid sm:grid-cols-12 gap-3 flex-wrap">
                {/*left col*/}
                <div className="col-span-6 flex gap-3">
                    <Link href={`/the/${card.id}`} className="shrink-0 w-24 sm:w-32">
                        <CardImage card={card} className="w-24 sm:w-32"/>
                    </Link>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <Link href={`/the/${card.id}`}
                                  className={cn('text-body font-semibold truncate hover:underline', muted ? 'text-text-muted' : 'text-black')}>
                                {card.name}
                            </Link>
                            {card.card_type && card.card_type.length > 0 && (
                                <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-bg-muted text-text-muted">
                                    {card.card_type.includes('credit') && card.card_type.includes('debit')
                                        ? 'Hybrid'
                                        : card.card_type[0] === 'credit'
                                        ? 'Tín dụng'
                                        : card.card_type[0] === 'debit'
                                        ? 'Ghi nợ'
                                        : card.card_type[0] === 'prepaid'
                                        ? 'Trả trước'
                                        : card.card_type[0]}
                                </span>
                            )}
                        </div>
                        {card.fees?.annual != null && (
                            <p className="text-body-sm text-text-muted">
                                {card.fees.annual.amount === 0
                                    ? 'Miễn phí thường niên'
                                    : `Phí ${card.fees.annual.amount.toLocaleString('vi-VN')}đ/năm`}
                            </p>
                        )}
                        {card.cashback?.min_spend_per_period != null && (
                            <p className="text-body-sm text-text-muted">
                                Chi tối thiểu {card.cashback.min_spend_per_period.toLocaleString('vi-VN')}đ/tháng
                            </p>
                        )}
                        {intentMap && (cardIntents.length > 0 || catchallRules.length > 0) && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                                {catchallRules.map((rule, i) => (
                                    <span key={i}
                                        className={cn('inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium', highlighted.size > 0 ? 'bg-primary/10 text-primary' : 'bg-bg-muted text-text-muted')}>
                                        {catchallLabel(rule)}
                                    </span>
                                ))}
                                {cardIntents.map(intent => (
                                    <span
                                        key={intent.slug}
                                        className={cn('inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium', highlighted.has(intent.slug) ? 'bg-primary/10 text-primary' : 'bg-bg-muted text-text-muted opacity-50')}
                                    >
                                    {intent.icon} {intent.label}{intent.rate !== undefined ? ` ${(intent.rate * 100).toFixed(intent.rate * 100 % 1 === 0 ? 0 : 1)}%` : ''}
                                </span>
                                ))}
                            </div>
                        )}
                        {showReason && (
                            <span className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                                <IconBulb size={12} className="shrink-0 text-amber-400"/>
                                {rank_reason}
                            </span>
                        )}

                        <div className="sm:hidden">
                            <CashbackDisplay ranked={ranked} intentSlug={intentSlug} intentMap={intentMap}/>
                        </div>
                    </div>
                </div>
                {/*right col*/}
                <div className="col-span-6 sm:text-right hidden sm:block">
                    <CashbackDisplay ranked={ranked} intentSlug={intentSlug} intentMap={intentMap}/>
                </div>
            </div>
        </div>
    );
}
