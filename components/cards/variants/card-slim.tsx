import Link from 'next/link';
import type { Card, Bank } from '@/lib/api';
import { CardImage } from '@/components/cards/card-image';
import { MetalBadge } from '@/components/cards/metal-badge';
import { NetworkBadge } from '@/components/shared/network-badge';
import { CardTypeBadges } from '@/components/shared/card-type-badge';

interface BadgeConfig {
    network?: boolean;
    type?: boolean;
    fee?: boolean;
}

interface Props {
    card: Card;
    bank?: Bank | null;
    badges?: BadgeConfig;
    showThumb?: boolean;
    asLink?: boolean;
}

export function CardSlim({ card, bank, badges = {}, showThumb = false, asLink = true }: Props) {
    const { network = true, type = false, fee = false } = badges;
    const isVertical = card.image?.orientation === 'vertical';

    const feeLabel = card.fees?.annual == null
        ? null
        : card.fees.annual.amount === 0
            ? 'Miễn phí'
            : `${card.fees.annual.amount.toLocaleString('vi-VN')} ${card.currency ?? 'VND'}`;

    const content = (
        <>
            {showThumb && (
                isVertical ? (
                    <div className="w-24 h-20 shrink-0 flex items-center justify-center">
                        <CardImage card={card} className="h-full w-auto" />
                    </div>
                ) : (
                    <div className="w-24 shrink-0">
                        <CardImage card={card} />
                    </div>
                )
            )}

            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
                    {card.name}
                </p>
                {fee && feeLabel && (
                    <p className="text-[11px] text-slate-400 mt-0.5">{feeLabel}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-1">
                    {card.status === 'discontinued' && (
                        <span className="text-[10px] px-1.5 py-0.5 border border-dashed border-amber-300 text-amber-600 bg-amber-50 rounded-sm leading-none">
                            Dừng phát hành
                        </span>
                    )}
                    {network && <NetworkBadge card={card} />}
                    {type && <CardTypeBadges types={card.card_type} />}
                    {card.is_metal && <MetalBadge />}
                </div>
            </div>
        </>
    );

    if (asLink) {
        return (
            <Link
                href={`/the/${card.id}`}
                className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50/60 transition-colors group"
            >
                {content}
            </Link>
        );
    }

    return <div className="flex items-center gap-2.5">{content}</div>;
}
