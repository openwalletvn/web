import Link from 'next/link';
import type {Bank, Card} from '@/lib/api';
import {CardDisplay} from '@/components/cards/variants/card-display';
import {OwButton} from '@/components/owui/ow-button';
import {ROUTES} from '@/lib/routes';

interface Props {
    cards: Card[];
    banks: Bank[];
    totalCount: number;
}

export function CardsCatalogTeaser({cards, banks, totalCount}: Props) {
    const bankMap = new Map(banks.map((b) => [b.id, b]));
    const displayed = cards.slice(0, 12);

    return (
        <div className="ow-cards-catalog-teaser">
            <div className="mb-6">
                <h2>{totalCount}+ thẻ ngân hàng</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {displayed.map((card) => (
                    <CardDisplay
                        key={card.id}
                        variant="tile"
                        card={card}
                        bank={bankMap.get(card.bank_id) ?? null}
                        badges={{network: true, type: false, metal: true, status: false, fee: false}}
                    />
                ))}
            </div>
            <div className="mt-6 flex justify-center">
                <OwButton asChild color="outline">
                    <Link href={ROUTES.cards}>Xem tất cả {totalCount} thẻ →</Link>
                </OwButton>
            </div>
        </div>
    );
}
