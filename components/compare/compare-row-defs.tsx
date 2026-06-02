import type {Card, CompareResult, CompareTableRow as ApiRow} from '@/lib/api';
import {normalizeCardTypes} from '@/lib/api';
import {OwBankImage} from '@/components/ow-ui/ow-bank-image';
import {OwBadge, OwBadges} from '@/components/ow-ui/ow-badge';
import {OwCardIntentBadges} from '@/components/ow-ui/ow-card-intent-badges';
import {formatFeePartsCompact} from '@/lib/utils';

// ─── Context ──────────────────────────────────────────────────────────────────

export interface CompareContext {
    compareResult?: CompareResult | null;
    dues: (string | null)[];
    cardIds: (string | null)[];
}

// ─── Row spec types ───────────────────────────────────────────────────────────

export interface StaticRowSpec {
    id: string;
    label: string;
    visible?: (cards: (Card | null)[], ctx: CompareContext) => boolean;
    getValues: (cards: (Card | null)[], ctx: CompareContext) => React.ReactNode[];
    getDescriptions?: (cards: (Card | null)[], ctx: CompareContext) => (React.ReactNode | null)[];
    getWinnerIndex?: (cards: (Card | null)[], ctx: CompareContext) => number | null;
}

export interface CriterionRowSpec {
    criterion: string;
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

export function formatApiValue(value: number, unit: ApiRow['unit']): React.ReactNode {
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

// ─── Criterion defs ───────────────────────────────────────────────────────────

interface CriterionDef {
    label: string;
    getValue?: (value: number, unit: ApiRow['unit']) => React.ReactNode;
    getDescription?: (value: number, unit: ApiRow['unit']) => string | null;
}

const CRITERION_DEFS: Record<string, CriterionDef> = {
    cashback_per_month: {
        label: 'Cashback hàng tháng',
        getDescription: (value) => value === 0 ? 'Không có cashback' : null,
    },
    min_spend_hurdle: {
        label: 'Chi tiêu tối thiểu',
        getDescription: (value) => value === 0 ? 'Không yêu cầu chi tiêu tối thiểu' : null,
    },
    annual_fee: {
        label: 'Thường niên',
        getDescription: (value) => value === 0 ? 'Miễn phí thường niên' : null,
    },
    annual_supplementary_fee: {
        label: 'Thẻ phụ',
        getDescription: (value) => value === 0 ? 'Miễn phí thẻ phụ' : null,
    },
    issuance_fee: {
        label: 'Phí phát hành',
        getDescription: (value) => value === 0 ? 'Miễn phí phát hành' : null,
    },
    cancellation_fee: {
        label: 'Phí huỷ thẻ',
        getDescription: (value) => value === 0 ? 'Không mất phí huỷ thẻ' : null,
    },
    foreign_fee: {
        label: 'Phí chuyển đổi ngoại tệ',
        getDescription: (value) => value === 0 ? 'Không phí ngoại tệ' : null,
    },
    foreign_dcc_fee: {
        label: 'Phí xử lý giao dịch quốc tế bằng VNĐ (DDC)',
    },
    interest_free_days: {
        label: 'Số ngày miễn lãi',
        getDescription: (value) => value === 0 ? 'Không có ngày miễn lãi' : `Lên đến ${value} ngày`,
    },
    network_rank: {label: 'Độ phổ biến của mạng thẻ'},
    persona_coverage: {label: 'Độ phủ lĩnh vực ưu đãi'},
    card_score: {label: 'Điểm tổng hợp'},
    data_score: {label: 'Độ đầy đủ dữ liệu'},
};

// ─── Row spec array ───────────────────────────────────────────────────────────

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
                id: 'row-mang-luoi',
                label: 'Mạng lưới thẻ',
                getValues: (cards) => cards.map(c =>
                    c?.card_network_data
                        ? <OwBadge variant="network" networkData={c.card_network_data} tier={c.card_tier}/>
                        : empty
                ),
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
            {criterion: 'cashback_per_month'},
            {criterion: 'min_spend_hurdle'},
        ],
    },
    {
        section: 'fees',
        label: 'Biểu phí',
        rows: [
            {criterion: 'annual_fee'},
            {criterion: 'annual_supplementary_fee'},
            {criterion: 'issuance_fee'},
            {criterion: 'cancellation_fee'},
            {criterion: 'foreign_fee'},
            {criterion: 'foreign_dcc_fee'},
        ],
    },
    {
        section: 'payment',
        label: 'Ngày và hạn thanh toán',
        visible: hasCredit,
        rows: [
            {criterion: 'interest_free_days'},
            {
                id: 'row-ngay-sao-ke',
                label: 'Ngày sao kê',
                getValues: (cards) => cards.map(c =>
                    c ? (c.statement_date ? `Ngày ${c.statement_date}` : '—') : empty
                ),
            },
            {
                id: 'row-ngay-den-han',
                label: 'Ngày đến hạn dự kiến',
                getValues: (_, ctx) => ctx.dues.map(due => (
                    <span className={due === '—' || due === null ? 'text-slate-300' : undefined}>
                        {due ?? '…'}
                    </span>
                )),
            },
        ],
    },
    {
        section: 'scores',
        label: 'Điểm OpenWallet',
        rows: [
            {criterion: 'network_rank'},
            {criterion: 'persona_coverage'},
            {criterion: 'card_score'},
            {criterion: 'data_score'},
        ],
    },
];

// ─── Resolver: expand CriterionRowSpec → StaticRowSpec ───────────────────────

function isCriterionSpec(spec: RowSpec): spec is CriterionRowSpec {
    return 'criterion' in spec;
}

function resolveCriterionSpec(spec: CriterionRowSpec, ctx: CompareContext): StaticRowSpec {
    const def = CRITERION_DEFS[spec.criterion];
    const apiRow = ctx.compareResult?.table.find(r => r.criterion === spec.criterion);
    return {
        id: `row-${spec.criterion}`,
        label: def?.label ?? spec.criterion,
        getValues: (_, c) => c.cardIds.map(id => {
            const v = id != null && apiRow ? (apiRow.values[id] ?? 0) : null;
            if (v == null) return empty;
            return def?.getValue?.(v, apiRow!.unit) ?? formatApiValue(v, apiRow!.unit);
        }),
        getDescriptions: (_, c) => c.cardIds.map(id => {
            const v = id != null && apiRow ? (apiRow.values[id] ?? 0) : null;
            return v != null ? (def?.getDescription?.(v, apiRow!.unit) ?? null) : null;
        }),
        getWinnerIndex: (_, c) => {
            const winnerId = c.compareResult?.table.find(r => r.criterion === spec.criterion)?.winner ?? null;
            if (!winnerId) return null;
            const idx = c.cardIds.indexOf(winnerId);
            return idx === -1 ? null : idx;
        },
    };
}

export function resolveSection(
    section: SectionDef,
    cards: (Card | null)[],
    ctx: CompareContext,
): StaticRowSpec[] {
    return section.rows
        .map(spec => isCriterionSpec(spec) ? resolveCriterionSpec(spec, ctx) : spec)
        .filter(row => row.visible?.(cards, ctx) !== false);
}
