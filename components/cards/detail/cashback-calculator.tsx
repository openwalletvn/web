'use client';
import * as React from 'react';
import type {CashbackResult} from '@/lib/api';
import {IconAlertTriangle, IconLoader2, IconSparkles} from '@tabler/icons-react';

const SPEND_STEPS = [1_000_000, 2_000_000, 3_000_000, 5_000_000, 7_000_000, 10_000_000, 15_000_000, 20_000_000];
const DEFAULT_STEP = 2;

function fmtVnd(n: number): string {
    if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}tr`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
    return `${n}đ`;
}

function fmtPct(n: number): string {
    return `${Math.round(n * 10000) / 100}%`;
}

type IntentMeta = { label: string; icon: string };

interface Props {
    cardId: string;
    cardIntents: string[];
    intentMap: Record<string, IntentMeta>;
}

export function CashbackCalculator({cardId, cardIntents, intentMap}: Props) {
    const [stepIdx, setStepIdx] = React.useState(DEFAULT_STEP);
    const [selected, setSelected] = React.useState<Set<string>>(new Set(cardIntents));
    const [result, setResult] = React.useState<CashbackResult | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const totalSpend = SPEND_STEPS[stepIdx];
    const intents = [...selected];

    React.useEffect(() => {
        if (intents.length === 0) {
            setResult(null);
            return;
        }
        let cancelled = false;
        setLoading(true);
        setError(false);
        fetch('/api/cashback', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({total_spend: totalSpend, intents, cards: [cardId]}),
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
    }, [totalSpend, intents.join(','), cardId]);

    const toggleIntent = (slug: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(slug)) next.delete(slug);
            else next.add(slug);
            return next;
        });
    };

    const cardData = result?.by_card?.[cardId];
    const totalCashback = cardData?.cashback ?? result?.total_cashback ?? 0;
    const effectiveRate = result?.effective_rate ?? 0;

    const byIntentEntries = result?.by_intent
        ? Object.entries(result.by_intent).filter(([, v]) => v.best_card_id === cardId)
        : [];

    const notes = cardData?.notes ?? [];
    const suggestions = result?.suggestions ?? [];

    return (
        <div className="ow-cashback-calculator border border-dashed border-slate-200 rounded-lg p-4 flex flex-col gap-4 mt-1">
            <p className="text-label text-sm">Thử nghiệm hoàn tiền</p>

            {/* Spend slider */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Chi tiêu / tháng</span>
                    <span className="font-semibold text-black">{totalSpend.toLocaleString('vi-VN')}đ</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={SPEND_STEPS.length - 1}
                    step={1}
                    value={stepIdx}
                    onChange={e => setStepIdx(Number(e.target.value))}
                    className="w-full accent-red-500"
                />
                <div className="flex justify-between text-[10px] text-text-muted/60">
                    <span>{fmtVnd(SPEND_STEPS[0])}</span>
                    <span>{fmtVnd(SPEND_STEPS[SPEND_STEPS.length - 1])}</span>
                </div>
            </div>

            {/* Intent chips */}
            <div className="flex flex-wrap gap-1.5">
                {cardIntents.map(slug => {
                    const meta = intentMap[slug];
                    const active = selected.has(slug);
                    return (
                        <button
                            key={slug}
                            onClick={() => toggleIntent(slug)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs transition-colors ${
                                active
                                    ? 'bg-red-50 border-red-300 text-red-700'
                                    : 'bg-white border-slate-200 text-slate-400'
                            }`}
                        >
                            {meta?.icon && <span>{meta.icon}</span>}
                            <span>{meta?.label ?? slug}</span>
                        </button>
                    );
                })}
            </div>

            {/* Result */}
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 flex flex-col gap-2 min-h-[80px]">
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
                        {byIntentEntries.length > 0 && (
                            <div className="pt-1.5 border-t border-slate-200 flex flex-col gap-1">
                                {byIntentEntries.map(([slug, v]) => {
                                    const meta = intentMap[slug];
                                    return (
                                        <div key={slug} className="flex items-center justify-between text-xs">
                                            <span className="text-text-muted flex items-center gap-1">
                                                {meta?.icon && <span>{meta.icon}</span>}
                                                <span>{meta?.label ?? slug}</span>
                                            </span>
                                            <span className="text-slate-700">
                                                {v.budget != null && <span className="text-text-muted mr-1">{fmtVnd(v.budget)} →</span>}
                                                <span className="font-medium">{(v.cashback ?? 0).toLocaleString('vi-VN')}đ</span>
                                                {v.rate != null && <span className="text-text-muted ml-1">({fmtPct(v.rate)})</span>}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {totalCashback === 0 && intents.length > 0 && (
                            <p className="text-xs text-text-muted">Không có hoàn tiền cho danh mục đã chọn</p>
                        )}
                    </>
                )}
                {!loading && !error && !result && intents.length === 0 && (
                    <p className="text-xs text-text-muted">Chọn ít nhất một danh mục</p>
                )}
            </div>

            {/* Notes + suggestions */}
            {[...notes, ...suggestions].map((msg, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700">
                    <IconSparkles size={13} className="mt-0.5 shrink-0 text-amber-400"/>
                    <span>{msg}</span>
                </div>
            ))}
        </div>
    );
}
