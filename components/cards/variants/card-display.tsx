'use client';

import Link from 'next/link';
import type {ReactNode} from 'react';
import {cn} from '@/lib/utils';
import {IconBuildingBank, IconExternalLink, IconScale} from '@tabler/icons-react';
import type {Card} from '@/lib/api';
import {normalizeCardTypes} from '@/lib/api';
import type {Bank} from '@/lib/api';
import {BankModel} from '@/lib/bank-model';
import {CardModel} from '@/lib/card-model';
import {OwCardImage} from '@/components/owui/ow-card-image';
import {OwBadge, OwBadges} from '@/components/owui/ow-badge';
import {OwAmount} from '@/components/owui/ow-amount';
import {useCompareList} from '@/lib/use-compare-list';

interface BadgeConfig {
    network?: boolean;
    type?: boolean;
    metal?: boolean;
    status?: boolean;
    fee?: boolean;
}

interface BaseProps {
    card: Card;
    bank?: Bank | null;
    badges?: BadgeConfig;
    className?: string;
}

interface TileProps extends BaseProps {
    variant: 'tile';
    href?: string;
    badge?: string;
    showActions?: boolean;
}

interface RowProps extends BaseProps {
    variant: 'row';
    slot?: ReactNode;
}

interface SlimProps extends BaseProps {
    variant: 'slim';
    showThumb?: boolean;
    asLink?: boolean;
}

interface InlineProps extends BaseProps {
    variant: 'inline';
    showLogo?: boolean;
    asLink?: boolean;
}

type Props = TileProps | RowProps | SlimProps | InlineProps;

export function CardDisplay(props: Props) {
    const {className} = props;

    if (props.variant === 'tile') {
        return <CardDisplayTile {...props} className={className} />;
    }
    if (props.variant === 'row') {
        return <CardDisplayRow {...props} className={className} />;
    }
    if (props.variant === 'slim') {
        return <CardDisplaySlim {...props} className={className} />;
    }
    return <CardDisplayInline {...props} className={className} />;
}

