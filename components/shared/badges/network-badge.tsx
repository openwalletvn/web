import type { Card } from '@/lib/api';
import { getNetworkImageUrl } from '@/lib/api';

interface Props {
    card: Pick<Card, 'card_network' | 'card_tier' | 'card_network_data'>;
    size?: 'sm' | 'md';
    variant?: 'full' | 'slim';
}

export function NetworkBadge({ card, size = 'sm', variant = 'full' }: Props) {
    const label = `${card.card_network}${card.card_tier ? ` ${card.card_tier}` : ''}`;
    const logoUrl = card.card_network_data?.logo_url;
    const imgHeight = size === 'sm' ? 14 : 18;

    if (variant === 'slim') {
        if (logoUrl) {
            return (
                <img src={getNetworkImageUrl(logoUrl)} alt={label} style={{ height: imgHeight }} className="ow-network-badge object-contain" />
            );
        }
        return (
            <span className="ow-network-badge text-[10px] font-medium text-slate-500 capitalize">{label}</span>
        );
    }

    return (
        <span className="ow-network-badge inline-flex items-center gap-1 px-1.5 py-0.5 border border-dashed border-brand-blue text-brand-blue font-medium capitalize">
            {logoUrl && (
                <img src={getNetworkImageUrl(logoUrl)} alt="" style={{ height: imgHeight }} className="object-contain" />
            )}
            {label}
        </span>
    );
}
