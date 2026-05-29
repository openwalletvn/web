'use client';

import {Suspense, useEffect, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {getTool} from '@/lib/tools';
import type {Intent, Persona} from '@/lib/api';
import type {RankedCard} from '@/lib/card-ranker';
import {Chip} from '@/components/ui/chip';
import {RankedRow} from '@/components/cards/ranked-row';
import {cn} from "@/lib/utils";

const STORAGE_KEY = 'ow-rec-prefs';
const cardMatchHref = getTool('Card Match').href;

interface CardMatchPrefs {
    persona: string | null;
    rankBy: 'cashback' | 'annual_fee';
    monthlySpend: number;
}

function readPrefs(): CardMatchPrefs | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as CardMatchPrefs;
    } catch {
        return null;
    }
}

function writePrefs(prefs: CardMatchPrefs): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
}

export interface CardMatchFinderProps {
    personas: Persona[];
    intents?: Intent[];
    limit?: number;
}

function CardMatchFinderInner({personas, intents = [], limit = 10}: CardMatchFinderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFinderPage = pathname === cardMatchHref;

    const [activePersona, setActivePersona] = useState<string | null>(null);
    const [activeIntents, setActiveIntents] = useState<string[]>([]);
    const [rankBy, setRankBy] = useState<'cashback' | 'annual_fee'>('cashback');
    const [monthlySpend, setMonthlySpend] = useState(5);
    const [initialized, setInitialized] = useState(false);
    const [ranked, setRanked] = useState<RankedCard[]>([]);
    const [loading, setLoading] = useState(false);

    // Init: URL params > localStorage > default (first persona)
    useEffect(() => {
        const urlPersona = isFinderPage ? searchParams.get('persona') : null;
        const urlRankBy = isFinderPage ? searchParams.get('sort_by') : null;
        const urlSpend = isFinderPage ? searchParams.get('spend') : null;

        if (urlPersona) {
            setActivePersona(urlPersona);
            if (urlRankBy === 'annual_fee') setRankBy('annual_fee');
            if (urlSpend) {
                const s = parseInt(urlSpend, 10);
                if (!isNaN(s) && s > 0) setMonthlySpend(s);
            }
        } else {
            const prefs = readPrefs();
            if (prefs?.persona) {
                setActivePersona(prefs.persona);
                setRankBy(prefs.rankBy ?? 'cashback');
                if (prefs.monthlySpend) setMonthlySpend(prefs.monthlySpend);
            } else if (personas.length > 0) {
                setActivePersona(personas[0].slug);
            }
        }
        setInitialized(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync URL + localStorage
    useEffect(() => {
        if (!initialized) return;
        writePrefs({persona: activePersona, rankBy, monthlySpend});
        if (isFinderPage && activePersona) {
            const p: Record<string, string> = {persona: activePersona};
            if (rankBy !== 'cashback') p.sort_by = rankBy;
            if (monthlySpend !== 5) p.spend = String(monthlySpend);
            router.replace(`${cardMatchHref}?${new URLSearchParams(p).toString()}`, {scroll: false});
        }
    }, [activePersona, rankBy, monthlySpend, initialized, isFinderPage, router]);

    useEffect(() => {
        if (!initialized) return;
        if (!activePersona) return;
        setLoading(true);
        const t = setTimeout(async () => {
            try {
                const res = await fetch('/api/ranking', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        persona: activePersona,
                        intents: activeIntents.length > 0 ? activeIntents : undefined,
                        limit,
                        for_business: false,
                        sort_by: rankBy,
                        monthly_spend: monthlySpend * 1_000_000,
                    }),
                });
                const json = await res.json();
                if (json.data) setRanked(json.data);
            } finally {
                setLoading(false);
            }
        }, 200);
        return () => clearTimeout(t);
    }, [activePersona, activeIntents, rankBy, monthlySpend, initialized, limit]);

    const personaObj = personas.find(p => p.slug === activePersona);
    const personaIntents = intents.filter(i => personaObj?.rank_intents?.includes(i.slug));
    const intentMap = new Map(intents.map(i => [i.slug, i]));

    const toggleIntent = (slug: string) => {
        setActiveIntents(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    };

    const withCashback = ranked.filter(r => r.cashback_result.cashback > 0);

    return (
        <div className="ow-card-match-finder mb-16">
            <h2 className="mb-12">Tìm thẻ tối ưu cho nhu cầu của bạn</h2>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                {/* Left: controls */}
                <div className={cn(
                    "lg:col-span-5",
                    loading ? 'pointer-events-none opacity-60' : ''
                )}>
                    <div className="sticky top-12">
                        {/* Step 1: Persona */}
                        <div className="mb-6">
                            <h2 className="text-body-lg text-text-muted mb-4">Bạn hay chi tiêu ở đâu?</h2>
                            <div className="flex flex-wrap gap-2">
                                {personas.map(p => (
                                    <Chip
                                        key={p.slug}
                                        active={activePersona === p.slug}
                                        onClick={() => { setActivePersona(p.slug); setActiveIntents([]); }}
                                    >
                                        {p.labelVi || p.label}
                                    </Chip>
                                ))}
                            </div>

                            {personaIntents.length > 0 && (
                                <div className="flex mt-5">
                                    <div className="flex flex-wrap gap-2">
                                        {personaIntents.map(intent => (
                                            <Chip
                                                key={intent.slug}
                                                // active={activeIntents.includes(intent.slug)}
                                                // onClick={() => toggleIntent(intent.slug)}
                                                className="text-sm px-3 py-1"
                                            >
                                                {intent.icon} {intent.label}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Monthly spend */}
                        <div>
                            <h2 className="text-body-lg text-text-muted mb-4">Chi tiêu hàng tháng khoảng bao
                                nhiêu?</h2>
                            <div className="flex flex-wrap gap-2">
                                {[1, 3, 5, 10, 20, 50, 100].map(v => (
                                    <Chip key={v} active={monthlySpend === v} onClick={() => setMonthlySpend(v)}>
                                        {v}tr
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: results */}
                <div className="lg:col-span-7">
                    <div className="flex items-center flex-wrap justify-between mb-4 gap-3">
                        <p className="text-label text-text-muted">KẾT QUẢ ĐỀ XUẤT</p>
                        <div className="flex flex-wrap gap-1">
                            <Chip active={rankBy === 'cashback'} onClick={() => setRankBy('cashback')}>
                                Hoàn tiền cao nhất
                            </Chip>
                            <Chip active={rankBy === 'annual_fee'} onClick={() => setRankBy('annual_fee')}>
                                Phí thấp nhất
                            </Chip>
                        </div>
                    </div>

                    {!activePersona ? (
                        <p className="text-body-sm text-text-muted">Chọn nhóm chi tiêu để xem đề xuất.</p>
                    ) : loading && ranked.length === 0 ? (
                        <div className="flex flex-col gap-3">
                            {Array.from({length: limit}).map((_, i) => (
                                <div key={i}
                                     className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-bg-muted">
                                    <div className="shrink-0 w-10 h-10 rounded bg-border"/>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="h-3 rounded bg-border w-2/3"/>
                                        <div className="h-3 rounded bg-border w-1/3"/>
                                    </div>
                                    <div className="h-4 rounded bg-border w-16"/>
                                </div>
                            ))}
                        </div>
                    ) : !loading && withCashback.length === 0 ? (
                        <p className="text-body-sm text-text-muted">Không tìm thấy thẻ phù hợp.</p>
                    ) : (
                        <div className={cn('flex flex-col gap-6 transition-opacity duration-200', loading ? 'opacity-50' : '')}>
                            {ranked.map(r => (
                                <RankedRow
                                    key={r.card.id}
                                    ranked={r}
                                    intentMap={intentMap}
                                    highlightedSlugs={activeIntents.length > 0 ? activeIntents : personaObj?.rank_intents}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function CardMatchFinder(props: CardMatchFinderProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return (
        <Suspense>
            <CardMatchFinderInner {...props}/>
        </Suspense>
    );
}
