import * as React from 'react';
import {cn} from '@/lib/utils';
import type {CardType, Network} from '@/lib/api';
import {getNetworkImageUrl} from '@/lib/api';
import {OwChip} from '@/components/ow-ui/ow-chip';

export const CARD_TYPE_LABELS: Record<CardType, string> = {
    credit: 'Thẻ tín dụng',
    debit: 'Thẻ ghi nợ',
    prepaid: 'Thẻ trả trước',
    '2in1': '2 trong 1',
    'co-branded': 'Đồng thương hiệu',
    atm: 'ATM',
    transit: 'Transit',
};

const NETWORK_STYLES: Record<string, string> = {
    visa: 'bg-[#2f35cb]/10 border-[#2f35cb]/30 text-[#2f35cb]',
    mastercard: 'bg-[#eb131a]/10 border-[#eb131a]/30 text-[#eb131a]',
    jcb: 'bg-[#336cba]/10 border-[#336cba]/30 text-[#336cba]',
    napas: 'bg-[#093f7d]/10 border-[#093f7d]/30 text-[#093f7d]',
    amex: 'bg-[#386fcf]/10 border-[#386fcf]/30 text-[#386fcf]',
    unionpay: 'bg-[#e31133]/10 border-[#e31133]/30 text-[#e31133]',
};

const NETWORK_IMG_HEIGHTS: Record<string, number> = {
    visa: 14,
    mastercard: 18,
    jcb: 20,
    napas: 18,
    amex: 16,
    unionpay: 18,
};

function OwCardBadgeNetwork({networkData, tier, asChild, className}: {
    networkData: Pick<Network, 'id' | 'name' | 'logo_url'>;
    tier?: string;
    asChild?: boolean;
    className?: string;
}) {
    const imgHeight = NETWORK_IMG_HEIGHTS[networkData.id] ?? 14;
    const networkStyle = NETWORK_STYLES[networkData.id] ?? 'bg-blue-50 border-blue-200 text-brand-blue';

    return (
        <OwChip size="sm" asChild={asChild}
                className={cn('ow-card-badge capitalize inline-flex items-center gap-2', networkStyle, className)}>

            <img src={getNetworkImageUrl(networkData.logo_url)} alt={networkData.name} style={{height: imgHeight}}
                 className="object-contain"/>
            {tier && <span className="uppercase font-display tracking-wider text-xs">{tier}</span>}

        </OwChip>
    );
}

function OwCardBadgeCardType({cardType, asChild, className, children}: {
    cardType?: CardType;
    asChild?: boolean;
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <OwChip size="sm" asChild={asChild} className={cn('ow-card-badge', className)}>
            {cardType ? (CARD_TYPE_LABELS[cardType] ?? cardType) : children}
        </OwChip>
    );
}

export function OwCardBadges({children, className}: { children: React.ReactNode; className?: string }) {
    return <div className={cn('ow-card-badges flex flex-wrap items-center gap-2', className)}>{children}</div>;
}

export type OwCardBadgeProps = {
    cardType?: CardType;
    networkData?: Pick<Network, 'id' | 'name' | 'logo_url'> | null;
    tier?: string;
    asChild?: boolean;
    className?: string;
    children?: React.ReactNode;
};

export function OwCardBadge({networkData, cardType, tier, asChild, className, children}: OwCardBadgeProps) {
    if (networkData) {
        return <OwCardBadgeNetwork networkData={networkData} tier={tier} asChild={asChild}
                                   className={className}/>;
    }
    return <OwCardBadgeCardType cardType={cardType} asChild={asChild}
                                className={className}>{children}</OwCardBadgeCardType>;
}
