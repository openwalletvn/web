'use client';

import Link from 'next/link';
import { IconExternalLink, IconBuildingBank } from '@tabler/icons-react';
import type { Card, Bank } from '@/lib/api';
import { getBankImageUrl } from '@/lib/api';
import { CardImage } from '@/components/cards/card-image';
import { MetalBadge } from '@/components/cards/metal-badge';
import { NetworkBadge } from '@/components/shared/network-badge';
import { CardTypeBadges } from '@/components/shared/card-type-badge';

interface BadgeConfig {
    network?: boolean;
    type?: boolean;
    metal?: boolean;
    status?: boolean;
    fee?: boolean;
}

interface Props {
    card: Card;
    bank?: Bank | null;
    href?: string;
    badge?: string;
    badges?: BadgeConfig;
    showActions?: boolean;
}

export function CardTile({
    card,
    bank: bankProp,
    href,
    badge,
    badges = {},
    showActions = true,
}: Props) {
    const bank = bankProp !== undefined ? bankProp : (card.bank_data ?? null);
    const isVertical = card.image?.orientation === 'vertical';

    const {
        network = true,
        type = true,
        metal = true,
        status = true,
        fee = true,
    } = badges;

    const hexToRgba = (hex: string, alpha = 0.45) => {
        if (!hex) return `rgba(0,0,0,${alpha})`;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <div
            className="ow-card-tile flex flex-col gap-2 group relative cursor-pointer"
            style={{
                // @ts-ignore
                '--glow-color': bank?.brand_color ? hexToRgba(bank.brand_color, 0.45) : 'rgba(0,0,0,0.45)',
            }}
        >
            {/* Card image with tilt + glow */}
            <div className="relative">
                {badge && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-10 flex flex-col items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <span className="whitespace-nowrap px-2 py-1 rounded bg-slate-800 text-white text-[11px] font-medium leading-tight shadow">
                            {badge}
                        </span>
                        <svg width="10" height="6" viewBox="0 0 10 6" className="text-slate-800 fill-current">
                            <path d="M0 0 L5 6 L10 0 Z" />
                        </svg>
                    </div>
                )}
                {isVertical &&
                    <div className="absolute left-1/2 top-1/2 w-[50%] h-[80%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full shadow-[0_0_100px_100px_var(--glow-color)]" />
                }
                {!isVertical &&
                    <div className="absolute left-1/2 top-1/2 w-[50%] h-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full shadow-[0_0_100px_80px_var(--glow-color)]" />
                }
                <Link
                    href={href ?? `/the/${card.id}`}
                    aria-label={badge}
                    className="relative block group-hover:scale-105 transition-transform duration-300"
                >
                    <CardImage card={card} tilt />
                </Link>
            </div>

            <div className="relative min-h-[80px]">
                {/* Text content - fades out on hover */}
                <div className="transition-opacity duration-150 group-hover:opacity-0">
                    <p className="font-medium text-slate-800 leading-tight">{card.name}</p>
                    {fee && card.fees?.annual != null && (
                        <p className="text-sm text-slate-500">
                            {card.fees.annual.amount === 0
                                ? 'Miễn phí'
                                : `${card.fees.annual.amount.toLocaleString()} ${card.currency ?? 'VND'}`}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                        {status && card.status === 'discontinued' && (
                            <span className="px-1.5 py-0.5 border border-dashed border-amber-400 text-amber-600 bg-amber-50 text-[11px]">
                                Dừng phát hành
                            </span>
                        )}
                        {network && <NetworkBadge card={card} variant="slim" />}
                        {type && <CardTypeBadges types={card.card_type} />}
                        {metal && card.is_metal && <MetalBadge />}
                    </div>
                </div>

                {/* Circle buttons - fade in on hover */}
                {showActions && (
                    <div className="absolute inset-0 flex items-center justify-start gap-3">
                        <div className="flex flex-col items-center gap-1 opacity-0 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0">
                            <Link
                                href={`/ngan-hang/${card.bank_id}`}
                                className="flex items-center justify-center size-10 rounded-full bg-white border border-dashed border-slate-300 shadow-sm text-slate-600 hover:border-brand-blue hover:text-brand-blue transition-all overflow-hidden"
                            >
                                {bank?.logo_url ? (
                                    <img src={getBankImageUrl(bank.logo_url)} alt={bank.name} className="w-full h-full object-contain p-1.5" />
                                ) : (
                                    <IconBuildingBank className="size-4" />
                                )}
                            </Link>
                            <span className="text-[10px] text-slate-500 text-center leading-tight">Xem ngân hàng</span>
                        </div>

                        {card.card_link && (
                            <div className="flex flex-col items-center gap-1 opacity-0 translate-y-1 transition-all duration-150 delay-[80ms] group-hover:opacity-100 group-hover:translate-y-0">
                                <a
                                    href={card.card_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center size-10 rounded-full bg-white border border-dashed border-slate-300 shadow-sm text-slate-600 hover:border-brand-blue hover:text-brand-blue transition-all"
                                >
                                    <IconExternalLink className="size-4" />
                                </a>
                                <span className="text-[10px] text-slate-500 text-center leading-tight">Xem trang thẻ</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