function CardDisplayTile({ card, bank: bankProp, badges = {}, href, badge, showActions = true, className }: Omit<TileProps, 'variant'>) {
    const model = new CardModel(card);
    const bankRaw = bankProp !== undefined ? bankProp : (card.bank_data ?? null);
    const bank = bankRaw ? new BankModel(bankRaw) : null;
    const isVertical = card.image?.orientation === 'vertical';
    const { isInCompare, toggleCompare, isFull } = useCompareList();
    const inCompare = isInCompare(card.id);

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
            className={cn("ow-card-display flex flex-col sm:gap-4 gap-3 group relative cursor-pointer", className)}
            style={{
                // @ts-ignore
                '--glow-color': bank?.getBrandColor() ? hexToRgba(bank.getBrandColor()!, 0.45) : 'rgba(0,0,0,0.45)',
            }}
        >
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
                    <OwCardImage card={card} tilt />
                </Link>
            </div>

            <div className="relative min-h-20">
                <div className="transition-opacity duration-150 group-hover:opacity-0 space-y-1">
                    <p className="heading-6 text-black">{card.name}</p>
                    {fee && card.fees?.annual != null && (
                        <p className="">
                            {card.fees.annual.amount > 0 ?
                            <OwAmount amount={card.fees.annual.amount} unit="vnd" period="year"/>
                                : <span className="text-green-500 text-sm">Miễn phí thường niên</span>
                            }
                        </p>
                    )}
                    <OwBadges className="mt-2">
                        {status && card.status === 'discontinued' && (
                            <OwBadge small variant="discontinued"/>
                        )}
                        {network && card.card_network_data &&
                            <OwBadge small variant="network" networkData={card.card_network_data}
                                     tier={card.card_tier}/>}
                        {type && normalizeCardTypes(card.card_type).map(t => <OwBadge small key={t} variant="card-type" cardType={t}/>)}
                        {metal && card.is_metal && <OwBadge small variant="metal"/>}
                    </OwBadges>
                </div>

                {showActions && (
                    <div className="absolute inset-0 flex items-center justify-start gap-3">
                        <div className="flex flex-col items-center gap-1 opacity-0 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0">
                            <Link
                                href={`/ngan-hang/${card.bank_id}`}
                                className="flex items-center justify-center size-10 rounded-full bg-white border border-dashed border-slate-300 shadow-sm text-slate-600 hover:border-brand-blue hover:text-brand-blue transition-all overflow-hidden"
                            >
                                {bank ? (
                                    <img src={bank.getLogoUrl()} alt={bank.getName()} className="w-full h-full object-contain p-1.5" />
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

                        <div className="flex flex-col items-center gap-1 opacity-0 translate-y-1 transition-all duration-150 delay-[160ms] group-hover:opacity-100 group-hover:translate-y-0">
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(card.id, { name: card.name, image_url: card.image?.url ?? null }); }}
                                disabled={isFull && !inCompare}
                                className={cn('flex items-center justify-center size-10 rounded-full bg-white border border-dashed shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed', inCompare ? 'border-primary text-primary' : 'border-slate-300 text-slate-600 hover:border-brand-blue hover:text-brand-blue')}
                                title={inCompare ? 'Bỏ so sánh' : 'So sánh'}
                            >
                                <IconScale className="size-4" />
                            </button>
                            <span className="text-[10px] text-slate-500 text-center leading-tight">So sánh</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CardDisplayRow({ card, bank, badges = {}, slot, className }: Omit<RowProps, 'variant'>) {
    const { network = true, type = true, metal = false, status = false } = badges;
    const isVertical = card.image?.orientation === 'vertical';

    return (
        <div className={cn("ow-card-display flex items-center gap-3", className)}>
            <div className="shrink-0 w-20">
                {isVertical ? (
                    <div className="h-20 flex justify-center items-center">
                        <OwCardImage card={card} className="h-full w-auto" />
                    </div>
                ) : (
                    <div className="w-full flex justify-center items-center">
                        <OwCardImage card={card} className="w-full" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-medium leading-tight truncate text-sm text-slate-900">{card.name}</p>
                <OwBadges className="mt-1">
                    {status && card.status === 'discontinued' && (
                        <OwBadge small variant="discontinued"/>
                    )}
                    {network && card.card_network_data &&
                        <OwBadge small variant="network" networkData={card.card_network_data} tier={card.card_tier}/>}
                    {type && normalizeCardTypes(card.card_type).map(t => <OwBadge small key={t} variant="card-type" cardType={t}/>)}
                    {metal && card.is_metal && <OwBadge small variant="metal"/>}
                </OwBadges>
            </div>

            {slot != null && <div className="shrink-0 flex items-center gap-2">{slot}</div>}
        </div>
    );
}

function CardDisplaySlim({ card, bank, badges = {}, showThumb = false, asLink = true, className }: Omit<SlimProps, 'variant'>) {
    const { network = true, type = false, fee = false } = badges;
    const isVertical = card.image?.orientation === 'vertical';

    const feeLabel = card.fees?.annual == null
        ? null
        : <OwAmount amount={card.fees.annual.amount} unit="vnd" textOnly period="year"/>;

    const content = (
        <>
            {showThumb && (
                isVertical ? (
                    <div className="w-24 h-20 shrink-0 flex items-center justify-center">
                        <OwCardImage card={card} className="h-full w-auto" />
                    </div>
                ) : (
                    <div className="w-24 shrink-0">
                        <OwCardImage card={card} />
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
                <OwBadges className="mt-1">
                    {card.status === 'discontinued' && (
                        <OwBadge small variant="discontinued"/>
                    )}
                    {network && card.card_network_data &&
                        <OwBadge small variant="network" networkData={card.card_network_data} tier={card.card_tier}/>}
                    {type && normalizeCardTypes(card.card_type).map(t => <OwBadge small key={t} variant="card-type" cardType={t}/>)}
                    {card.is_metal && <OwBadge small variant="metal"/>}
                </OwBadges>
            </div>
        </>
    );

    if (asLink) {
        return (
            <Link
                href={`/the/${card.id}`}
                className={cn("ow-card-display flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50/60 transition-colors group", className)}
            >
                {content}
            </Link>
        );
    }

    return <div className={cn("ow-card-display flex items-center gap-2.5", className)}>{content}</div>;
}

function CardDisplayInline({ card, badges = {}, showLogo = true, asLink = false, className }: Omit<InlineProps, 'variant'>) {
    const { network = true } = badges;

    const content = (
        <span className="inline-flex items-center gap-2">
            <span className="font-medium text-slate-800">{card.name}</span>
            {network && card.card_network_data &&
                <OwBadge variant="network" networkData={card.card_network_data} tier={card.card_tier}/>}
        </span>
    );

    if (asLink) {
        return (
            <Link href={`/the/${card.id}`} className={cn("ow-card-display hover:text-brand-blue transition-colors", className)}>
                {content}
            </Link>
        );
    }

    return <span className={cn("ow-card-display", className)}>{content}</span>;
}
