import type {Card, CompareResult, CompareTableRow as ApiRow} from '@/lib/api';
import {normalizeCardTypes} from '@/lib/api';
import {OwBankImage} from '@/components/owui/ow-bank-image';
import {OwBadge, OwBadges} from '@/components/owui/ow-badge';
import {OwCardIntentBadges} from '@/components/owui/ow-card-intent-badges';
import {OwAmount} from "@/components/owui/ow-amount";
import {formatDueDate} from '@/lib/card-dates';

// ─── Context ──────────────────────────────────────────────────────────────────

export interface CompareContext {
    compareResult?: CompareResult | null;
    dues: (Date | null)[];
    cardIds: (string | null)[];
}

// ─── Row spec ─────────────────────────────────────────────────────────────────

export interface StaticRowSpec {
    id: string;
    label: string;
    rowDescription?: string;
    visible?: (cards: (Card | null)[], ctx: CompareContext) => boolean;
    getValues: (cards: (Card | null)[], ctx: CompareContext) => React.ReactNode[];
    getDescriptions?: (cards: (Card | null)[], ctx: CompareContext) => (React.ReactNode | null)[];
    getWinnerIndex?: (cards: (Card | null)[], ctx: CompareContext) => number | null;
}

export interface SectionDef {
    section: string;
    label: string;
    visible?: (cards: (Card | null)[], ctx: CompareContext) => boolean;
    rows: StaticRowSpec[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const empty = <span className="text-slate-300">-</span>;

const purelyDebit = (c: Card) => c.card_type.every(t => t === 'debit' || t === 'atm');
const hasCredit = (cards: (Card | null)[]) => cards.some(c => c && !purelyDebit(c));

const percent = (v: number) => v === 0 ? '0%' : `${v}%`;
const score = (v: number) => Number.isInteger(v) ? String(v) : v.toFixed(1);
const days = (v: number) => `${v} ngày`;

function criterionRow(criterion: string, opts: {
    label: string;
    rowDescription?: string;
    getValue?: (v: number, unit: ApiRow['unit'], card: Card | null) => React.ReactNode;
    getDescription?: (v: number, unit: ApiRow['unit'], card: Card | null) => string | null;
}): StaticRowSpec {
    return {
        id: `row-${criterion}`,
        label: opts.label,
        rowDescription: opts.rowDescription,
        getValues: (cards, ctx) => {
            const apiRow = ctx.compareResult?.table.find(r => r.criterion === criterion);
            return ctx.cardIds.map((id, i) => {
                const card = cards[i] ?? null;
                const v = id != null && apiRow ? (apiRow.values[id] ?? 0) : null;
                if (v == null) return empty;
                return opts.getValue?.(v, apiRow!.unit, card) ?? String(v);
            });
        },
        getDescriptions: (cards, ctx) => {
            const apiRow = ctx.compareResult?.table.find(r => r.criterion === criterion);
            return ctx.cardIds.map((id, i) => {
                const card = cards[i] ?? null;
                const v = id != null && apiRow ? (apiRow.values[id] ?? 0) : null;
                return v != null ? (opts.getDescription?.(v, apiRow!.unit, card) ?? null) : null;
            });
        },
        getWinnerIndex: (_, ctx) => {
            const winnerId = ctx.compareResult?.table.find(r => r.criterion === criterion)?.winner ?? null;
            if (!winnerId) return null;
            const idx = ctx.cardIds.indexOf(winnerId);
            return idx === -1 ? null : idx;
        },
    };
}

// ─── Section + row definitions ────────────────────────────────────────────────

export const SECTION_DEFS: SectionDef[] = [
    {
        section: 'info',
        label: 'Thông tin',
        rows: [
            {
                id: 'row-ngan-hang',
                label: 'Ngân hàng',
                getValues: (cards) => cards.map(c =>
                    c?.bank_data
                        ? <OwBankImage className="lg:h-[40px] h-[20px] w-auto" bank={c.bank_data} href={`/ngan-hang/${c.bank_id}`}/>
                        : empty
                ),
            },
            {
                id: 'row-network',
                label: 'Mạng lưới thẻ',
                getValues: (cards) => cards.map(c =>
                    c?.card_network_data
                        ? <OwBadge variant="network" networkData={c.card_network_data} tier={c.card_tier}/>
                        : empty
                ),
                getDescriptions: (_, ctx) => {
                    const apiRow = ctx.compareResult?.table.find(r => r.criterion === 'network_rank');
                    return ctx.cardIds.map(id => {
                        const v = id != null && apiRow ? (apiRow.values[id] ?? null) : null;
                        return v != null ? `Độ phổ biến: #${v}` : null;
                    });
                },
                getWinnerIndex: (_, ctx) => {
                    const winnerId = ctx.compareResult?.table.find(r => r.criterion === 'network_rank')?.winner ?? null;
                    if (!winnerId) return null;
                    const idx = ctx.cardIds.indexOf(winnerId);
                    return idx === -1 ? null : idx;
                },
            },
            {
                id: 'row-loai-the',
                label: 'Loại thẻ',
                getValues: (cards) => cards.map(c =>
                    c ? <OwBadges>{normalizeCardTypes(c.card_type).map(t => <OwBadge key={t} variant="card-type" cardType={t}/>)}</OwBadges> : empty
                ),
            },
            {
                id: 'row-linh-vuc-uu-dai',
                label: 'Lĩnh vực ưu đãi',
                visible: (cards) => cards.some(c => !!c?.intents?.length),
                getValues: (cards) => cards.map(c =>
                    c?.intents?.length ? <OwCardIntentBadges card={c} highlighted/> : empty
                ),
                getDescriptions: (_, ctx) => {
                    const apiRow = ctx.compareResult?.table.find(r => r.criterion === 'persona_coverage');
                    return ctx.cardIds.map(id => {
                        const v = id != null && apiRow ? (apiRow.values[id] ?? null) : null;
                        return v != null ? `Độ phủ: ${percent(v)}` : null;
                    });
                },
                getWinnerIndex: (_, ctx) => {
                    const winnerId = ctx.compareResult?.table.find(r => r.criterion === 'persona_coverage')?.winner ?? null;
                    if (!winnerId) return null;
                    const idx = ctx.cardIds.indexOf(winnerId);
                    return idx === -1 ? null : idx;
                },
            },
            {
                id: 'row-thanh-toan-khong-tiep-xuc',
                label: 'Thanh toán không tiếp xúc',
                getValues: (cards) => cards.map(c => {
                    if (!c) return empty;
                    const methods = c.contactless_methods_data;
                    if (!methods?.length) return <span>-</span>;
                    return <OwBadges>{methods.map(m => <OwBadge key={m.id} variant="contactless" contactlessData={m}/>)}</OwBadges>;
                }),
            },
        ],
    },
    {
        section: 'cashback',
        label: 'Ưu đãi hoàn tiền',
        rows: [
            criterionRow('cashback_per_month', {
                label: 'Cashback hàng tháng',
                rowDescription: 'Số tiền hoàn tối ưu dựa trên thuật toán của OpenWallet',
                getValue: (v) => <OwAmount large unit="k" amount={v} period="period"/>,
                getDescription: (v) => v === 0 ? 'Không có cashback' : null,
            }),
            criterionRow('min_spend_hurdle', {
                label: 'Chi tiêu tối thiểu để được hoàn tiền',
                getValue: (v) => v === 0 ? 'Hoàn cho mọi giao dịch hợp lệ' :
                    <OwAmount large unit="k" amount={v} period="period"/>,
            }),
        ],
    },
    {
        section: 'fees',
        label: 'Biểu phí',
        rows: [
            criterionRow('annual_fee', {
                label: 'Thường niên',
                getValue: (v) => v === 0 ? 'Miễn phí thường niên' :
                    <OwAmount large unit="k" amount={v} period="year"/>,
            }),
            criterionRow('annual_supplementary_fee', {
                label: 'Thẻ phụ',
                getValue: (v) => v === 0 ? 'Miễn phí thẻ phụ' : <OwAmount unit="k" amount={v} period="year"/>,
            }),
            criterionRow('issuance_fee', {
                label: 'Phí phát hành',
                getValue: (v) => v === 0 ? 'Miễn phí phát hành' : <OwAmount unit="k" amount={v}/>,
            }),
            criterionRow('cancellation_fee', {
                label: 'Phí huỷ thẻ',
                getValue: (v) => v === 0 ? 'Không mất phí huỷ thẻ' : <OwAmount unit="k" amount={v}/>,
            }),
            criterionRow('foreign_fee', {
                label: 'Phí chuyển đổi ngoại tệ',
                getValue: (v) => percent(v),
                getDescription: (v) => v === 0 ? 'Không phí ngoại tệ' : null,
            }),
            criterionRow('foreign_dcc_fee', {
                label: 'Phí xử lý giao dịch quốc tế bằng VNĐ (DDC)',
                getValue: (v) => percent(v),
            }),
        ],
    },
    {
        section: 'payment',
        label: 'Ngày và hạn thanh toán',
        visible: hasCredit,
        rows: [
            criterionRow('interest_free_days', {
                label: 'Số ngày miễn lãi',
                getValue: (v) => <OwAmount large amount={v} period="day"/>,
                getDescription: (v) => v === 0 ? 'Chưa có dữ liệu' : null,
            }),
            {
                id: 'row-ngay-sao-ke',
                label: 'Ngày sao kê',
                getValues: (cards) => cards.map(c =>
                    c ? (c.statement_date ? `Ngày ${c.statement_date} hàng tháng` : 'Chưa có dữ liệu') : ''
                ),
                rowDescription: "Dữ liệu có thể chênh lệch 1–2 ngày. Vui lòng xác nhận hạn thanh toán từng kỳ sao kê.",
                getDescriptions: (_, ctx) => {
                    const tod = new Date();
                    tod.setHours(0, 0, 0, 0);
                    return ctx.dues.map(due => {
                        if (!due) return null;
                        const diff = Math.round((due.getTime() - tod.getTime()) / 86_400_000);
                        const diffLabel = diff === 0 ? 'hôm nay' : diff > 0 ? `còn ${diff} ngày` : 'đã qua hạn';
                        return `Đến hạn: ${formatDueDate(due)} (${diffLabel}).`;
                    });
                },
            },
        ],
    },
    {
        section: 'scores',
        label: 'Điểm OpenWallet',
        rows: [
            criterionRow('card_score', {
                label: 'Điểm tổng hợp',
                getValue: (v) => <OwAmount large amount={v} period="100"/>,
                rowDescription: "Điểm tổng thể của thẻ trên toàn hệ thống OpenWallet."
            }),
            criterionRow('data_score', {label: 'Độ đầy đủ dữ liệu', getValue: (v) => percent(v)}),
        ],
    },
];

// ─── Resolver ─────────────────────────────────────────────────────────────────

export function resolveSection(section: SectionDef, cards: (Card | null)[], ctx: CompareContext): StaticRowSpec[] {
    return section.rows.filter(row => row.visible?.(cards, ctx) !== false);
}
