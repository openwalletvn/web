import * as React from 'react';
import type {CashbackBenefit, Merchant} from '@/lib/api';
import {getIntents, getMerchants} from '@/lib/api';
import {IntentModel} from '@/lib/intent-model';
import type {CardModel} from '@/lib/card-model';
import {OwAmount} from '@/components/ow-ui/ow-amount';
import {IconAlertCircle, IconInfoCircle, IconPackages,} from '@tabler/icons-react';
import {CardDetailSection} from '@/components/cards/detail/card-detail-section';
import {fmtIsoDate, fmtIsoDateLifespan} from '@/lib/utils';
import {
    CashbackCalculator,
    type SerializedIntentMap,
    type SerializedMerchantMap
} from '@/components/cards/detail/cashback-calculator';

// ─── Labels ──────────────────────────────────────────────────────────────────

const REDEMPTION_LABELS: Record<string, string> = {
    auto_statement_credit: 'Tự động khấu trừ sao kê',
    manual_request: 'Yêu cầu thủ công',
    points_pool: 'Tích điểm, đổi thưởng sau',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FooterRow({label, value}: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2 text-xs text-slate-600">
            <IconInfoCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0"/>
            <span className="w-40 shrink-0 text-slate-500">{label}</span>
            <span className="text-slate-800">{value}</span>
        </div>
    );
}

// ─── Main component (async server component) ─────────────────────────────────

interface Props {
    card: CardModel;
}

export async function CardDetailCashback({card}: Props) {
    if (!card.getCashback()) return null;

    const [intents, merchants] = await Promise.all([
        getIntents().catch(() => []),
        getMerchants().catch(() => [] as Merchant[]),
    ]);
    const intentMap = IntentModel.toMap(intents);
    const merchantMap = new Map(merchants.map((m) => [m.slug, m]));

    const cashback = card.getCashback()!;

    const hasFooter =
        cashback.min_spend_per_period || cashback.global_cap || cashback.redemption || cashback.note;

    const allFrom = cashback.rules.map((r) => r.valid_from).filter(Boolean) as string[];
    const allUntil = cashback.rules.map((r) => r.valid_until).filter(Boolean) as string[];
    const programFrom = allFrom.length ? allFrom.reduce((a, b) => (a < b ? a : b)) : null;
    const programUntil = allUntil.length ? allUntil.reduce((a, b) => (a > b ? a : b)) : null;

    const expiredDateRange =
        programFrom && programUntil
            ? ` (${fmtIsoDate(programFrom)} – ${fmtIsoDate(programUntil)}${fmtIsoDateLifespan(programFrom, programUntil)})`
            : programUntil
                ? ` (đến ${fmtIsoDate(programUntil)})`
                : programFrom
                    ? ` (từ ${fmtIsoDate(programFrom)})`
                    : '';

    return (
        <CardDetailSection title="" className="ow-card-detail-cashback p-1 bg-primary gap-0 rounded-lg">
            <div className="py-2">
                <div className="text-label text-white text-center font-bold !text-lg">Hoàn tiền</div>
            </div>
            <div className="bg-white px-4 py-6 rounded-lg">
                <div className="space-y-3">
                    {cashback.cashback_expired && (
                        <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                            <IconAlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-500"/>
                            <span>
                                <strong>Chương trình hoàn tiền đã kết thúc{expiredDateRange}.</strong> Thông tin bên dưới chỉ mang tính tham khảo.
                            </span>
                        </div>
                    )}

                    {cashback.package_exclusive && (
                        <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                            <IconPackages className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600"/>
                            <span>
                                <strong>Chọn 1 gói khi phát hành thẻ.</strong> Mỗi gói áp dụng độc lập — không cộng dồn.
                            </span>
                        </div>
                    )}

                    {hasFooter && (
                        <div className="pt-2 border-t border-dashed border-slate-200 space-y-2">
                            {cashback.min_spend_per_period && (
                                <FooterRow
                                    label="Chi tiêu tối thiểu"
                                    value={<OwAmount amount={cashback.min_spend_per_period} unit="k" textOnly period="statementperiod"/>}
                                />
                            )}
                            {cashback.global_cap && (
                                <FooterRow
                                    label="Trần hoàn tiền tổng"
                                    value={
                                        cashback.global_cap.amount === -1
                                            ? 'Hoàn không giới hạn'
                                            : <>{cashback.global_cap_max ? <><OwAmount amount={cashback.global_cap.amount} unit="k" textOnly/> – <OwAmount amount={cashback.global_cap_max.amount} unit="k" textOnly period="period"/></> : <OwAmount amount={cashback.global_cap.amount} unit="k" textOnly period="period"/>}</>
                                    }
                                />
                            )}
                            {cashback.redemption && (
                                <FooterRow
                                    label="Hình thức nhận"
                                    value={REDEMPTION_LABELS[cashback.redemption] ?? cashback.redemption}
                                />
                            )}
                            {cashback.note && <FooterRow label="Lưu ý" value={cashback.note}/>}
                        </div>
                    )}
                </div>
                {card.getCashbackRules().length > 0 && (
                    <CashbackCalculator
                        cardId={card.getId()}
                        cashback={card.getCashback()!}
                        intentMap={Object.fromEntries([...intentMap.entries()].map(([k, v]) => [k, {
                            label: v.getLabel(),
                            icon: v.getIcon()
                        }])) as SerializedIntentMap}
                        merchantMap={Object.fromEntries([...merchantMap.entries()].map(([k, v]) => [k, {
                            label: v.label ?? k,
                            slug: v.slug
                        }])) as SerializedMerchantMap}
                    />
                )}


            </div>
        </CardDetailSection>
    );
}
