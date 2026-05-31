import type { Card, Bank } from '@/lib/api';
import { MetalBadge } from '@/components/shared/badges/metal-badge';
import { CoBrandDisplay } from '@/components/cards/co-brand-display';
import { OwBankImage } from '@/components/ow-ui/ow-bank-image';
import { OwBadge, OwBadges } from '@/components/ow-ui/ow-badge';
import { ContactlessBadge } from '@/components/shared/badges/contactless-badge';

interface Props {
    card: Card;
    bank: Bank | null;
}

export function CardDetailHeader({ card, bank }: Props) {
    return (
        <div className="ow-card-detail-header flex flex-col items-start gap-3">
            {bank && <OwBankImage className="h-6 w-auto" bank={bank} href={`/ngan-hang/${bank.id}`} />}

            <h1>{card.name}</h1>

            <div className="flex flex-wrap gap-1.5">
                {card.status === 'discontinued' && (
                    <span className="px-1.5 py-0.5 border border-dashed border-amber-400 text-amber-600 bg-amber-50 text-[11px]">
                        Dừng phát hành
                    </span>
                )}
                <OwBadge variant="network" networkData={card.card_network_data} tier={card.card_tier}/>
                <OwBadges>{card.card_type.map(t => <OwBadge key={t} variant="card-type" cardType={t}/>)}</OwBadges>
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
