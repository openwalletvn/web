'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { IconX } from '@tabler/icons-react';
import type { RecentEntry } from '@/lib/use-recent-compares';
import { useCardSearch } from '@/lib/use-card-search';

interface Props {
    pairs: RecentEntry[];
    onRemove: (pair: string) => void;
}

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

export function RecentCompares({ pairs, onRemove }: Props) {
    const t = useTranslations('ComparePage');
    const { lookup, load } = useCardSearch();

    useEffect(() => { load(); }, [load]);

    if (pairs.length === 0) return null;

    return (
        <div className="mt-10">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                {t('recent_title')}
            </h2>
            <div className="flex flex-wrap gap-2">
                {pairs.map(({ pair, visitedAt }) => {
                    const ids = pair.split('-vs-');
                    const cards = ids.map((id) => lookup(id));

                    return (
                        <div key={pair} className="relative group">
                            <Link
                                href={`/so-sanh/${pair}`}
                                className="flex items-center gap-2 p-2.5 border border-dashed border-slate-200 rounded-sm hover:border-slate-300 hover:bg-slate-50 transition-colors"
                            >
                                {cards.map((card, i) => (
                                    <div key={ids[i]} className="flex items-center gap-2">
                                        {i > 0 && (
                                            <span className="text-xs text-slate-300 font-medium">vs</span>
                                        )}
                                        <div className="flex flex-col items-center gap-1">
                                            {card?.image_url ? (
                                                <img
                                                    src={card.image_url}
                                                    alt={card.name}
                                                    className="h-8 w-12 object-contain"
                                                />
                                            ) : (
                                                <div className="h-8 w-12 bg-slate-100 rounded-sm" />
                                            )}
                                            <span className="text-xs text-slate-600 w-16 truncate text-center leading-tight">
                                                {card?.name ?? ids[i]}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <span className="ml-1 text-xs text-slate-400 self-end pb-0.5">
                                    {formatRelativeTime(visitedAt)}
                                </span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => onRemove(pair)}
                                className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Xoá"
                            >
                                <IconX size={8} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
