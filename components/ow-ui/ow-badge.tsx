import * as React from 'react';
import {Slot as SlotPrimitive} from 'radix-ui';
import {cn} from '@/lib/utils';
import type {CardType, Contactless, Network} from '@/lib/api';
import {getNetworkImageUrl, getWalletImageUrl, isHybridCard} from '@/lib/api';
import {IconCashBanknoteFilled, IconCreditCardFilled, IconTrainFilled, IconYinYangFilled,} from '@tabler/icons-react';

// ─── Utilities ────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Intent config ────────────────────────────────────────────────────────────

const INTENT_HEX: Record<string, string> = {
    shopee: '#9333ea', lazada: '#9333ea', 'tiktok-shop': '#9333ea', tiki: '#9333ea', ecommerce: '#9333ea',
    grab: '#0ea5e9', transport: '#0ea5e9',
    dining: '#f97316',
    'vietnam-airlines': '#3b82f6', 'bamboo-airways': '#3b82f6', agoda: '#3b82f6', travel: '#3b82f6',
    groceries: '#22c55e',
    shopping: '#ec4899', fashion: '#ec4899', books: '#ec4899',
    digital: '#6366f1', ads: '#6366f1', telecom: '#6366f1',
    cinema: '#8b5cf6', entertainment: '#8b5cf6',
    health: '#f43f5e',
    insurance: '#14b8a6',
    education: '#84cc16',
    golf: '#f59e0b',
    pets: '#f59e0b',
};

// ─── Network config ───────────────────────────────────────────────────────────

const NETWORK_HEX: Record<string, string> = {
    visa: '#2f35cb',
    mastercard: '#eb131a',
    jcb: '#336cba',
    napas: '#093f7d',
    amex: '#386fcf',
    unionpay: '#e31133',
};

const NETWORK_IMG_HEIGHTS: Record<string, number> = {
    visa: 14, mastercard: 18, jcb: 20, napas: 18, amex: 16, unionpay: 18,
};

// ─── Card type config ─────────────────────────────────────────────────────────

export const CARD_TYPE_LABELS: Record<CardType, string> = {
    credit: 'Thẻ tín dụng',
    debit: 'Thẻ ghi nợ',
    prepaid: 'Thẻ trả trước',
    '2in1': 'Thẻ hybrid',
    'co-branded': 'Đồng thương hiệu',
    atm: 'ATM',
    transit: 'Transit',
};

type IconComponent = React.ComponentType<{size?: number; className?: string}>;

const CARD_TYPE_ICON: Partial<Record<CardType, IconComponent>> = {
    credit: IconCreditCardFilled,
    debit: IconCashBanknoteFilled,
    '2in1': IconYinYangFilled,
    transit: IconTrainFilled,
};

const CARD_TYPE_HEX: Partial<Record<CardType, string>> = {
    credit: '#3b82f6',
    debit: '#22c55e',
    '2in1': '#8b5cf6',
    transit: '#f97316',
};

// ─── Base styles ──────────────────────────────────────────────────────────────

const BASE_CLS = [
    'ow-badge inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap',
    'rounded-[52px] border font-medium leading-[1.3]',
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&:is(button,a)]:cursor-pointer',
].join(' ');

const SIZE_CLS = {
    default: 'min-h-[30px] px-3 py-1 text-sm',
    small: 'min-h-[22px] px-2 py-0.5 text-xs',
};

// ─── Types ────────────────────────────────────────────────────────────────────

type BaseProps = {
    active?: boolean;
    asChild?: boolean;
    className?: string;
    onClick?: React.MouseEventHandler;
    small?: boolean;
};

export type OwBadgeProps =
    | (BaseProps & {
        variant: 'intent';
        slug: string;
        emoji: string;
        label: string;
        rate?: number;
        highlighted?: boolean;
        colorHex?: string;
    })
    | (BaseProps & {
        variant: 'network';
        networkData: Pick<Network, 'id' | 'name' | 'logo_url'>;
        tier?: string;
    })
    | (BaseProps & {
        variant: 'card-type';
        cardTypes?: CardType[];
        cardType?: CardType;
        icon?: IconComponent | string;
        children?: React.ReactNode;
    })
    | (BaseProps & {
        variant: 'contactless';
        contactlessData: Pick<Contactless, 'id' | 'name' | 'logo_url'>;
    })
    | (BaseProps & { variant: 'metal' })
    | (BaseProps & {
        variant?: never;
        colorHex?: string;
        children?: React.ReactNode;
    });

// ─── Component ────────────────────────────────────────────────────────────────

