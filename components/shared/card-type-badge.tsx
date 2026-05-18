import type { CardType } from '@/lib/api';

const CARD_TYPE_LABELS: Record<CardType, string> = {
    credit: 'Tín dụng',
    debit: 'Ghi nợ',
    prepaid: 'Trả trước',
    '2in1': '2 trong 1',
    'co-branded': 'Đồng thương hiệu',
    atm: 'ATM',
    transit: 'Transit',
};

interface Props {
    type: CardType;
}

export function CardTypeBadge({ type }: Props) {
    return (
        <span className="ow-card-type-badge px-1.5 py-0.5 border border-dashed border-slate-300 text-slate-700 capitalize">
            {CARD_TYPE_LABELS[type] ?? type}
        </span>
    );
}

export function CardTypeBadges({ types }: { types: CardType[] }) {
    const isHybrid = types.includes('credit') && types.includes('debit');
    if (isHybrid) {
        const rest = types.filter((t) => t !== 'credit' && t !== 'debit');
        return (
            <>
                <span className="px-1.5 py-0.5 border border-dashed border-slate-300 text-slate-700">
                    Thẻ Hybrid
                </span>
                {rest.map((t) => <CardTypeBadge key={t} type={t} />)}
            </>
        );
    }
    return <>{types.map((t) => <CardTypeBadge key={t} type={t} />)}</>;
}
