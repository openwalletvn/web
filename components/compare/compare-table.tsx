import Link from 'next/link';
import {
    IconBuildingBank,
    IconCreditCard,
    IconCategory,
    IconCash,
    IconCurrencyDollar,
    IconWifi,
    IconCalendar,
    IconStar,
} from '@tabler/icons-react';
import type { Card } from '@/lib/api';
import { CompareDueDateRow } from './compare-due-date-row';

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

// ─── Row component ────────────────────────────────────────────────────────────

interface CompareRowProps {
    icon: React.ReactNode;
    label: string;
    valA: React.ReactNode;
    valB: React.ReactNode;
    same?: boolean;
}

function CompareRow({ icon, label, valA, valB, same }: CompareRowProps) {
    const valueClass = same ? 'text-slate-400' : 'text-slate-800';
    return (
        <div className="py-6 border-b border-slate-100 last:border-0">
            <div className="flex items-center justify-center gap-1.5 mb-4 text-slate-400">
                {icon}
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
            </div>
            <div className="grid grid-cols-2">
                <div className={`text-center text-lg font-semibold ${valueClass}`}>{valA}</div>
                <div className={`text-center text-lg font-semibold ${valueClass}`}>{valB}</div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CompareTable({ cardA, cardB }: Props) {
    const purelyDebit = (c: Card) => c.card_type.every((t) => t === 'debit' || t === 'atm');
    const showCreditRows = !purelyDebit(cardA) || !purelyDebit(cardB);

    const bankA = cardA.bank_data?.name ?? cardA.bank_id;
    const bankB = cardB.bank_data?.name ?? cardB.bank_id;

    const networkA = [cardA.card_network.toUpperCase(), cardA.card_tier].filter(Boolean).join(' · ');
    const networkB = [cardB.card_network.toUpperCase(), cardB.card_tier].filter(Boolean).join(' · ');

    const typeA = cardA.card_type.map((t) => CARD_TYPE_LABELS[t] ?? t).join(', ');
    const typeB = cardB.card_type.map((t) => CARD_TYPE_LABELS[t] ?? t).join(', ');

    const annualA = formatFee(cardA.fees?.annual);
    const annualB = formatFee(cardB.fees?.annual);

    const foreignA = formatFee(cardA.fees?.foreign);
    const foreignB = formatFee(cardB.fees?.foreign);

    const contactlessA = cardA.contactless_methods_data?.map((m) => m.name).join(', ')
        ?? cardA.contactless_methods?.join(', ')
        ?? '—';
    const contactlessB = cardB.contactless_methods_data?.map((m) => m.name).join(', ')
        ?? cardB.contactless_methods?.join(', ')
        ?? '—';

    const statementA = cardA.statement_date ? `Ngày ${cardA.statement_date}` : '—';
    const statementB = cardB.statement_date ? `Ngày ${cardB.statement_date}` : '—';

    const daysA = cardA.interest_free_days ? `${cardA.interest_free_days} ngày` : '—';
    const daysB = cardB.interest_free_days ? `${cardB.interest_free_days} ngày` : '—';

    return (
        <div>
            {/* Rows */}
            <CompareRow
                icon={<IconBuildingBank size={13} />}
                label="Ngân hàng"
                valA={<Link href={`/ngan-hang/${cardA.bank_id}`} className="hover:text-brand-blue transition-colors">{bankA}</Link>}
                valB={<Link href={`/ngan-hang/${cardB.bank_id}`} className="hover:text-brand-blue transition-colors">{bankB}</Link>}
                same={cardA.bank_id === cardB.bank_id}
            />
            <CompareRow
                icon={<IconStar size={13} />}
                label="Mạng lưới"
                valA={networkA}
                valB={networkB}
                same={networkA === networkB}
            />
            <CompareRow
                icon={<IconCategory size={13} />}
                label="Loại thẻ"
                valA={typeA}
                valB={typeB}
                same={typeA === typeB}
            />
            <CompareRow
                icon={<IconCash size={13} />}
                label="Phí thường niên"
                valA={annualA}
                valB={annualB}
                same={annualA === annualB}
            />
            <CompareRow
                icon={<IconCurrencyDollar size={13} />}
                label="Phí ngoại tệ"
                valA={foreignA}
                valB={foreignB}
                same={foreignA === foreignB}
            />
            <CompareRow
                icon={<IconWifi size={13} />}
                label="Thanh toán không tiếp xúc"
                valA={contactlessA}
                valB={contactlessB}
                same={contactlessA === contactlessB}
            />

            {showCreditRows && (
                <>
                    <CompareRow
                        icon={<IconCalendar size={13} />}
                        label="Ngày sao kê"
                        valA={statementA}
                        valB={statementB}
                        same={statementA === statementB}
                    />
                    <CompareRow
                        icon={<IconCreditCard size={13} />}
                        label="Số ngày miễn lãi"
                        valA={daysA}
                        valB={daysB}
                        same={daysA === daysB}
                    />
                    <CompareDueDateRow cardA={cardA} cardB={cardB} />
                </>
            )}
        </div>
    );
}
