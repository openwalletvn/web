import type { Card } from '@/lib/api';

interface Props {
    cardA: Card;
    cardB: Card;
}

const CARD_TYPE_LABELS: Record<string, string> = {
    credit: 'Tín dụng',
    debit: 'Ghi nợ',
    prepaid: 'Trả trước',
    '2in1': '2 trong 1',
    'co-branded': 'Đồng thương hiệu',
    atm: 'ATM',
    transit: 'Transit',
};

function formatFee(fee?: { amount: number; type: string } | null): string {
    if (fee == null) return '—';
    if (fee.amount === 0) return 'Miễn phí';
    if (fee.type === 'rate') return `${fee.amount}%`;
    return `${fee.amount.toLocaleString('vi-VN')} VNĐ/năm`;
}

function formatBool(val?: boolean): string {
    if (val === true) return 'Có';
    if (val === false) return 'Không';
    return '—';
}

export function CompareTable({ cardA, cardB }: Props) {
    const rows = [
        {
            label: 'Mạng thanh toán',
            a: cardA.card_network?.toUpperCase() ?? '—',
            b: cardB.card_network?.toUpperCase() ?? '—',
        },
        {
            label: 'Hạng thẻ',
            a: cardA.card_tier ?? '—',
            b: cardB.card_tier ?? '—',
        },
        {
            label: 'Loại thẻ',
            a: cardA.card_type.map((t) => CARD_TYPE_LABELS[t] ?? t).join(', '),
            b: cardB.card_type.map((t) => CARD_TYPE_LABELS[t] ?? t).join(', '),
        },
        {
            label: 'Phí thường niên',
            a: formatFee(cardA.fees?.annual),
            b: formatFee(cardB.fees?.annual),
        },
        {
            label: 'Phí giao dịch ngoại tệ',
            a: formatFee(cardA.fees?.foreign),
            b: formatFee(cardB.fees?.foreign),
        },
        {
            label: 'Ngày miễn lãi',
            a: cardA.interest_free_days ? `${cardA.interest_free_days} ngày` : '—',
            b: cardB.interest_free_days ? `${cardB.interest_free_days} ngày` : '—',
        },
        {
            label: 'Thẻ kim loại',
            a: formatBool(cardA.is_metal),
            b: formatBool(cardB.is_metal),
        },
        {
            label: 'Dành cho doanh nghiệp',
            a: formatBool(cardA.for_business),
            b: formatBool(cardB.for_business),
        },
    ];

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b border-dashed border-slate-200">
                        <th className="text-left py-3 pr-4 text-slate-500 font-medium w-1/3">Tiêu chí</th>
                        <th className="text-left py-3 px-4 text-slate-900 font-semibold w-1/3">{cardA.name}</th>
                        <th className="text-left py-3 px-4 text-slate-900 font-semibold w-1/3">{cardB.name}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.label} className="border-b border-dashed border-slate-100">
                            <td className="py-3 pr-4 text-slate-500">{row.label}</td>
                            <td className="py-3 px-4 text-slate-800">{row.a}</td>
                            <td className="py-3 px-4 text-slate-800">{row.b}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
