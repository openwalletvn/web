import type { Card, CashbackBenefit, CashbackCategory, CashbackRule, Merchant, SpendTier } from '@/lib/api';
import { getCashbackCategories, getMerchants } from '@/lib/api';
import { CATCHALL_SLUGS } from '@/lib/cashback-utils';
import {
 IconCirclePercentage,
 IconCircleCheck,
 IconCurrencyDollar,
 IconInfoCircle,
 IconMessageExclamation,
 IconMapPin,
 IconWifi,
 IconBuildingStore,
 IconPackages,
 IconSortAscending,
} from '@tabler/icons-react';

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
 return amount === -1 ? 'Không giới hạn' : formatVnd(amount);
}

// ─── Redemption labels ───────────────────────────────────────────────────────

const REDEMPTION_LABELS: Record<string, string> = {
 auto_statement_credit: 'Tự động khấu trừ sao kê',
 manual_request: 'Yêu cầu thủ công',
 points_pool: 'Tích điểm, đổi thưởng sau',
};

const CHANNEL_LABELS: Record<string, string> = {
 online: 'Online',
 offline: 'Offline (POS)',
};

const GEOGRAPHY_LABELS: Record<string, string> = {
 domestic: 'Trong nước',
 foreign: 'Quốc tế',
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

function ScopeBadges({ scope }: { scope: NonNullable<CashbackRule['scope']> }) {
 const channelLabel = scope.channel ? CHANNEL_LABELS[scope.channel] ?? scope.channel : null;
 const geoLabel = scope.geography
  ? (GEOGRAPHY_LABELS[scope.geography] ?? scope.geography.toUpperCase())
  : null;

 if (!channelLabel && !geoLabel) return null;

 return (
  <div className="flex items-center gap-1.5 flex-wrap">
   {channelLabel && (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700">
     {scope.channel === 'online' ? (
      <IconWifi className="w-3 h-3" />
     ) : (
      <IconBuildingStore className="w-3 h-3" />
     )}
     {channelLabel}
    </span>
   )}
   {geoLabel && (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
     <IconMapPin className="w-3 h-3" />
     {geoLabel}
    </span>
   )}
  </div>
 );
}

function TiersTable({ tiers }: { tiers: SpendTier[] }) {
 return (
  <div className="space-y-1.5">
   <div className="flex items-center gap-1.5 text-xs text-slate-600">
    <IconSortAscending className="w-3.5 h-3.5 text-slate-400" />
    Bậc chi tiêu
   </div>
   <table className="w-full text-xs border-collapse">
    <thead>
     <tr className="text-left text-slate-500">
      <th className="pb-1 pr-3 font-medium">Chi tiêu tối thiểu</th>
      <th className="pb-1 pr-3 font-medium">Hoàn</th>
      <th className="pb-1 font-medium">Trần / kỳ</th>
     </tr>
    </thead>
    <tbody>
     {tiers.map((tier, i) => (
      <tr key={i} className="border-t border-slate-100">
       <td className="py-1 pr-3 text-slate-700">
        {tier.min_spend === 0 ? 'Dưới bậc kế tiếp' : `≥ ${formatVnd(tier.min_spend)}`}
       </td>
       <td className="py-1 pr-3 font-semibold text-slate-900">{formatRate(tier.rate)}</td>
       <td className="py-1 text-slate-700">
        {tier.cap != null ? formatVnd(tier.cap) : 'Không giới hạn'}
       </td>
      </tr>
     ))}
    </tbody>
   </table>
  </div>
 );
}

function CategoryCaps({
 categoryCaps,
 categoryMap,
}: {
 categoryCaps: Record<string, number>;
 categoryMap: Map<string, CashbackCategory>;
}) {
 const entries = Object.entries(categoryCaps);
 if (entries.length === 0) return null;
 return (
  <div className="pl-3 border-l-2 border-slate-200 space-y-1">
   <p className="text-xs text-slate-500">Trần riêng theo danh mục:</p>
   {entries.map(([slug, amount]) => {
    const cat = categoryMap.get(slug);
    const label = cat ? `${cat.icon} ${cat.label}` : slug;
    return (
     <div key={slug} className="flex items-center justify-between text-xs text-slate-700">
      <span>{label}</span>
      <span className="font-medium">{formatVnd(amount)}</span>
     </div>
    );
   })}
  </div>
 );
}

function RuleCard({
 rule,
 categoryMap,
 merchantMap,
}: {
 rule: CashbackRule;
 categoryMap: Map<string, CashbackCategory>;
 merchantMap: Map<string, Merchant>;
}) {
 const rateLabel = rule.rate_max
  ? `${formatRate(rule.rate)} – ${formatRate(rule.rate_max)}`
  : formatRate(rule.rate);

 const isCatchAll = rule.intents?.some((c) => CATCHALL_SLUGS.has(c)) ?? false;

 return (
  <div className="flex gap-3 border-dashed border border-slate-300 p-4 w-full hover:bg-slate-50 transition-colors">
   <IconCirclePercentage className="w-4 h-4 min-w-4 text-slate-500 translate-y-0.5 shrink-0" />

   <div className="space-y-3 w-full">
    {/* Rate + scope badges */}
    <div className="flex flex-wrap items-start gap-2">
     <p className="text-sm font-semibold text-slate-900">
      {rateLabel}
      {isCatchAll && (
       <span className="ml-2 font-normal text-slate-500">· Tất cả chi tiêu còn lại</span>
      )}
     </p>
     {rule.scope && <ScopeBadges scope={rule.scope} />}
    </div>

    {/* Spend tiers */}
    {rule.tiers && rule.tiers.length >= 2 && <TiersTable tiers={rule.tiers} />}

    {/* Intents */}
    {!isCatchAll && rule.intents && rule.intents.length > 0 && (
     <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs text-slate-600">
       <IconCircleCheck className="w-3.5 h-3.5 text-green-600" />
       Danh mục áp dụng
       {rule.max_intents != null && (
        <span className="ml-1 text-slate-400">(chọn {rule.max_intents} mỗi kỳ)</span>
       )}
      </div>
      <div className="flex flex-wrap gap-1.5">
       {rule.intents.map((slug) => (
        <CategoryBadge key={slug} slug={slug} categoryMap={categoryMap} />
       ))}
      </div>
     </div>
    )}

    {/* Merchants */}
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

    {/* Cap */}
    <div className="space-y-1.5">
     <div className="flex items-center gap-1.5 text-xs text-slate-600">
      <IconCurrencyDollar className="w-3.5 h-3.5 text-slate-400" />
      {rule.cap && rule.cap.amount !== -1
       ? `Tối đa ${formatCap(rule.cap.amount)}${rule.cap_max ? ` – ${formatCap(rule.cap_max.amount)}` : ''} / kỳ sao kê`
       : 'Hoàn không giới hạn'}
     </div>
     {rule.cap?.category_caps && (
      <CategoryCaps categoryCaps={rule.cap.category_caps} categoryMap={categoryMap} />
     )}
    </div>

    {/* Note */}
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

function CashbackSection({
 cashback,
 categoryMap,
 merchantMap,
}: {
 cashback: CashbackBenefit;
 categoryMap: Map<string, CashbackCategory>;
 merchantMap: Map<string, Merchant>;
}) {
 const hasFooter =
  cashback.min_spend_per_period || cashback.global_cap || cashback.redemption || cashback.note;

 const sortedRules = [...cashback.rules].sort(
  (a, b) => (b.rate_max ?? b.rate) - (a.rate_max ?? a.rate),
 );

 return (
  <div className="space-y-3">
   {cashback.package_exclusive && (
    <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
     <IconPackages className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
     <span>
      <strong>Chọn 1 gói khi phát hành thẻ.</strong> Mỗi gói áp dụng độc lập — không cộng dồn.
     </span>
    </div>
   )}

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
       value={
        cashback.global_cap.amount === -1
         ? 'Hoàn không giới hạn'
         : `${formatVnd(cashback.global_cap.amount)}${cashback.global_cap_max ? ` – ${formatCap(cashback.global_cap_max.amount)}` : ''} / kỳ`
       }
      />
     )}
     {cashback.redemption && (
      <FooterRow
       label="Hình thức nhận"
       value={REDEMPTION_LABELS[cashback.redemption] ?? cashback.redemption}
      />
     )}
     {cashback.note && <FooterRow label="Lưu ý" value={cashback.note} />}
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
