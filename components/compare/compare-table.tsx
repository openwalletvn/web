import Link from 'next/link';
import type { Card, CardFees } from '@/lib/api';
import { getNetworkImageUrl } from '@/lib/api';
import { CompareDueDateRow } from './compare-due-date-row';

interface Props {
    cards: Card[];
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

// ─── Primitives ───────────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
    return (
        <div className="mt-10 border-t border-slate-100 pt-5 mb-2">
            <p className="text-sm font-bold text-slate-800">{label}</p>
        </div>
    );
}

interface RowProps {
    label: string;
    values: React.ReactNode[];
}

function Row({ label, values }: RowProps) {
    return (
        <div className="py-3">
            <p className="text-xs text-slate-400 mb-1.5">{label}</p>
            <div className="grid" style={{ gridTemplateColumns: `repeat(${values.length}, 1fr)` }}>
                {values.map((v, i) => (
                    <div key={i} className="text-lg font-semibold text-slate-800">{v}</div>
                ))}
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CompareTable({ cards }: Props) {
    const purelyDebit = (c: Card) => c.card_type.every((t) => t === 'debit' || t === 'atm');
    const showPaymentSection = cards.some((c) => !purelyDebit(c));

    // ── Section 1 — identity ──────────────────────────────────────────────────
    const banks = cards.map((c) => c.bank_data?.name ?? c.bank_id);

    const networkValues = cards.map((c) => {
        const logoUrl = c.card_network_data?.logo_url;
        const name = c.card_network_data?.name ?? c.card_network.toUpperCase();
        const label = [name, c.card_tier].filter(Boolean).join(' ');
        return (
            <span className="inline-flex items-center gap-1.5">
                {logoUrl && (
                    <img
                        src={getNetworkImageUrl(logoUrl)}
                        alt={name}
                        style={{ height: 20 }}
                        className="object-contain inline-block"
                    />
                )}
                <span>{label}</span>
            </span>
        );
    });
    const types = cards.map((c) => c.card_type.map((t) => CARD_TYPE_LABELS[t] ?? t).join(', '));

    // ── Section 2 — fees ──────────────────────────────────────────────────────
    const feeRows: Array<{ label: string; key: keyof CardFees }> = [
        { label: 'Thường niên',    key: 'annual' },
        { label: 'Thẻ phụ',       key: 'annual_supplementary' },
        { label: 'Phát hành',     key: 'issuance' },
        { label: 'Hủy thẻ',       key: 'cancellation' },
        { label: 'Ngoại tệ',      key: 'foreign' },
        { label: 'Ngoại tệ DCC',  key: 'foreign_dcc' },
    ];

    // ── Section 3 — payment ───────────────────────────────────────────────────
    const statements = cards.map((c) => c.statement_date ? `Ngày ${c.statement_date}` : '—');
    const freeDays = cards.map((c) => c.interest_free_days ? `${c.interest_free_days} ngày` : '—');

    // ── Section 4 — utility ───────────────────────────────────────────────────
    const contactlessValues = cards.map((c) => {
        const methods = c.contactless_methods_data;
        if (!methods || methods.length === 0) return <span>—</span>;
        return (
            <div className="flex flex-row flex-wrap items-center gap-1.5">
                {methods.map((m) => (
                    <img
                        key={m.id}
                        src={getNetworkImageUrl(m.logo_url)}
                        alt={m.name}
                        style={{ height: 24 }}
                        className="object-contain"
                    />
                ))}
            </div>
        );
    });

    return (
        <div>
            {/* Section 1 — identity */}
            <Row
                label="Ngân hàng"
                values={cards.map((c, i) => (
                    <Link key={c.id} href={`/ngan-hang/${c.bank_id}`} className="hover:text-brand-blue transition-colors">
                        {banks[i]}
                    </Link>
                ))}
            />
            <Row label="Mạng lưới" values={networkValues} />
            <Row label="Loại thẻ" values={types} />

            {/* Section 2 — fees */}
            <SectionHeader label="Phí" />
            {feeRows.map(({ label, key }) => {
                if (!cards.some((c) => c.fees?.[key] != null)) return null;
                const values = cards.map((c) => formatFee(c.fees?.[key]));
                return <Row key={key} label={label} values={values} />;
            })}

            {/* Section 3 — payment (credit/hybrid cards only) */}
            {showPaymentSection && (
                <>
                    <SectionHeader label="Thanh toán" />
                    <Row label="Ngày sao kê" values={statements} />
                    <Row label="Số ngày miễn lãi" values={freeDays} />
                    <CompareDueDateRow cards={cards} />
                </>
            )}

            {/* Section 4 — utility */}
            <SectionHeader label="Tiện ích" />
            <Row label="Thanh toán không tiếp xúc" values={contactlessValues} />
        </div>
    );
}
