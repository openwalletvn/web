import type {CashbackRule, Intent, Merchant, SpendTier} from '@/lib/api';
import {cn} from '@/lib/utils';
import {OwBadge} from '@/components/ow-ui/ow-badge';
import {OwFeeAmount} from '@/components/ow-ui/ow-fee-amount';
import {CATCHALL_SLUGS} from '@/lib/cashback-utils';
import {
    IconBuildingStore,
    IconCalendar,
    IconCircleCheck,
    IconCirclePercentage,
    IconCurrencyDollar,
    IconMapPin,
    IconMessageExclamation,
    IconSortAscending,
    IconWifi,
} from '@tabler/icons-react';

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatRate(rate: number): string {
    const pct = rate * 100;
    const rounded = Math.round(pct * 100) / 100;
    return `${rounded}%`;
}

function formatVnd(amount: number): string {
    return amount.toLocaleString('vi-VN') + 'đ';
}

// ─── Labels ──────────────────────────────────────────────────────────────────

const CHANNEL_LABELS: Record<string, string> = {
    online: 'Online',
    offline: 'Offline (POS)',
};

const GEOGRAPHY_LABELS: Record<string, string> = {
    domestic: 'Trong nước',
    foreign: 'Quốc tế',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function MerchantBadge({slug, merchantMap}: { slug: string; merchantMap: Map<string, Merchant> }) {
    const merchant = merchantMap.get(slug);
    const label = merchant?.label ?? (slug.charAt(0).toUpperCase() + slug.slice(1));
    return (
        <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {label}
        </span>
    );
}

function ScopeBadges({scope}: { scope: NonNullable<CashbackRule['scope']> }) {
    const channelLabel = scope.channel ? CHANNEL_LABELS[scope.channel] ?? scope.channel : null;
    const geoLabel = scope.geography
        ? (GEOGRAPHY_LABELS[scope.geography] ?? scope.geography.toUpperCase())
        : null;

    if (!channelLabel && !geoLabel) return null;

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {channelLabel && (
                <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700">
                    {scope.channel === 'online' ? <IconWifi className="w-3 h-3"/> :
                        <IconBuildingStore className="w-3 h-3"/>}
                    {channelLabel}
                </span>
            )}
            {geoLabel && (
                <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                    <IconMapPin className="w-3 h-3"/>
                    {geoLabel}
                </span>
            )}
        </div>
    );
}

function TiersTable({tiers}: { tiers: SpendTier[] }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <IconSortAscending className="w-3.5 h-3.5 text-slate-400"/>
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
                            {tier.cap != null ? <OwFeeAmount amount={tier.cap} compact textOnly/> : 'Không giới hạn'}
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
                          intentMap,
                      }: {
    categoryCaps: Record<string, number>;
    intentMap: Map<string, Pick<Intent, 'slug' | 'label' | 'icon'>>;
}) {
    const entries = Object.entries(categoryCaps);
    if (entries.length === 0) return null;
    return (
        <div className="pl-3 border-l-2 border-slate-200 space-y-1">
            <p className="text-xs text-slate-500">Trần riêng theo danh mục:</p>
            {entries.map(([slug, amount]) => {
                const cat = intentMap.get(slug);
                const label = cat ? `${cat.icon} ${cat.label}` : slug;
                return (
                    <div key={slug} className="flex items-center justify-between text-xs text-slate-700">
                        <span>{label}</span>
                        <span className="font-medium"><OwFeeAmount amount={amount} compact textOnly/></span>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface OwCardCashbackRuleProps {
    rule: CashbackRule;
    intentMap: Map<string, Pick<Intent, 'slug' | 'label' | 'icon'>>;
    merchantMap: Map<string, Merchant>;
}

export function OwCardCashbackRule({rule, intentMap, merchantMap}: OwCardCashbackRuleProps) {
    const rateLabel = rule.rate_max
        ? `${formatRate(rule.rate)} – ${formatRate(rule.rate_max)}`
        : formatRate(rule.rate);

    const isCatchAll = rule.intents?.some((c) => CATCHALL_SLUGS.has(c)) ?? false;

    const today = new Date().toISOString().slice(0, 10);
    const isExpired =
        (rule.valid_until != null && rule.valid_until < today) ||
        (rule.valid_from != null && rule.valid_from > today);

    return (
        <div
            className={cn('ow-card-cashback-rule rounded-lg flex gap-3 border-dashed border border-slate-300 p-4 w-full hover:bg-slate-50 transition-colors', isExpired && 'opacity-50')}>
            <IconCirclePercentage className="w-4 h-4 min-w-4 text-slate-500 translate-y-0.5 shrink-0"/>

            <div className="space-y-3 w-full">
                {/* Rate + scope badges */}
                <div className="flex flex-wrap items-start gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                        {rateLabel}
                        {isCatchAll && (
                            <span className="ml-2 font-normal text-slate-500">· Tất cả chi tiêu còn lại</span>
                        )}
                    </p>
                    {isExpired && (
                        <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Đã hết hạn
                        </span>
                    )}
                    {rule.scope && <ScopeBadges scope={rule.scope}/>}
                </div>

                {/* Validity window */}
                {(rule.valid_from || rule.valid_until) && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <IconCalendar className="w-3.5 h-3.5 text-slate-400"/>
                        {rule.valid_from && rule.valid_until
                            ? `${rule.valid_from} – ${rule.valid_until}`
                            : rule.valid_until
                                ? `Đến ${rule.valid_until}`
                                : `Từ ${rule.valid_from}`}
                    </div>
                )}

                {/* Spend tiers */}
                {rule.tiers && rule.tiers.length >= 2 && <TiersTable tiers={rule.tiers}/>}

                {/* Intents */}
                {!isCatchAll && rule.intents && rule.intents.length > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <IconCircleCheck className="w-3.5 h-3.5 text-green-600"/>
                            Danh mục áp dụng
                            {rule.max_intents != null && (
                                <span className="ml-1 text-slate-400">(chọn {rule.max_intents} mỗi kỳ)</span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {rule.intents.map((slug) => {
                                const cat = intentMap.get(slug);
                                return (
                                    <OwBadge key={slug} variant="intent" slug={slug} emoji={cat?.icon ?? '🏷️'}
                                             label={cat?.label ?? slug}
                                             small/>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Merchants */}
                {rule.merchants && rule.merchants.length > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <IconCircleCheck className="w-3.5 h-3.5 text-green-600"/>
                            Merchants
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {rule.merchants.map((m) => (
                                <MerchantBadge key={m} slug={m} merchantMap={merchantMap}/>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cap */}
                {rule.cap != null && (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <IconCurrencyDollar className="w-3.5 h-3.5 text-slate-400"/>
                            {rule.cap.amount === -1
                                ? 'Hoàn không giới hạn'
                                : <>Tối đa {rule.cap_max ? <><OwFeeAmount amount={rule.cap.amount} compact textOnly/> – <OwFeeAmount amount={rule.cap_max.amount} compact textOnly period="statementperiod"/></> : <OwFeeAmount amount={rule.cap.amount} compact textOnly period="statementperiod"/>}</>}
                        </div>
                        {rule.cap.category_caps && (
                            <CategoryCaps categoryCaps={rule.cap.category_caps} intentMap={intentMap}/>
                        )}
                    </div>
                )}

                {/* Note */}
                {rule.note && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <IconMessageExclamation className="w-3.5 h-3.5"/>
                            Ghi chú
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">{rule.note}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
