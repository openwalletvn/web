'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {IconX} from '@tabler/icons-react';
import {normalizePair, useRecentCompares} from '@/lib/use-recent-compares';
import {useCardSearch} from '@/lib/use-card-search';
import {getTool} from '@/lib/tools';
import {OwCardImage} from '@/components/ow-ui/ow-card-image';

const cardBattleHref = getTool('Card Battle').href;

function formatRelativeTime(ts: number): string {
    const diffMs = Date.now() - ts;
    const diffMin = Math.floor(diffMs / 60_000);
    const diffH = Math.floor(diffMs / 3_600_000);
    const diffD = Math.floor(diffMs / 86_400_000);
    if (diffMin < 1) return 'vừa xem';
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffH < 24) return `${diffH} giờ trước`;
    if (diffD === 1) return 'hôm qua';
    return `${diffD} ngày trước`;
}

interface Props {
    excludePair?: string;
}

export function RecentCompares({ excludePair }: Props = {}) {
    const {recentCompares, removeCompare} = useRecentCompares();
    const excludeKey = excludePair ? normalizePair(excludePair) : null;
    const {lookup, load} = useCardSearch();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        load();
    }, [load]);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Deduplicate by normalized key, preferring SEO slug format
    const bestByKey = new Map<string, typeof recentCompares[0]>();
    for (const e of recentCompares) {
        const key = normalizePair(e.pair);
        const cur = bestByKey.get(key);
        if (!cur || (e.pair.includes('-vs-') && !cur.pair.includes('-vs-'))) {
            bestByKey.set(key, e);
        }
    }
    const visible = [...bestByKey.values()].filter(
        (e) => !excludeKey || normalizePair(e.pair) !== excludeKey
    );

    if (!mounted || visible.length === 0) return null;

    return (
        <div className="ow-recent-compares mt-16 pt-10 border-t border-slate-100 animate-in fade-in duration-500">
            <h2 className="heading-3 mb-4">Đã xem gần đây</h2>
            <div className="divide-y divide-slate-100">
                {visible.map(({pair, visitedAt}) => {
                    const ids = pair.includes(',') ? pair.split(',') : pair.split('-vs-');
                    const searchCards = ids.map((id) => lookup(id));

                    const href = pair.includes('-vs-')
                        ? `${cardBattleHref}/${pair}`
                        : `${cardBattleHref}?compare=${ids.join(',')}`;

                    return (
                        <div key={pair} className="group grid grid-cols-12 items-center gap-2 py-3">
                            <div className="col-span-10">
                                <Link
                                    href={href}
                                    className="grid grid-cols-12 items-center gap-2 min-w-0 hover:opacity-80 transition-opacity"
                                >
                                    {searchCards.map((sc, i) => (
                                        <div key={ids[i]}
                                             className="sm:col-span-4 col-span-12 flex items-center gap-1.5 min-w-0">
                                            {sc?.image_url ? (
                                                <OwCardImage src={sc.image_url} alt={sc.name}
                                                             width={16}
                                                             height={sc.is_vertical ? 24 : 10}
                                                             className="w-11 h-auto shrink-0"/>
                                            ) : (
                                                <div className="h-7 w-11 bg-slate-100 rounded shrink-0"/>
                                            )}
                                            <span className="text-sm text-slate-700 truncate min-w-0">
                                   {sc?.name ?? ids[i]}
                                  </span>
                                        </div>
                                    ))}
                                </Link>
                            </div>


                            <div className="col-span-2 flex justify-end items-center">
                                <span className="text-xs text-slate-400 whitespace-nowrap text-right">
         {formatRelativeTime(visitedAt)}
        </span>
                                <button
                                    type="button"
                                    onClick={() => removeCompare(pair)}
                                    className="shrink-0 w-5 h-5 flex items-center justify-center text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Xoá"
                                >
                                    <IconX size={12}/>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
