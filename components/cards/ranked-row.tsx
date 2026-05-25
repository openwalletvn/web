import React from 'react';
import Link from 'next/link';
import type {Intent} from '@/lib/api';
import type {RankedCard} from '@/lib/card-ranker';
import {CardImage} from '@/components/cards/card-image';
import {RankBadge} from '@/components/cards/rank-badge';
import {CashbackDisplay} from '@/components/cards/cashback-display';
import {IconCaretUpFilled, IconCaretDownFilled, IconBulb} from '@tabler/icons-react';

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
    const isTop3 = rank <= 3 && !muted;
    const highlighted = new Set(highlightedSlugs ?? []);

    const CATCHALL_SLUGS = new Set(['all', 'all-online', 'all-offline']);
    const hasUniversalRule = card.cashback?.rules.some(r => r.categories?.some(c => CATCHALL_SLUGS.has(c))) ?? false;
    const cardIntents = intentMap
        ? [...new Set(card.cashback?.rules.flatMap(r => [
              ...(r.merchants ?? []),
              ...(r.categories ?? []).filter(c => !CATCHALL_SLUGS.has(c)),
          ]) ?? [])]
            .map(slug => intentMap.get(slug))
            .filter((i): i is Pick<Intent, 'slug' | 'label' | 'icon'> => !!i)
        : [];

    return (
        <div
            className={`ow-ranked-row flex items-center gap-3 rounded-lg p-3 sm:p-4 ${
                isTop3
                    ? 'bg-white border-2 border-primary shadow-sm'
                    : 'bg-white border border-slate-100'
            }`}
            style={viewTransitionName ? {viewTransitionName} as React.CSSProperties : undefined}
        >
            <div className="w-10 sm:w-12 shrink-0 flex flex-col items-center gap-0.5">
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

            <Link href={`/the/${card.id}`} className="shrink-0 w-16 sm:w-20">
                <CardImage card={card} className="w-16 sm:w-20"/>
            </Link>

            <div className="flex flex-1 min-w-0 flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <div className="flex-1 min-w-0">
                    <Link href={`/the/${card.id}`} className={`text-body font-semibold truncate block hover:underline ${muted ? 'text-text-muted' : 'text-black'}`}>
                        {card.name}
                    </Link>
                    {card.bank_data && (
                        <p className="text-body-sm text-text-muted truncate">{card.bank_data.name}</p>
                    )}
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
                                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-medium ${
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

                <div className="shrink-0 sm:text-right">
                    <CashbackDisplay ranked={ranked} intentSlug={intentSlug}/>
                </div>
            </div>
        </div>
    );
}
