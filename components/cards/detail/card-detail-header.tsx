import type { Card, Bank } from '@/lib/api';
import { MetalBadge } from '@/components/shared/badges/metal-badge';
import { CoBrandDisplay } from '@/components/cards/co-brand-display';
import { BankDisplay } from '@/components/shared/badges/bank-display';
import { OwCardBadge, OwCardBadges } from '@/components/ow-ui/ow-card-badge';
import { ContactlessBadge } from '@/components/shared/badges/contactless-badge';

interface Props {
    card: Card;
    bank: Bank | null;
}

export function CardDetailHeader({ card, bank }: Props) {
    return (
        <div className="ow-card-detail-header flex flex-col gap-3">
            {bank && <BankDisplay bank={bank} asLink />}

            <h1>{card.name}</h1>

            <div className="flex flex-wrap gap-1.5">
                {card.status === 'discontinued' && (
                    <span className="px-1.5 py-0.5 border border-dashed border-amber-400 text-amber-600 bg-amber-50 text-[11px]">
                        Dừng phát hành
                    </span>
                )}
                <OwCardBadge networkData={card.card_network_data} tier={card.card_tier}/>
                <OwCardBadges>{card.card_type.map(t => <OwCardBadge key={t} cardType={t}/>)}</OwCardBadges>
                {card.is_metal && <MetalBadge />}
            </div>

            {card.co_brand && (
                <div className="flex items-center gap-2 text-body-sm">
                    <span className="text-text-muted">Co-brand:</span>
                    {card.co_brand_data
                        ? <CoBrandDisplay brand={card.co_brand_data} fallback={card.co_brand} />
                        : <span className="text-text-primary">{card.co_brand}</span>
                    }
                </div>
            )}

            {card.contactless_methods_data && card.contactless_methods_data.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {card.contactless_methods_data.map((method) => (
                        <ContactlessBadge key={method.id} method={method} />
                    ))}
                </div>
            )}
        </div>
    );
}
