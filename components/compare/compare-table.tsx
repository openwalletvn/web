'use client';

import {useEffect, useState} from 'react';
import type {Card, CompareResult, CompareTableRow as ApiRow} from '@/lib/api';
import {getRelatedStatements} from '@/lib/card-dates';
import {OwBankImage} from '@/components/ow-ui/ow-bank-image';
import {OwBadge, OwBadges} from '@/components/ow-ui/ow-badge';
import {OwCardIntentBadges} from '@/components/ow-ui/ow-card-intent-badges';
import {formatFeePartsCompact} from '@/lib/utils';

import {CompareRow} from './compare-row';
import {CompareSectionTitle} from './compare-section-title';

const empty = <span className="text-slate-300">—</span>;

function getNextDue(card: Card): string {
    if (!card.statement_date || !card.interest_free_days) return '—';
    const today = new Date();
    const tod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const stmts = getRelatedStatements(tod, card.statement_date, card.interest_free_days);
    const cycle = stmts.find((s) => s.due >= tod) ?? stmts[2];
    const day = cycle.due.getDate().toString().padStart(2, '0');
    const month = (cycle.due.getMonth() + 1).toString().padStart(2, '0');
    return `ngày ${day}/${month}`;
}

// VI labels for API criteria — fallback to API label if not mapped
const VI_LABELS: Record<string, string> = {
    cashback_per_month: 'Cashback hàng tháng',
    min_spend_hurdle: 'Chi tiêu tối thiểu',
    annual_fee: 'Thường niên',
    annual_supplementary_fee: 'Thẻ phụ',
    issuance_fee: 'Phí phát hành',
    cancellation_fee: 'Phí huỷ thẻ',
    foreign_fee: 'Phí chuyển đổi ngoại tệ',
    foreign_dcc_fee: 'Phí xử lý giao dịch quốc tế bằng VNĐ (DDC)',
    interest_free_days: 'Số ngày miễn lãi',
    network_rank: 'Độ phổ biến của mạng thẻ',
    persona_coverage: 'Độ phủ lĩnh vực ưu đãi',
    card_score: 'Điểm tổng hợp',
    data_score: 'Độ đầy đủ dữ liệu',
};

const SECTION_VI_LABELS: Record<string, string> = {
    cashback: 'Ưu đãi hoàn tiền',
    fees: 'Biểu phí',
    payment: 'Ngày và hạn thanh toán',
    scores: 'Điểm OpenWallet',
};

interface Props {
    cards: (Card | null)[];
    compareResult?: CompareResult | null;
}

// ─── Primitives ───────────────────────────────────────────────────────────────



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

export function CompareTable({cards, compareResult}: Props) {
    const [dues, setDues] = useState<(string | null)[]>(() => Array(cards.length).fill(null));

    useEffect(() => {
        setDues(cards.map((c) => c ? getNextDue(c) : '—'));
    }, [cards]); // eslint-disable-line react-hooks/exhaustive-deps
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
                return v != null ? formatApiValue(v, row.unit) : empty;
            });
            return (
                <CompareRow
                    key={row.criterion}
                    id={`row-${row.criterion}`}
                    label={VI_LABELS[row.criterion] ?? row.criterion}
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
            {/* Identity — visual, Card-driven */}
            <CompareSectionTitle label="Thông tin" />
            <CompareRow
                id="row-ngan-hang"
                label="Ngân hàng"
                values={cards.map((c) => c?.bank_data
                    ? <OwBankImage className="h-[40px] w-auto" bank={c.bank_data} href={`/ngan-hang/${c.bank_id}`}/>
                    : empty
                )}
            />
            <CompareRow id="row-mang-luoi" label="Mạng lưới thẻ" values={networkValues}/>
            <CompareRow id="row-loai-the" label="Loại thẻ" values={types}/>
            {/* Intents — visual, Card-driven */}
            {cards.some((c) => c?.intents?.length) && (
                <>
                    <CompareRow
                        id="row-linh-vuc-uu-dai"
                        label="Lĩnh vực ưu đãi"
                        values={cards.map((c) => {
                            if (!c?.intents?.length) return empty;
                            return <OwCardIntentBadges card={c} highlighted/>;
                        })}
                    />
                </>
            )}

            {/* Utility — visual, Card-driven */}
            <CompareRow id="row-thanh-toan-khong-tiep-xuc" label="Thanh toán không tiếp xúc"
                        values={contactlessValues}/>


            {/* Dynamic API sections */}
            {apiSections.map(sectionKey => (
                <div key={sectionKey}>
                    {sectionKey === 'payment' && !showPaymentSection ? null : (
                        <>
                            <CompareSectionTitle label={SECTION_VI_LABELS[sectionKey] ?? sectionKey}/>
                            {renderApiSection(sectionKey)}
                            {sectionKey === 'payment' && showPaymentSection && (
                                <>
                                    <CompareRow id="row-ngay-sao-ke" label="Ngày sao kê" values={statements}/>
                                    <CompareRow
                                        id="row-ngay-den-han"
                                        label="Ngày đến hạn dự kiến"
                                        values={dues.map((due) => (
                                            <span
                                                className={due === '—' || due === null ? 'text-slate-300' : undefined}>
                                                {due ?? '…'}
                                            </span>
                                        ))}
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