export function OwBadge(props: OwBadgeProps) {
    const {active = false, asChild = false, className, onClick, small = false} = props;
    const sizeCls = SIZE_CLS[small ? 'small' : 'default'];
    const smallCls = small ? 'ow-badge-small' : '';

    if (props.variant === 'intent') {
        const {slug, emoji, label, rate, highlighted = false, colorHex} = props;
        const hex = colorHex ?? INTENT_HEX[slug] ?? null;
        const alpha = highlighted ? 0.2 : 0.1;
        const borderAlpha = highlighted ? 0.5 : 0.3;
        const style: React.CSSProperties = hex ? {
            backgroundColor: hexToRgba(hex, alpha),
            borderColor: hexToRgba(hex, borderAlpha),
            color: hex,
        } : {};
        const fallbackCls = hex ? '' : 'bg-bg-muted border-border text-text-muted opacity-50';
        const rateStr = rate !== undefined
            ? ` ${(rate * 100).toFixed(rate * 100 % 1 === 0 ? 0 : 1)}%`
            : '';
        return (
            <span data-active={active} style={style} onClick={onClick}
                  className={cn(BASE_CLS, sizeCls, smallCls, fallbackCls, className)}>
                {emoji} {label}{rateStr}
            </span>
        );
    }

    if (props.variant === 'network') {
        const {networkData, tier} = props;
        const hex = NETWORK_HEX[networkData.id] ?? '#3b82f6';
        const imgHeight = NETWORK_IMG_HEIGHTS[networkData.id] ?? 14;
        const style: React.CSSProperties = {
            backgroundColor: hexToRgba(hex, active ? 0.2 : 0.1),
            borderColor: hexToRgba(hex, active ? 0.5 : 0.3),
            color: hex,
        };
        return (
            <span data-active={active} style={style} onClick={onClick}
                  className={cn(BASE_CLS, sizeCls, smallCls, className)}>
                <img src={getNetworkImageUrl(networkData.logo_url)} alt={networkData.name}
                     style={{height: imgHeight}} className="object-contain"/>
                {tier && <span className="uppercase font-display tracking-wider text-xs">{tier}</span>}
            </span>
        );
    }

    if (props.variant === 'contactless') {
        const {contactlessData} = props;
        const style: React.CSSProperties = {
            backgroundColor: hexToRgba('#64748b', active ? 0.2 : 0.08),
            borderColor: hexToRgba('#64748b', active ? 0.5 : 0.2),
            color: '#475569',
        };
        return (
            <span data-active={active} style={style} onClick={onClick}
                  className={cn(BASE_CLS, sizeCls, smallCls, className)}>
                <img src={getWalletImageUrl(contactlessData.logo_url)} alt={contactlessData.name}
                     style={{height: small ? 12 : 16}} className="object-contain mix-blend-multiply dark:mix-blend-screen"/>
                {/*{contactlessData.name}*/}
            </span>
        );
    }

    if (props.variant === 'card-type') {
        const {cardTypes, icon, children} = props;
        const cardType = cardTypes
            ? (isHybridCard(cardTypes) ? '2in1' : cardTypes[0])
            : props.cardType;
        const resolvedIcon = icon ?? (cardType ? CARD_TYPE_ICON[cardType] : undefined);
        const hex = cardType ? CARD_TYPE_HEX[cardType] : undefined;
        const hasIcon = !!resolvedIcon;
        const style: React.CSSProperties = active
            ? {backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: '#fff'}
            : hex
            ? {backgroundColor: hexToRgba(hex, 0.1), borderColor: hexToRgba(hex, 0.3), color: hex}
            : {};
        const renderIcon = () => {
            if (!hasIcon) return null;
            if (typeof resolvedIcon === 'string') return <span>{resolvedIcon}</span>;
            const Icon = resolvedIcon;
            return <Icon size={14}/>;
        };
        return (
            <span data-active={active} style={style} onClick={onClick}
                  className={cn(BASE_CLS, sizeCls, smallCls,
                      !active && !hex && 'bg-[#EDEFEC] border-[#D3D3D3] text-foreground',
                      '[&:is(button,a)]:hover:bg-primary/10 [&:is(button,a)]:hover:border-primary [&:is(button,a)]:hover:text-primary',
                      className)}>
                {renderIcon()}
                {cardType ? (CARD_TYPE_LABELS[cardType] ?? cardType) : children}
            </span>
        );
    }

    if (props.variant === 'metal') {
        return (
            <span data-active={active} onClick={onClick}
                  className={cn(BASE_CLS, sizeCls, smallCls,
                      'bg-gradient-to-r from-slate-200 via-white to-slate-300 border-slate-300 text-slate-600',
                      className)}>
                Kim loại
            </span>
        );
    }

    // default — generic badge with optional colorHex or active state; supports asChild
    const Comp = asChild ? SlotPrimitive.Root : 'span';
    const {colorHex, children} = props as Extract<OwBadgeProps, {variant?: never}>;
    const style: React.CSSProperties = colorHex ? {
        backgroundColor: hexToRgba(colorHex, active ? 0.2 : 0.1),
        borderColor: hexToRgba(colorHex, active ? 0.5 : 0.3),
        color: colorHex,
    } : active ? {
        backgroundColor: 'var(--color-primary)',
        borderColor: 'var(--color-primary)',
        color: '#fff',
    } : {};
    return (
        <Comp data-active={active} style={style} onClick={onClick}
              className={cn(BASE_CLS, sizeCls, smallCls,
                  !colorHex && !active && 'bg-[#EDEFEC] border-[#D3D3D3] text-foreground',
                  !colorHex && '[&:is(button,a)]:hover:bg-primary/10 [&:is(button,a)]:hover:border-primary [&:is(button,a)]:hover:text-primary',
                  className)}>
            {children}
        </Comp>
    );
}

// ─── Wrapper ──────────────────────────────────────────────────────────────────

export function OwBadges({children, className}: {children: React.ReactNode; className?: string}) {
    return <div className={cn('ow-badges flex flex-wrap items-center gap-2 has-[.ow-badge-small]:gap-1', className)}>{children}</div>;
}
