import type { Card, CashbackBenefit, CashbackCategory, CashbackRule } from '@/lib/api';
import { BadgePercent, CircleCheckBig, CircleDollarSign, Info, MessageCircleWarning } from 'lucide-react';

// ─── Formatters ────────────────────────────────────────────────────────────

function formatRate(rate: number): string {
    const pct = rate * 100;
    // Avoid floating point noise: 0.05 → 5, 0.015 → 1.5
    const rounded = Math.round(pct * 100) / 100;
    return `${rounded}%`;
}

function formatVnd(amount: number): string {
    return amount.toLocaleString('vi-VN') + 'đ';
}

// ─── Category labels ────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<CashbackCategory, string> = {
    dining:        'Ăn uống',
    travel:        'Du lịch',
    shopping:      'Mua sắm',
    groceries:     'Siêu thị',
    fuel:          'Xăng dầu',
    utilities:     'Hóa đơn',
    entertainment: 'Giải trí',
    health:        'Sức khỏe',
    education:     'Giáo dục',
    insurance:     'Bảo hiểm',
    digital:       'Số / Online',
    transport:     'Di chuyển',
    other:         'Khác',
};

// ─── Redemption labels ──────────────────────────────────────────────────────

const REDEMPTION_LABELS: Record<string, string> = {
    auto_statement_credit: 'Tự động khấu trừ sao kê',
    manual_request:        'Yêu cầu thủ công',
    points_pool:           'Tích điểm, đổi thưởng sau',
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: CashbackCategory }) {
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {CATEGORY_LABELS[category] ?? category}
        </span>
    );
}

function MerchantBadge({ slug }: { slug: string }) {
    // Capitalise first letter for display
    const label = slug.charAt(0).toUpperCase() + slug.slice(1);
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {label}
        </span>
    );
}

function RuleCard({ rule }: { rule: CashbackRule }) {
    const rateLabel = rule.rate_max
        ? `${formatRate(rule.rate)} – ${formatRate(rule.rate_max)}`
        : formatRate(rule.rate);

    const isCatchAll = !rule.categories?.length && !rule.merchants?.length;

    return (
        <div className="flex gap-3 border-dashed border border-slate-300 p-4 w-full hover:bg-slate-50 transition-colors">
            <BadgePercent className="w-4 h-4 min-w-4 text-slate-500 translate-y-0.5 shrink-0" />

            <div className="space-y-3 w-full">
                {/* Rate + catch-all label */}
                <p className="text-sm font-semibold text-slate-900">
                    {rateLabel}
                    {isCatchAll && (
                        <span className="ml-2 font-normal text-slate-500">· Tất cả chi tiêu còn lại</span>
                    )}
                </p>

                {/* Categories */}
                {rule.categories && rule.categories.length > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <CircleCheckBig className="w-3.5 h-3.5 text-green-600" />
                            Danh mục áp dụng
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {rule.categories.map((cat) => (
                                <CategoryBadge key={cat} category={cat} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Merchants */}
                {rule.merchants && rule.merchants.length > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <CircleCheckBig className="w-3.5 h-3.5 text-green-600" />
                            Merchants
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {rule.merchants.map((m) => (
                                <MerchantBadge key={m} slug={m} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Per-rule cap */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <CircleDollarSign className="w-3.5 h-3.5 text-slate-400" />
                    {rule.cap ? `Tối đa ${formatVnd(rule.cap.amount)} / kỳ sao kê` : 'Không giới hạn'}
                </div>

                {/* Note */}
                {rule.note && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MessageCircleWarning className="w-3.5 h-3.5" />
                            Ghi chú
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">{rule.note}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FooterRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start gap-2 text-xs text-slate-600">
            <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="w-40 shrink-0 text-slate-500">{label}</span>
            <span className="text-slate-800">{value}</span>
        </div>
    );
}

// ─── Main component ─────────────────────────────────────────────────────────

function CashbackSection({ cashback }: { cashback: CashbackBenefit }) {
    const hasFooter = cashback.min_spend_per_period || cashback.global_cap || cashback.redemption || cashback.note;

    return (
        <div className="space-y-3">
            {cashback.rules.map((rule, i) => (
                <RuleCard key={i} rule={rule} />
            ))}

            {hasFooter && (
                <div className="pt-2 border-t border-dashed border-slate-200 space-y-2">
                    {cashback.min_spend_per_period && (
                        <FooterRow
                            label="Chi tiêu tối thiểu"
                            value={`${formatVnd(cashback.min_spend_per_period)} / kỳ sao kê`}
                        />
                    )}
                    {cashback.global_cap && (
                        <FooterRow
                            label="Trần hoàn tiền tổng"
                            value={`${formatVnd(cashback.global_cap.amount)} / kỳ`}
                        />
                    )}
                    {cashback.redemption && (
                        <FooterRow
                            label="Hình thức nhận"
                            value={REDEMPTION_LABELS[cashback.redemption] ?? cashback.redemption}
                        />
                    )}
                    {cashback.note && (
                        <FooterRow label="Lưu ý" value={cashback.note} />
                    )}
                </div>
            )}
        </div>
    );
}

interface Props {
    card: Card;
}

export function CardDetailCashback({ card }: Props) {
    if (!card.cashback) return null;

    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Hoàn tiền</h2>
            <CashbackSection cashback={card.cashback} />
        </section>
    );
}
