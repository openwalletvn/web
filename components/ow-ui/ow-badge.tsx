import * as React from 'react';
import {Slot as SlotPrimitive} from 'radix-ui';
const {Slottable} = SlotPrimitive;
import {cn, hexToRgba} from '@/lib/utils';
import type {CardType, Contactless, Network, Persona} from '@/lib/api';
import {getNetworkImageUrl, getWalletImageUrl, isHybridCard} from '@/lib/api';
import {
    CARD_TYPE_HEX,
    CARD_TYPE_ICON,
    CARD_TYPE_LABELS,
    CARD_TYPE_SLUGS,
    type CardTypeIconComponent
} from '@/lib/card-model';
import {ROUTES} from '@/lib/routes';
import {INTENT_HEX} from '@/lib/intent-model';
import {PersonaIcon, PersonaModel} from '@/lib/persona-model';

// ─── Utilities ────────────────────────────────────────────────────────────────

const COLOR_CLS = 'bg-[var(--badge-bg)] border-[var(--badge-border)] text-[var(--badge-color)] [&:is(button,a)]:hover:border-[var(--badge-border-hover)]';

function colorVars(hex: string, bgAlpha: number, borderAlpha: number): React.CSSProperties {
    return {
        '--badge-bg': hexToRgba(hex, bgAlpha),
        '--badge-border': hexToRgba(hex, borderAlpha),
        '--badge-color': hex,
        '--badge-border-hover': hex,
    } as React.CSSProperties;
}

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

// ─── Base styles ──────────────────────────────────────────────────────────────

const BASE_CLS = [
    'ow-badge inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap',
    'rounded-[52px] border font-medium leading-[1.3]',
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&:is(button,a)]:cursor-pointer',
].join(' ');

const SIZE_CLS = {
    default: 'min-h-[30px] px-3 py-1 text-sm max-sm:min-h-[22px] max-sm:px-2 max-sm:py-0.5 max-sm:text-xs',
    small: 'min-h-[22px] px-2 py-0.5 text-xs',
};

// ─── Shell ────────────────────────────────────────────────────────────────────

type ShellProps = {
    asChild?: boolean;
    slotChild?: React.ReactElement;
    active?: boolean;
    small?: boolean;
    style?: React.CSSProperties;
    className?: string;
    onClick?: React.MouseEventHandler;
    href?: string;
    children: React.ReactNode;
};

function BadgeShell({
                        asChild = false,
                        slotChild,
                        active = false,
                        small = false,
                        style,
                        className,
                        onClick,
                        href,
                        children
                    }: ShellProps) {
    const sizeCls = SIZE_CLS[small ? 'small' : 'default'];
    const smallCls = small ? 'ow-badge-small' : '';
    const sharedProps = {
        'data-active': active,
        style,
        onClick,
        className: cn(BASE_CLS, sizeCls, smallCls, className),
    };

    if (asChild && slotChild) {
        // Merge onto caller's element; badge content rendered as siblings via Slottable
        return (
            <SlotPrimitive.Root {...sharedProps}>
                {children}
                <Slottable>{slotChild}</Slottable>
            </SlotPrimitive.Root>
        );
    }

    const Comp = href ? 'a' : onClick ? 'button' : 'span';
    return (
        <Comp {...sharedProps} href={href}>
            {children}
        </Comp>
    );
}

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
    icon?: CardTypeIconComponent | string;
        children?: React.ReactNode;
    })
    | (BaseProps & {
        variant: 'contactless';
        contactlessData: Pick<Contactless, 'id' | 'name' | 'logo_url'>;
    })
    | (BaseProps & {
    variant: 'persona';
    personaData: Persona;
    children?: React.ReactNode;
})
    | (BaseProps & { variant: 'discontinued' })
    | (BaseProps & { variant: 'metal' })
    | (BaseProps & {
        variant?: never;
        colorHex?: string;
        children?: React.ReactNode;
    });

// ─── Component ────────────────────────────────────────────────────────────────

