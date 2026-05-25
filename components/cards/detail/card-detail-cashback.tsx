import type { Card, CashbackBenefit, CashbackCategory, CashbackRule, Merchant } from '@/lib/api';
import { getCashbackCategories, getMerchants } from '@/lib/api';
import { IconCirclePercentage, IconCircleCheck, IconCurrencyDollar, IconInfoCircle, IconMessageExclamation } from '@tabler/icons-react';

// ─── Formatters ─────────────────────────────────────────────────────────────

function formatRate(rate: number): string {
 const pct = rate * 100;
 const rounded = Math.round(pct * 100) / 100;
 return `${rounded}%`;
}

function formatVnd(amount: number): string {
 return amount.toLocaleString('vi-VN') + 'đ';
}

function formatCap(amount: number): string {
 return amount === -1 ? 'Hoàn không giới hạn' : formatVnd(amount);
}

const CATCHALL_SLUGS = new Set(['all', 'all-online', 'all-offline']);

// ─── Redemption labels ───────────────────────────────────────────────────────

const REDEMPTION_LABELS: Record<string, string> = {
 auto_statement_credit: 'Tự động khấu trừ sao kê',
 manual_request: 'Yêu cầu thủ công',
 points_pool: 'Tích điểm, đổi thưởng sau',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function CategoryBadge({ slug, categoryMap }: { slug: string; categoryMap: Map<string, CashbackCategory> }) {
 const cat = categoryMap.get(slug);
 const label = cat ? `${cat.icon} ${cat.label}` : slug;
 return (
 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
 {label}
 </span>
 );
}

function MerchantBadge({ slug, merchantMap }: { slug: string; merchantMap: Map<string, Merchant> }) {
 const merchant = merchantMap.get(slug);
 const label = merchant?.label ?? (slug.charAt(0).toUpperCase() + slug.slice(1));
 return (
 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
 {label}
 </span>
 );
}

function RuleCard({ rule, categoryMap, merchantMap }: { rule: CashbackRule; categoryMap: Map<string, CashbackCategory>; merchantMap: Map<string, Merchant> }) {
 const rateLabel = rule.rate_max
 ? `${formatRate(rule.rate)} – ${formatRate(rule.rate_max)}`
 : formatRate(rule.rate);

 const isCatchAll = rule.categories?.some(c => CATCHALL_SLUGS.has(c)) ?? false;

 return (
 <div className="flex gap-3 border-dashed border border-slate-300 p-4 w-full hover:bg-slate-50 transition-colors">
 <IconCirclePercentage className="w-4 h-4 min-w-4 text-slate-500 translate-y-0.5 shrink-0" />

 <div className="space-y-3 w-full">
 <p className="text-sm font-semibold text-slate-900">
 {rateLabel}
 {isCatchAll && (
 <span className="ml-2 font-normal text-slate-500">· Tất cả chi tiêu còn lại</span>
 )}
 </p>

 {!isCatchAll && rule.categories && rule.categories.length > 0 && (
 <div className="space-y-1.5">
 <div className="flex items-center gap-1.5 text-xs text-slate-600">
 <IconCircleCheck className="w-3.5 h-3.5 text-green-600" />
 Danh mục áp dụng
 </div>
 <div className="flex flex-wrap gap-1.5">
 {rule.categories.map((slug) => (
 <CategoryBadge key={slug} slug={slug} categoryMap={categoryMap} />
 ))}
 </div>
 </div>
 )}

 {rule.merchants && rule.merchants.length > 0 && (
 <div className="space-y-1.5">
 <div className="flex items-center gap-1.5 text-xs text-slate-600">
 <IconCircleCheck className="w-3.5 h-3.5 text-green-600" />
 Merchants
 </div>
 <div className="flex flex-wrap gap-1.5">
 {rule.merchants.map((m) => (
 <MerchantBadge key={m} slug={m} merchantMap={merchantMap} />
 ))}
 </div>
 </div>
 )}

 <div className="flex items-center gap-1.5 text-xs text-slate-600">
 <IconCurrencyDollar className="w-3.5 h-3.5 text-slate-400" />
 {rule.cap && rule.cap.amount !== -1
 ? `Tối đa ${formatCap(rule.cap.amount)}${rule.cap_max ? ` – ${formatCap(rule.cap_max.amount)}` : ''} / kỳ sao kê`
 : 'Hoàn không giới hạn'}
 </div>

 {rule.note && (
 <div className="space-y-1">
 <div className="flex items-center gap-1.5 text-xs text-slate-600">
 <IconMessageExclamation className="w-3.5 h-3.5" />
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
 <IconInfoCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
 <span className="w-40 shrink-0 text-slate-500">{label}</span>
 <span className="text-slate-800">{value}</span>
 </div>
 );
}

function CashbackSection({ cashback, categoryMap, merchantMap }: { cashback: CashbackBenefit; categoryMap: Map<string, CashbackCategory>; merchantMap: Map<string, Merchant> }) {
 const hasFooter = cashback.min_spend_per_period || cashback.global_cap || cashback.redemption || cashback.note;

 const sortedRules = [...cashback.rules].sort((a, b) => (b.rate_max ?? b.rate) - (a.rate_max ?? a.rate));

 return (
 <div className="space-y-3">
 {sortedRules.map((rule, i) => (
 <RuleCard key={i} rule={rule} categoryMap={categoryMap} merchantMap={merchantMap} />
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
 value={cashback.global_cap.amount === -1 ? 'Hoàn không giới hạn' : `${formatVnd(cashback.global_cap.amount)}${cashback.global_cap_max ? ` – ${formatCap(cashback.global_cap_max.amount)}` : ''} / kỳ`}
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

// ─── Main component (async server component) ─────────────────────────────────

interface Props {
 card: Card;
}

export async function CardDetailCashback({ card }: Props) {
 if (!card.cashback) return null;

 const [categories, merchants] = await Promise.all([
 getCashbackCategories().catch(() => [] as CashbackCategory[]),
 getMerchants().catch(() => [] as Merchant[]),
 ]);
 const categoryMap = new Map(categories.map((c) => [c.slug, c]));
 const merchantMap = new Map(merchants.map((m) => [m.slug, m]));

 return (
 <section className="ow-card-detail-cashback flex flex-col gap-4">
 <h2 className="text-label text-text-muted">Hoàn tiền</h2>
 <CashbackSection cashback={card.cashback} categoryMap={categoryMap} merchantMap={merchantMap} />
 </section>
 );
}
