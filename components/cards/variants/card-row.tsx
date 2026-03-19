import type { ReactNode } from 'react';
import type { Card, Bank } from '@/lib/api';
import { CardImage } from '@/components/cards/card-image';
import { MetalBadge } from '@/components/cards/metal-badge';
import { NetworkBadge } from '@/components/shared/network-badge';
import { CardTypeBadges } from '@/components/shared/card-type-badge';

interface BadgeConfig {
    network?: boolean;
    type?: boolean;
    metal?: boolean;
    status?: boolean;
}

interface Props {
    card: Card;
    bank: Bank | null;
    badges?: BadgeConfig;
    slot?: ReactNode;
}

export function CardRow({ card, bank, badges = {}, slot }: Props) {
    const { network = true, type = true, metal = false, status = false } = badges;
    const isVertical = card.image?.orientation === 'vertical';

    return (
        <div className="flex items-center gap-3">
            {/* Card image */}
            <div className="shrink-0 w-20">
                {isVertical ? (
                    <div className="h-20 flex justify-center items-center">
                        <CardImage card={card} className="h-full w-auto" />
                    </div>
                ) : (
                    <div className="w-full flex justify-center items-center">
                        <CardImage card={card} className="w-full" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-medium leading-tight truncate text-sm text-slate-900">{card.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                    {status && card.status === 'discontinued' && (
                        <span className="px-1.5 py-0.5 border border-dashed border-amber-400 text-amber-600 bg-amber-50 text-[11px]">
                            Dừng phát hành
                        </span>
                    )}
                    {network && <NetworkBadge card={card} />}
                    {type && <CardTypeBadges types={card.card_type} />}
                    {metal && card.is_metal && <MetalBadge />}
                </div>
            </div>

            {slot != null && <div className="shrink-0 flex items-center gap-2">{slot}</div>}
        </div>
    );
}