export function OwBadge(props: OwBadgeProps) {
    const {active = false, asChild = false, className, onClick, small = false} = props;
    const slotChild = asChild && 'children' in props ? props.children as React.ReactElement : undefined;

    if (props.variant === 'intent') {
        const {slug, emoji, label, rate, highlighted = false, colorHex} = props;
        const hex = colorHex ?? INTENT_HEX[slug] ?? null;
        const style = hex ? {
            ...colorVars(hex, active ? 1 : highlighted ? 0.2 : 0.1, active ? 1 : highlighted ? 0.5 : 0.3),
            ...(active ? {'--badge-color': 'white'} as React.CSSProperties : {}),
        } : {};
        const colorCls = hex ? COLOR_CLS : 'bg-bg-muted border-border text-text-muted opacity-50';
        const rateStr = rate !== undefined
            ? ` ${(rate * 100).toFixed(rate * 100 % 1 === 0 ? 0 : 1)}%`
            : '';
        return (
            <BadgeShell active={active} asChild={asChild} slotChild={slotChild} small={small} style={style}
                        className={cn(colorCls, className)} onClick={onClick}>
                {emoji} {label}{rateStr}
            </BadgeShell>
        );
    }

    if (props.variant === 'network') {
        const {networkData, tier} = props;
        const hex = NETWORK_HEX[networkData.id] ?? '#3b82f6';
        const imgHeight = NETWORK_IMG_HEIGHTS[networkData.id] ?? 14;
        const style = colorVars(hex, active ? 0.2 : 0.1, active ? 0.5 : 0.3);
        return (
            <BadgeShell active={active} asChild={asChild} slotChild={slotChild} small={small} style={style}
                        className={cn(COLOR_CLS, className)} onClick={onClick}>
                <img src={getNetworkImageUrl(networkData.logo_url)} alt={networkData.name}
                     style={{height: imgHeight}} className="object-contain"/>
                {tier && <span className="uppercase font-display tracking-wider text-xs">{tier}</span>}
            </BadgeShell>
        );
    }

    if (props.variant === 'contactless') {
        const {contactlessData} = props;
        const style = {
            ...colorVars('#64748b', active ? 0.2 : 0.08, active ? 0.5 : 0.2),
            '--badge-color': '#475569',
        } as React.CSSProperties;
        return (
            <BadgeShell active={active} asChild={asChild} slotChild={slotChild} small={small} style={style}
                        className={cn(COLOR_CLS, className)} onClick={onClick}>
                <img src={getWalletImageUrl(contactlessData.logo_url)} alt={contactlessData.name}
                     style={{height: small ? 12 : 16}} className="object-contain mix-blend-multiply dark:mix-blend-screen"/>
            </BadgeShell>
        );
    }

    if (props.variant === 'card-type') {
        const {cardTypes, icon, children} = props;
        const cardType = cardTypes
            ? (isHybridCard(cardTypes) ? 'hybrid' : cardTypes[0])
            : props.cardType;
        const resolvedIcon = icon ?? (cardType ? CARD_TYPE_ICON[cardType] : undefined);
        const hex = cardType ? CARD_TYPE_HEX[cardType] : undefined;
        const style = hex && !active ? colorVars(hex, 0.1, 0.3) : {};
        const typeSlug = cardType ? CARD_TYPE_SLUGS[cardType] : undefined;
        const href = typeSlug ? ROUTES.cardTypePage(typeSlug) : undefined;
        const renderIcon = () => {
            if (!resolvedIcon) return null;
            if (typeof resolvedIcon === 'string') return <span>{resolvedIcon}</span>;
            const Icon = resolvedIcon;
            return <Icon size={14}/>;
        };
        return (
            <BadgeShell active={active} asChild={asChild} slotChild={slotChild} small={small} style={style} href={href}
                        className={cn(
                            active && 'bg-primary border-primary text-white',
                            !active && hex && COLOR_CLS,
                            !active && !hex && 'bg-[#EDEFEC] border-[#D3D3D3] text-foreground',
                            !active && !hex && '[&:is(button,a)]:hover:border-primary',
                            className)} onClick={onClick}>
                {renderIcon()}
                {cardType ? (CARD_TYPE_LABELS[cardType] ?? cardType) : (!asChild && children)}
            </BadgeShell>
        );
    }

    if (props.variant === 'persona') {
        const {personaData} = props;
        const model = new PersonaModel(personaData);
        const hex = model.getColor();
        const style = hex ? {
            ...colorVars(hex, active ? 1 : 0.1, active ? 1 : 0.3),
            ...(active ? {'--badge-color': 'white'} as React.CSSProperties : {}),
        } : {};
        const colorCls = hex ? COLOR_CLS : 'bg-bg-muted border-border text-text-muted';
        return (
            <BadgeShell active={active} asChild={asChild} slotChild={slotChild} small={small} style={style}
                        className={cn(colorCls, className)} onClick={onClick}>
                <PersonaIcon slug={personaData.slug} size={14}/>
                {model.getDisplayLabel()}
            </BadgeShell>
        );
    }

    if (props.variant === 'discontinued') {
        return (
            <BadgeShell active={active} asChild={asChild} slotChild={slotChild} small={small} onClick={onClick}
                        className={cn('border-dashed bg-amber-50 border-amber-400 text-amber-600', className)}>
                💤 Dừng phát hành
            </BadgeShell>
        );
    }

    if (props.variant === 'metal') {
        return (
            <BadgeShell active={active} asChild={asChild} slotChild={slotChild} small={small} onClick={onClick}
                        className={cn('bg-gradient-to-r from-slate-200 via-white to-slate-300 border-slate-300 text-slate-600', className)}>
                <span className="uppercase font-display tracking-wider text-xs">Thẻ kim loại</span>
            </BadgeShell>
        );
    }

    // default
    const {colorHex, children} = props as Extract<OwBadgeProps, {variant?: never}>;
    const style = colorHex ? colorVars(colorHex, active ? 0.2 : 0.1, active ? 0.5 : 0.3) : {};
    return (
        <BadgeShell active={active} asChild={asChild} slotChild={slotChild} small={small} style={style} onClick={onClick}
                    className={cn(
                        colorHex && COLOR_CLS,
                        !colorHex && active && 'bg-primary border-primary text-white',
                        !colorHex && !active && 'bg-[#EDEFEC] border-[#D3D3D3] text-foreground',
                        !colorHex && '[&:is(button,a)]:hover:bg-primary/10 [&:is(button,a)]:hover:border-primary [&:is(button,a)]:hover:text-primary',
                        className)}>
            {!asChild && children}
        </BadgeShell>
    );
}

// ─── Wrapper ──────────────────────────────────────────────────────────────────

export function OwBadges({children, className}: {children: React.ReactNode; className?: string}) {
    return <div className={cn('ow-badges flex flex-wrap items-center sm:gap-2 gap-1 has-[.ow-badge-small]:gap-1', className)}>{children}</div>;
}
