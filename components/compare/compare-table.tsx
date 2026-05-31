import Link from 'next/link';
import type {Card, CardFees, Intent} from '@/lib/api';

import {CompareDueDateRow} from './compare-due-date-row';
import {OwBadge, OwBadges} from '@/components/ow-ui/ow-badge';
import {OwFeeAmount} from '@/components/ow-ui/ow-fee-amount';
import {CATCHALL_SLUGS} from '@/lib/cashback-utils';

const empty = <span className="text-slate-300">—</span>;

interface Props {
    cards: (Card | null)[];
    intentMap?: Map<string, Intent>;
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
                    <div key={i} className="text-body-md text-slate-800">{v}</div>
                ))}
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CompareTable({ cards, intentMap = new Map() }: Props) {
    const purelyDebit = (c: Card) => c.card_type.every((t) => t === 'debit' || t === 'atm');
    const showPaymentSection = cards.some((c) => c && !purelyDebit(c));

    // ── Section 1 — identity ──────────────────────────────────────────────────
    const networkValues = cards.map((c) => c && c.card_network_data
        ? <OwBadge variant="network" networkData={c.card_network_data} tier={c.card_tier}/>
        : empty);
    const types = cards.map((c) => c
        ? (
            <OwBadges>
                {c.card_type.map((t) => <OwBadge key={t} variant="card-type" cardType={t}/>)}
            </OwBadges>
        )
        : empty);

    // ── Section 2 — fees ──────────────────────────────────────────────────────
    const feeRows: Array<{ label: string; key: keyof CardFees }> = [
        { label: 'Thường niên',   key: 'annual' },
        { label: 'Thẻ phụ',      key: 'annual_supplementary' },
        { label: 'Phát hành',    key: 'issuance' },
        { label: 'Hủy thẻ',      key: 'cancellation' },
        { label: 'Ngoại tệ',     key: 'foreign' },
        { label: 'Ngoại tệ DCC', key: 'foreign_dcc' },
    ];

    // ── Section 3 — payment ───────────────────────────────────────────────────
    const statements = cards.map((c) => c ? (c.statement_date ? `Ngày ${c.statement_date}` : '—') : empty);
    const freeDays = cards.map((c) => c ? (c.interest_free_days ? `${c.interest_free_days} ngày` : '—') : empty);

    // ── Section 4 — utility ───────────────────────────────────────────────────
    const contactlessValues = cards.map((c) => {
        if (!c) return empty;
        const methods = c.contactless_methods_data;
        if (!methods || methods.length === 0) return <span>—</span>;
        return (
            <OwBadges>
                {methods.map((m) => <OwBadge key={m.id} variant="contactless" contactlessData={m}/>)}
            </OwBadges>
        );
    });

    return (
        <div className="ow-compare-table">
            {/* Section 1 — intents */}
            {cards.some((c) => c?.intents?.length) && (
                <>
                    <SectionHeader label="Phù hợp với" />
                    <Row
                        label="Mục đích sử dụng"
                        values={cards.map((c) => {
                            if (!c?.intents?.length) return empty;
                            const slugRateMap = new Map<string, number>();
                            for (const rule of c.cashback?.rules ?? []) {
                                for (const slug of [...(rule.merchants ?? []), ...(rule.intents ?? []).filter(s => !CATCHALL_SLUGS.has(s))]) {
                                    if (!slugRateMap.has(slug)) slugRateMap.set(slug, rule.rate);
                                }
                            }
                            const intents = c.intents
                                .map((slug) => intentMap.get(slug))
                                .filter((i): i is Intent => i !== undefined);
                            if (!intents.length) return empty;
                            return (
                                <OwBadges>
                                    {intents.map((intent) => (
                                        <OwBadge
                                            key={intent.slug}
                                            variant="intent"
                                            slug={intent.slug}
                                            emoji={intent.icon}
                                            label={intent.label}
                                            rate={slugRateMap.get(intent.slug)}
                                            highlighted
                                        />
                                    ))}
                                </OwBadges>
                            );
                        })}
                    />
                </>
            )}

            {/* Section 2 — identity */}
            <SectionHeader label="Thông tin" />
            <Row
                label="Ngân hàng"
                values={cards.map((c, i) => c
                    ? <Link key={i} href={`/ngan-hang/${c.bank_id}`} className="hover:text-brand-blue transition-colors">{c.bank_data?.name ?? c.bank_id}</Link>
                    : empty
                )}
            />
            <Row label="Mạng lưới" values={networkValues} />
            <Row label="Loại thẻ" values={types} />

            {/* Section 3 — fees */}
            <SectionHeader label="Phí" />
            {feeRows.map(({ label, key }) => {
                if (!cards.some((c) => c?.fees?.[key] != null)) return null;
                const values = cards.map((c) => {
                    const fee = c?.fees?.[key];
                    return fee ? <OwFeeAmount amount={fee.amount} type={fee.type}/> : empty;
                });
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

            {/* Section 5 — utility */}
            <SectionHeader label="Tiện ích" />
            <Row label="Thanh toán không tiếp xúc" values={contactlessValues} />
        </div>
    );
}
