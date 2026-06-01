import Link from 'next/link';
import {IconCircleCheckFilled} from '@tabler/icons-react';
import type {Card, CompareResult, CompareTableRow as ApiRow, Intent} from '@/lib/api';

import {CompareDueDateRow} from './compare-due-date-row';
import {OwBadge, OwBadges} from '@/components/ow-ui/ow-badge';
import {CATCHALL_SLUGS} from '@/lib/cashback-utils';
import {formatFeePartsCompact} from '@/lib/utils';

import {colSpan} from './compare-col-span';

const empty = <span className="text-slate-300">—</span>;

// VI labels for API criteria — fallback to API label if not mapped
const VI_LABELS: Record<string, string> = {
    cashback_per_month: 'Cashback hàng tháng',
    min_spend_hurdle: 'Chi tiêu tối thiểu',
    annual_fee: 'Thường niên',
    annual_supplementary_fee: 'Thẻ phụ',
    issuance_fee: 'Phát hành',
    cancellation_fee: 'Hủy thẻ',
    foreign_fee: 'Ngoại tệ',
    foreign_dcc_fee: 'Ngoại tệ DCC',
    interest_free_days: 'Ngày miễn lãi',
    network_rank: 'Độ phổ biến mạng',
    persona_coverage: 'Phạm vi persona',
    card_score: 'Điểm tổng hợp',
    data_score: 'Độ đầy đủ dữ liệu',
};

const SECTION_VI_LABELS: Record<string, string> = {
    cashback: 'Cashback',
    fees: 'Phí',
    payment: 'Thanh toán',
    scores: 'Điểm đánh giá',
};

interface Props {
    cards: (Card | null)[];
    compareResult?: CompareResult | null;
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
    winnerIndex?: number | null;
}

function Row({label, values, winnerIndex}: RowProps) {
    return (
        <div className="ow-compare-row py-3">
            <p className="text-xs text-slate-400 mb-1.5">{label}</p>
            <div className="grid grid-cols-12">
                {values.map((v, i) => (
                    <div key={i}
                         className={`ow-compare-col-${i + 1} ${colSpan(values.length, i)} text-body-md flex items-center gap-1 ${winnerIndex === i ? 'text-green-600 font-semibold' : 'text-slate-800'}`}>
                        {winnerIndex === i && <IconCircleCheckFilled size={14} className="shrink-0"/>}
                        {v}
                    </div>
                ))}
            </div>
        </div>
    );
}

function formatApiValue(value: number, unit: ApiRow['unit']): React.ReactNode {
    if (unit === 'currency') {
        if (value === 0) return 'Miễn phí';
        const {value: v, unit: u} = formatFeePartsCompact({amount: value, type: 'currency'});
        return <>{v}{u}</>;
    }
    if (unit === 'percent') return value === 0 ? '0%' : `${value}%`;
    if (unit === 'rank') return `#${value}`;
    if (unit === 'score') return Number.isInteger(value) ? String(value) : value.toFixed(1);
    return String(value);
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CompareTable({cards, compareResult, intentMap = new Map()}: Props) {
    const cardIds = cards.map(c => c?.id ?? null);

    const winnerIndexOf = (criterion: string): number | null => {
        const winnerId = compareResult?.table.find(r => r.criterion === criterion)?.winner ?? null;
        if (!winnerId) return null;
        const idx = cardIds.indexOf(winnerId);
        return idx === -1 ? null : idx;
    };

    const purelyDebit = (c: Card) => c.card_type.every((t) => t === 'debit' || t === 'atm');
    const showPaymentSection = cards.some((c) => c && !purelyDebit(c));

    // Group API table rows by section
    const rowsBySection = new Map<string, ApiRow[]>();
    for (const row of compareResult?.table ?? []) {
        const group = rowsBySection.get(row.section) ?? [];
        group.push(row);
        rowsBySection.set(row.section, group);
    }

    // ── Visual rows ──────────────────────────────────────────────────────────
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
    const statements = cards.map((c) => c ? (c.statement_date ? `Ngày ${c.statement_date}` : '—') : empty);

    // ── Dynamic API section renderer ─────────────────────────────────────────
    function renderApiSection(sectionKey: string) {
        const rows = rowsBySection.get(sectionKey);
        if (!rows?.length) return null;
        return rows.map(row => {
            const values = cardIds.map(id => {
                const v = id != null ? (row.values[id] ?? 0) : null;
                const desc = id != null ? (row.labels?.[id] ?? null) : null;
                const formatted = v != null ? formatApiValue(v, row.unit) : empty;
                return desc
                    ? <span className="flex flex-col gap-0.5">{formatted}<span
                        className="text-xs text-slate-400 font-normal">{desc}</span></span>
                    : formatted;
            });
            return (
                <Row
                    key={row.criterion}
                    label={VI_LABELS[row.criterion] ?? row.label}
                    values={values}
                    winnerIndex={winnerIndexOf(row.criterion)}
                />
            );
        });
    }

    // Sections that exist in the API result, in order
    const apiSections = ['cashback', 'fees', 'payment', 'scores'].filter(s => rowsBySection.has(s));

    // Win counts per card
    const winCounts = cardIds.map(id =>
        id ? (compareResult?.table ?? []).filter(r => r.winner === id).length : 0
    );
    const maxWins = Math.max(...winCounts);
    const hasWinner = compareResult && winCounts.some(w => w > 0);

    return (
        <div className="ow-compare-table">
            {/* Intents — visual, Card-driven */}
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

            {/* Identity — visual, Card-driven */}
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

            {/* Tổng kết banner */}
            {hasWinner && (
                <>
                    <SectionHeader label="Tổng kết" />
                    <div className="grid grid-cols-12 py-3 gap-x-4">
                        {cards.map((c, i) => {
                            const wins = winCounts[i] ?? 0;
                            const isOverallWinner = wins === maxWins && wins > 0;
                            return (
                                <div key={c?.id ?? i} className={`ow-compare-col-${i + 1} ${colSpan(cards.length, i)} flex flex-col gap-1 p-3 rounded-lg ${isOverallWinner ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-transparent'}`}>
                                    <div className={`flex items-center gap-1 text-sm font-semibold ${isOverallWinner ? 'text-green-700' : 'text-slate-500'}`}>
                                        {isOverallWinner && <IconCircleCheckFilled size={14} className="shrink-0" />}
                                        {wins} tiêu chí tốt hơn
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Dynamic API sections */}
            {apiSections.map(sectionKey => (
                <div key={sectionKey}>
                    {sectionKey === 'payment' && !showPaymentSection ? null : (
                        <>
                            <SectionHeader label={SECTION_VI_LABELS[sectionKey] ?? sectionKey}/>
                            {renderApiSection(sectionKey)}
                            {sectionKey === 'payment' && showPaymentSection && (
                                <>
                                    <Row label="Ngày sao kê" values={statements}/>
                                    <CompareDueDateRow cards={cards}/>
                                </>
                            )}
                        </>
                    )}
                </div>
            ))}

            {/* Utility — visual, Card-driven */}
            <SectionHeader label="Tiện ích" />
            <Row label="Thanh toán không tiếp xúc" values={contactlessValues} />
        </div>
    );
}
