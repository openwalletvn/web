'use client';
import * as React from 'react';
import type {CashbackBenefit, CashbackResult, Merchant} from '@/lib/api';
import {IconAlertTriangle, IconLoader2} from '@tabler/icons-react';
import {OwRangeSlider} from '@/components/ow-ui/ow-range-slider';
import {formatOwAmount, OwAmount} from '@/components/ow-ui/ow-amount';
import {OwCardCashbackRule} from '@/components/ow-ui/ow-card-cashback-rule';
import {IntentModel} from '@/lib/intent-model';
import {CATCHALL_SLUGS} from '@/lib/cashback-utils';
import {OwAlert} from "@/components/ow-ui/ow-alert";

export type SerializedIntentMap = Record<string, {label: string; icon: string}>;
export type SerializedMerchantMap = Record<string, {label: string; slug: string}>;

const SPEND_MIN = 500_000;
const SPEND_MAX = 20_000_000;
const SPEND_STEP = 500_000;
const SPEND_DEFAULT = 3_000_000;

function fmtPct(n: number): string {
    return `${Math.round(n * 10000) / 100}%`;
}

interface Props {
    cardId: string;
    cashback: CashbackBenefit;
    intentMap: SerializedIntentMap;
    merchantMap: SerializedMerchantMap;
}

export function CashbackCalculator({cardId, cashback, intentMap, merchantMap}: Props) {
    const intentModelMap = React.useMemo(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        () => new Map(Object.entries(intentMap).map(([k, v]) => [k, new IntentModel({slug: k, label: v.label, icon: v.icon} as any)])),
        [intentMap],
    );
    const merchantModelMap = React.useMemo(
        () => new Map(Object.entries(merchantMap).map(([k, v]) => [k, v as Merchant])),
        [merchantMap],
    );
    const rules = cashback.rules ?? [];
    const maxActiveRules = cashback.max_active_rules;

    const initialSelected = React.useMemo(() => {
        if (maxActiveRules) {
            return new Set([0]);
        }
        return new Set(rules.map((_, i) => i));
    }, []);

    const [selected, setSelected] = React.useState<Set<number>>(initialSelected);
    const [totalSpend, setTotalSpend] = React.useState(SPEND_DEFAULT);
    const [result, setResult] = React.useState<CashbackResult | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const toggleRule = (idx: number) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (maxActiveRules) {
                return new Set([idx]);
            }
            if (next.has(idx)) {
                if (next.size === 1) return prev;
                next.delete(idx);
            } else {
                next.add(idx);
            }
            return next;
        });
    };

    const selectedIntents = React.useMemo(() => {
        const slugs = new Set<string>();
        for (const idx of selected) {
            const rule = rules[idx];
            if (!rule) continue;
            for (const s of rule.intents ?? []) {
                if (!CATCHALL_SLUGS.has(s)) slugs.add(s);
            }
            for (const m of rule.merchants ?? []) slugs.add(m);
        }
        return [...slugs];
    }, [selected, rules]);

    React.useEffect(() => {
        if (selectedIntents.length === 0) {
            setResult(null);
            return;
        }
        let cancelled = false;
        setLoading(true);
        setError(false);
        fetch('/api/cashback', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({total_spend: totalSpend, intents: selectedIntents, cards: [cardId]}),
        })
            .then(r => r.json())
            .then(json => {
                if (!cancelled) {
                    setResult(json.data ?? null);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError(true);
                    setLoading(false);
                }
            });
        return () => { cancelled = true; };
    }, [totalSpend, selectedIntents.join(','), cardId]);

    const cardData = result?.by_card?.[cardId];
    const totalCashback = cardData?.cashback ?? result?.total_cashback ?? 0;
    const effectiveRate = result?.effective_rate ?? 0;

    const byIntentMap = result?.by_intent ?? {};

    const getRuleEstimate = (idx: number): number | null => {
        if (!result || !selected.has(idx)) return null;
        const rule = rules[idx];
        if (!rule) return null;
        const ruleIntents = [...(rule.intents ?? []).filter(s => !CATCHALL_SLUGS.has(s)), ...(rule.merchants ?? [])];
        if (ruleIntents.length === 0) {
            return cardData?.cashback ?? null;
        }
        let sum = 0;
        for (const slug of ruleIntents) {
            const entry = byIntentMap[slug];
            if (entry?.best_card_id === cardId) sum += entry.cashback ?? 0;
        }
        return sum > 0 ? sum : (cardData?.cashback ?? null);
    };

    const notes = cardData?.notes ?? [];
    const suggestions = result?.suggestions ?? [];

    return (
        <div className="ow-cashback-calculator flex flex-col gap-3 mt-2">
            {maxActiveRules && (
                <OwAlert variant="info">
                    Chọn {maxActiveRules === 1 ? '1 nhóm ưu đãi' : `tối đa ${maxActiveRules} nhóm`} mỗi kỳ sao kê
                </OwAlert>
            )}

            {rules.map((rule, idx) => (
                <OwCardCashbackRule
                    key={idx}
                    rule={rule}
                    intentMap={intentModelMap}
                    merchantMap={merchantModelMap}
                    selectable
                    selected={selected.has(idx)}
                    onToggle={() => toggleRule(idx)}
                    estimatedCashback={getRuleEstimate(idx)}
                />
            ))}

            {/* Spend slider */}
            <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Chi tiêu / tháng</span>
                    <span className="font-semibold text-black">{totalSpend.toLocaleString('vi-VN')}đ</span>
                </div>
                <OwRangeSlider
                    min={SPEND_MIN}
                    max={SPEND_MAX}
                    step={SPEND_STEP}
                    value={totalSpend}
                    onChange={setTotalSpend}
                    formatTooltip={v => formatOwAmount(v, 'k')}
                />
                <div className="flex justify-between text-[10px] text-text-muted/60">
                    <OwAmount amount={SPEND_MIN} unit="k" textOnly/>
                    <OwAmount amount={SPEND_MAX} unit="k" textOnly/>
                </div>
            </div>

            {/* Result */}
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 flex flex-col gap-2 min-h-[52px]">
                {loading && (
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                        <IconLoader2 size={14} className="animate-spin"/>
                        <span>Đang tính...</span>
                    </div>
                )}
                {error && !loading && (
                    <div className="flex items-center gap-2 text-xs text-red-600">
                        <IconAlertTriangle size={14}/>
                        <span>Không thể tính hoàn tiền</span>
                    </div>
                )}
                {!loading && !error && result && (
                    <>
                        <div className="flex items-baseline justify-between">
                            <span className="text-xs text-text-muted">Hoàn tiền ước tính</span>
                            <span className="text-lg font-bold text-black">
                                {totalCashback.toLocaleString('vi-VN')}đ
                                <span className="text-xs font-normal text-text-muted">/kỳ</span>
                            </span>
                        </div>
                        {effectiveRate > 0 && (
                            <div className="flex items-baseline justify-between">
                                <span className="text-xs text-text-muted">Tỉ lệ hiệu quả</span>
                                <span className="text-xs font-semibold text-emerald-600">{fmtPct(effectiveRate)}</span>
                            </div>
                        )}
                    </>
                )}
                {!loading && !error && !result && selectedIntents.length === 0 && (
                    <p className="text-xs text-text-muted">Chọn ít nhất một nhóm ưu đãi</p>
                )}
            </div>

            {[...notes, ...suggestions].map((msg, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
                    <span className="mt-0.5 shrink-0 text-amber-400">✦</span>
                    <span>{msg}</span>
                </div>
            ))}
        </div>
    );
}
