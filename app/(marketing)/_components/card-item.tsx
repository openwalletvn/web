'use client';

import {useRef, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {ExternalLink, Landmark} from 'lucide-react';
import type {Card} from '@/lib/api';
import {getBankImageUrl} from '@/lib/api';
import {CardImage} from '@/components/cards/card-image';

interface Props {
    card: Card;
}

export function CardItem({card}: Props) {
    const t = useTranslations('CardDetail');
    const router = useRouter();
    const imageRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({x: 0, y: 0});
    const [hovering, setHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = imageRef.current;
        if (!el) return;
        const {left, top, width, height} = el.getBoundingClientRect();
        const nx = (e.clientX - left) / width - 0.5;
        const ny = (e.clientY - top) / height - 0.5;
        setTilt({x: nx * 10, y: -ny * 10});
    };

    const bank = card.bank_data;
    const isVertical = card.image_orientation != "horizontal";
    const hexToRgba = (hex: string, alpha = 0.45) => {
        if (!hex) return `rgba(0,0,0,${alpha})`
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    return (
        <div
            className="flex flex-col gap-2 group relative cursor-pointer"
            style={{
                // @ts-ignore
                "--glow-color": bank?.brand_color ? hexToRgba(bank?.brand_color, 0.45) : "rgba(0,0,0,0.45)",
            }}
        >
            {/* Tilt wrapper — perspective 3D, mouse-tracked */}
            <div
                ref={imageRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => {
                    setHovering(false);
                    setTilt({x: 0, y: 0});
                }}
                className="relative"
                style={{
                    transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                    transition: hovering ? 'transform 0.05s linear' : 'transform 0.5s ease',
                }}
            >
                {/* Shadow div — painted first (behind shimmer wrapper), no overflow clip */}
                {
                    isVertical &&
                    <div
                        className="absolute left-1/2 top-1/2 w-[50%] h-[80%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full shadow-[0_0_100px_100px_var(--glow-color)]"/>
                } {
                !isVertical &&
                <div
                    className="absolute left-1/2 top-1/2 w-[50%] h-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full shadow-[0_0_100px_80px_var(--glow-color)]"/>
            }


                {/* Shimmer + card image */}
                <Link href={`/the/${card.id}`}
                      className="relative block group-hover:scale-105 transition-transform duration-300">
                    <CardImage card={card}/>
                </Link>
            </div>

            <div className="relative min-h-[80px]">
                {/* Text content — fades out on hover */}
                <div className="transition-opacity duration-150 group-hover:opacity-0">
                    <p className="font-medium text-slate-800 leading-tight">{card.name}</p>
                    {card.annual_fee !== undefined && (
                        <p className="text-sm text-slate-500">
                            {card.annual_fee === 0
                                ? t('free')
                                : `${card.annual_fee.toLocaleString()} ${card.currency ?? 'VND'}`}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                        <span
                            className="px-1.5 py-0.5 border border-dashed border-brand-blue text-brand-blue font-medium capitalize">
                            {card.card_network}{card.card_tier ? ` ${card.card_tier}` : ''}
                        </span>
                        {card.card_type.map((type) => (
                            <span key={type}
                                  className="px-1.5 py-0.5 border border-dashed border-slate-300 text-slate-500 capitalize">
                                {type}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Circle buttons — fade in on hover, left-aligned */}
                <div className="absolute inset-0 flex items-center justify-start gap-3">
                    {/* Bank button */}
                    <div
                        className="flex flex-col items-center gap-1 opacity-0 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0">
                        <Link
                            href={`/ngan-hang/${card.bank_id}`}
                            className="flex items-center justify-center size-10 rounded-full bg-white border border-dashed border-slate-300 shadow-sm text-slate-600 hover:border-brand-blue hover:text-brand-blue transition-all overflow-hidden"
                        >
                            {bank?.logo_url ? (
                                <img src={getBankImageUrl(bank.logo_url)} alt={bank.name}
                                     className="w-full h-full object-contain p-1.5"/>
                            ) : (
                                <Landmark className="size-4"/>
                            )}
                        </Link>
                        <span className="text-[10px] text-slate-500 text-center leading-tight">Xem ngân hàng</span>
                    </div>

                    {/* Card link button */}
                    {card.card_link && (
                        <div
                            className="flex flex-col items-center gap-1 opacity-0 translate-y-1 transition-all duration-150 delay-[80ms] group-hover:opacity-100 group-hover:translate-y-0">
                            <a
                                href={card.card_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center size-10 rounded-full bg-white border border-dashed border-slate-300 shadow-sm text-slate-600 hover:border-brand-blue hover:text-brand-blue transition-all"
                            >
                                <ExternalLink className="size-4"/>
                            </a>
                            <span className="text-[10px] text-slate-500 text-center leading-tight">Xem trang thẻ</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
