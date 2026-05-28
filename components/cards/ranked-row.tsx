import React from 'react';
import Link from 'next/link';
import type {Intent} from '@/lib/api';
import type {RankedCard} from '@/lib/card-ranker';
import {CATCHALL_SLUGS} from '@/lib/cashback-utils';
import {CardImage} from '@/components/cards/card-image';
import {RankBadge} from '@/components/cards/rank-badge';
import {CashbackDisplay} from '@/components/cards/cashback-display';
import {IconBulb, IconCaretDownFilled, IconCaretUpFilled} from '@tabler/icons-react';

export function RankedRow({ranked, muted = false, tiebreakerReason, tiebreakerDelta, viewTransitionName, intentMap, highlightedSlugs, intentSlug}: {
    ranked: RankedCard;
    muted?: boolean;
    tiebreakerReason?: string;
    tiebreakerDelta?: number;
    viewTransitionName?: string;
    intentMap?: Map<string, Pick<Intent, 'slug' | 'label' | 'icon'>>;
    highlightedSlugs?: string[];
    intentSlug?: string;
}) {
    const {card, rank} = ranked;
    console.log(ranked)
    const isTop3 = rank <= 3 && !muted;
    const highlighted = new Set(highlightedSlugs ?? []);

    const hasUniversalRule = card.cashback?.rules.some(r => r.intents?.some(c => CATCHALL_SLUGS.has(c))) ?? false;
    const cardIntents = intentMap
        ? [...new Set(card.cashback?.rules.flatMap(r => [
              ...(r.merchants ?? []),
              ...(r.intents ?? []).filter(c => !CATCHALL_SLUGS.has(c)),
          ]) ?? [])]
            .map(slug => intentMap.get(slug))
            .filter((i): i is Pick<Intent, 'slug' | 'label' | 'icon'> => !!i)
        : [];

    return (
        <div
            className={`ow-ranked-row flex flex-col`}
            style={viewTransitionName ? {viewTransitionName} as React.CSSProperties : undefined}
        >
            {/*row 1*/}
            <div className="shrink-0 flex gap-0.5 w-full mb-2">
                {muted ? (
                    <span className="text-label text-text-muted">#{ranked.rank}</span>
                ) : (
                    <RankBadge rank={rank}/>
                )}
                {tiebreakerDelta !== undefined && tiebreakerDelta > 0 && (
                    <span className="flex items-center gap-0.5 text-emerald-500 text-[10px] font-semibold leading-none">
                        <IconCaretUpFilled size={10}/>{tiebreakerDelta}
                    </span>
                )}
                {tiebreakerDelta !== undefined && tiebreakerDelta < 0 && (
                    <span className="flex items-center gap-0.5 text-orange-400 text-[10px] font-semibold leading-none">
                        <IconCaretDownFilled size={10}/>{Math.abs(tiebreakerDelta)}
                    </span>
                )}
            </div>

            {/*row 2*/}
            <div className="grid grid-cols-12 gap-3 flex-wrap">
                {/*left col*/}
                <div className="col-span-6 flex gap-3">
                    <Link href={`/the/${card.id}`} className="shrink-0 w-16 sm:w-20">
                        <CardImage card={card} className="w-16 sm:w-20"/>
                    </Link>
                    <div className="flex-1 min-w-0">
                        <Link href={`/the/${card.id}`}
                              className={`text-body font-semibold truncate block hover:underline ${muted ? 'text-text-muted' : 'text-black'}`}>
                            {card.name}
                        </Link>
                        {card.fees?.annual != null && (
                            <p className="text-body-sm text-text-muted">
                                {card.fees.annual.amount === 0
                                    ? 'Miễn phí thường niên'
                                    : `Phí ${card.fees.annual.amount.toLocaleString('vi-VN')}đ/năm`}
                            </p>
                        )}
                        {intentMap && (cardIntents.length > 0 || hasUniversalRule) && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                                {hasUniversalRule && (
                                    <span
                                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium ${
                                            highlighted.size > 0 ? 'bg-primary/10 text-primary' : 'bg-bg-muted text-text-muted'
                                        }`}>
                                    🌐 Tất cả chi tiêu
                                </span>
                                )}
                                {cardIntents.map(intent => (
                                    <span
                                        key={intent.slug}
                                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium ${
                                            highlighted.has(intent.slug)
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-bg-muted text-text-muted opacity-50'
                                        }`}
                                    >
                                    {intent.icon} {intent.label}
                                </span>
                                ))}
                            </div>
                        )}
                        {tiebreakerReason && (
                            <span className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                            <IconBulb size={12} className="shrink-0 text-amber-400"/>
                                {tiebreakerReason}
                        </span>
                        )}
                    </div>
                </div>
                {/*right col*/}
                <div className="col-span-6 text-right">
                    <CashbackDisplay ranked={ranked} intentSlug={intentSlug} intentMap={intentMap}/>
                </div>
            </div>
        </div>
    );
}
