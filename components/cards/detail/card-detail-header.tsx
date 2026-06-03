import type {Bank} from '@/lib/api';
import {normalizeCardTypes} from '@/lib/api';
import type {CardModel} from '@/lib/card-model';
import {CoBrandDisplay} from '@/components/cards/co-brand-display';
import {OwBankImage} from '@/components/ow-ui/ow-bank-image';
import {OwBadge, OwBadges} from '@/components/ow-ui/ow-badge';

interface Props {
    card: CardModel;
    bank: Bank | null;
}

export function CardDetailHeader({ card, bank }: Props) {
    const contactlessMethods = card.getContactlessMethods();
    const coBrand = card.getCoBrand();
    const coBrandData = card.getCoBrandData();

    return (
        <div className="ow-card-detail-header flex flex-col items-start gap-3">
            {bank && <OwBankImage className="h-6 w-auto" bank={bank} href={`/ngan-hang/${bank.id}`} />}

            <h1>{card.getName()}</h1>

            <div className="flex flex-wrap gap-1.5">
                {card.getStatus() === 'discontinued' && (
                    <OwBadge small variant="discontinued"/>
                )}
                <OwBadges>
                    {card.getNetworkData() && <OwBadge variant="network" networkData={card.getNetworkData()!} tier={card.getCardTier()}/>}
                    {normalizeCardTypes(card.getCardTypes()).map(t => <OwBadge key={t} variant="card-type" cardType={t}/>)}
                    {contactlessMethods.length > 0 && (
                        <>
                            {contactlessMethods.map((method) => (
                                <OwBadge key={method.id} variant="contactless" contactlessData={method}/>
                            ))}
                        </>
                    )}
                </OwBadges>
                {card.isMetal() && <OwBadge variant="metal"/>}
            </div>

            {coBrand && (
                <div className="flex items-center gap-2 text-body-sm">
                    <span className="text-text-muted">Co-brand:</span>
                    {coBrandData
                        ? <CoBrandDisplay brand={coBrandData} fallback={coBrand} />
                        : <span className="text-text-primary">{coBrand}</span>
                    }
                </div>
            )}
        </div>
    );
}
