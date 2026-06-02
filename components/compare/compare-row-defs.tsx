import type {Card, CompareResult, CompareTableRow as ApiRow} from '@/lib/api';
import {normalizeCardTypes} from '@/lib/api';
import {OwBankImage} from '@/components/ow-ui/ow-bank-image';
import {OwBadge, OwBadges} from '@/components/ow-ui/ow-badge';
import {OwCardIntentBadges} from '@/components/ow-ui/ow-card-intent-badges';
import {OwFeeAmount} from "@/components/ow-ui/ow-fee-amount";
import {formatDueDate} from '@/lib/card-dates';

// ─── Context ──────────────────────────────────────────────────────────────────

export interface CompareContext {
    compareResult?: CompareResult | null;
    dues: (Date | null)[];
    cardIds: (string | null)[];
}

// ─── Row spec types ───────────────────────────────────────────────────────────

export interface StaticRowSpec {
    id: string;
    label: string;
    rowDescription?: string;
    visible?: (cards: (Card | null)[], ctx: CompareContext) => boolean;
    getValues: (cards: (Card | null)[], ctx: CompareContext) => React.ReactNode[];
    getDescriptions?: (cards: (Card | null)[], ctx: CompareContext) => (React.ReactNode | null)[];
    getWinnerIndex?: (cards: (Card | null)[], ctx: CompareContext) => number | null;
}

export interface CriterionRowSpec {
    criterion: string;
    label: string;
    rowDescription?: string;
    getValue?: (value: number, unit: ApiRow['unit'], card: Card | null) => React.ReactNode;
    getDescription?: (value: number, unit: ApiRow['unit'], card: Card | null) => string | null;
}

export type RowSpec = StaticRowSpec | CriterionRowSpec;

export interface SectionDef {
    section: string;
    label: string;
    visible?: (cards: (Card | null)[], ctx: CompareContext) => boolean;
    rows: RowSpec[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const empty = <span className="text-slate-300">—</span>;

const purelyDebit = (c: Card) => c.card_type.every(t => t === 'debit' || t === 'atm');
const hasCredit = (cards: (Card | null)[]) => cards.some(c => c && !purelyDebit(c));

const percent = (v: number) => v === 0 ? '0%' : `${v}%`;
const rank = (v: number) => `#${v}`;
const score = (v: number) => Number.isInteger(v) ? String(v) : v.toFixed(1);
const days = (v: number) => `${v} ngày`;

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
                        ? <OwBankImage className="h-[40px] w-auto" bank={c.bank_data} href={`/ngan-hang/${c.bank_id}`}/>
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
                        return v != null ? `Độ phổ biến: ${rank(v)}` : null;
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
                    if (!methods?.length) return <span>—</span>;
                    return <OwBadges>{methods.map(m => <OwBadge key={m.id} variant="contactless" contactlessData={m}/>)}</OwBadges>;
                }),
            },
        ],
    },
    {
        section: 'cashback',
        label: 'Ưu đãi hoàn tiền',
        rows: [
            {
                criterion: 'cashback_per_month',
                label: 'Cashback hàng tháng',
                rowDescription: 'Số tiền hoàn tối ưu dựa trên thuật toán của OpenWallet',
                getValue: (v) => <OwFeeAmount compact amount={v} period="period"/>,
                getDescription: (v) => v === 0 ? 'Không có cashback' : null
            },
            {
                criterion: 'min_spend_hurdle',
                label: 'Chi tiêu tối thiểu để được hoàn tiền',
                getValue: (v) => v === 0 ? "Hoàn cho mọi giao dịch hợp lệ" :
                    <OwFeeAmount compact amount={v} period="period"/>,
            },
        ],
    },
    {
        section: 'fees',
        label: 'Biểu phí',
        rows: [
            {
                criterion: 'annual_fee',
                label: 'Thường niên',
                getValue: (v) => v === 0 ? 'Miễn phí thường niên' : <OwFeeAmount compact amount={v} period="year"/>
            },
            {
                criterion: 'annual_supplementary_fee',
                label: 'Thẻ phụ',
                getValue: (v) => v === 0 ? 'Miễn phí thẻ phụ' : <OwFeeAmount compact amount={v} period="year"/>,
            },
            {
                criterion: 'issuance_fee',
                label: 'Phí phát hành',
                getValue: (v) => v === 0 ? 'Miễn phí phát hành' : <OwFeeAmount compact amount={v}/>,
            },
            {
                criterion: 'cancellation_fee',
                label: 'Phí huỷ thẻ',
                getValue: (v) => v === 0 ? 'Không mất phí huỷ thẻ' : <OwFeeAmount compact amount={v}/>,
            },
            {
                criterion: 'foreign_fee',
                label: 'Phí chuyển đổi ngoại tệ',
                getValue: (v) => percent(v),
                getDescription: (v) => v === 0 ? 'Không phí ngoại tệ' : null
            },
            {
                criterion: 'foreign_dcc_fee',
                label: 'Phí xử lý giao dịch quốc tế bằng VNĐ (DDC)',
                getValue: (v) => percent(v)
            },
        ],
    },
    {
        section: 'payment',
        label: 'Ngày và hạn thanh toán',
        visible: hasCredit,
        rows: [
            {
                criterion: 'interest_free_days',
                label: 'Số ngày miễn lãi',
                getValue: (v) => days(v),
                getDescription: (v) => v === 0 ? 'Chưa có dữ liệu' : null
            },
            {
                id: 'row-ngay-sao-ke',
                label: 'Ngày sao kê',
                getValues: (cards) => cards.map(c =>
                    c ? (c.statement_date ? `Ngày ${c.statement_date} hàng tháng` : 'Chưa có dữ liệu') : ''
                ),
                getDescriptions: (_, ctx) => {
                    const tod = new Date();
                    tod.setHours(0, 0, 0, 0);
                    return ctx.dues.map(due => {
                        if (!due) return null;
                        const diff = Math.round((due.getTime() - tod.getTime()) / 86_400_000);
                        const diffLabel = diff === 0 ? 'hôm nay' : diff > 0 ? `còn ${diff} ngày` : 'đã qua hạn';
                        return `Đến hạn: ${formatDueDate(due)} (${diffLabel})`;
                    });
                },
            },
        ],
    },
    {
        section: 'scores',
        label: 'Điểm OpenWallet',
        rows: [
            {criterion: 'card_score', label: 'Điểm tổng hợp', getValue: (v) => score(v)},
            {criterion: 'data_score', label: 'Độ đầy đủ dữ liệu', getValue: (v) => score(v)},
        ],
    },
];

// ─── Resolver ─────────────────────────────────────────────────────────────────

function isCriterionSpec(spec: RowSpec): spec is CriterionRowSpec {
    return 'criterion' in spec;
}

function resolveCriterionSpec(spec: CriterionRowSpec, cards: (Card | null)[], ctx: CompareContext): StaticRowSpec {
    const apiRow = ctx.compareResult?.table.find(r => r.criterion === spec.criterion);
    return {
        id: `row-${spec.criterion}`,
        label: spec.label,
        rowDescription: spec.rowDescription,
        getValues: (_, c) => c.cardIds.map((id, i) => {
            const card = cards[i] ?? null;
            const v = id != null && apiRow ? (apiRow.values[id] ?? 0) : null;
            if (v == null) return empty;
            return spec.getValue?.(v, apiRow!.unit, card) ?? String(v);
        }),
        getDescriptions: (_, c) => c.cardIds.map((id, i) => {
            const card = cards[i] ?? null;
            const v = id != null && apiRow ? (apiRow.values[id] ?? 0) : null;
            return v != null ? (spec.getDescription?.(v, apiRow!.unit, card) ?? null) : null;
        }),
        getWinnerIndex: (_, c) => {
            const winnerId = c.compareResult?.table.find(r => r.criterion === spec.criterion)?.winner ?? null;
            if (!winnerId) return null;
            const idx = c.cardIds.indexOf(winnerId);
            return idx === -1 ? null : idx;
        },
    };
}

export function resolveSection(section: SectionDef, cards: (Card | null)[], ctx: CompareContext): StaticRowSpec[] {
    return section.rows
        .map(spec => isCriterionSpec(spec) ? resolveCriterionSpec(spec, cards, ctx) : spec)
        .filter(row => row.visible?.(cards, ctx) !== false);
}
