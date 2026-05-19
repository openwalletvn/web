'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import type { Card } from '@/lib/api';
import type { SearchCard } from '@/lib/search-types';
import { useRecentCompares, normalizePair } from '@/lib/use-recent-compares';
import { useCardSearch } from '@/lib/use-card-search';
import { CardImage } from '@/components/cards/card-image';

// CardImage needs a full Card object; build a minimal one from SearchCard
function toCardShell(sc: SearchCard): Card {
 return {
 id: sc.id,
 name: sc.name,
 image: sc.image_url
 ? { url: sc.image_url, orientation: 'horizontal', width: null, height: null }
 : null,
 bank_id: sc.bank_id,
 card_network: sc.card_network as Card['card_network'],
 card_type: sc.card_type as Card['card_type'],
 fees: null,
 statement_date: null,
 interest_free_days: null,
 contactless_methods: [],
 contactless_methods_data: [],
 card_tier: null,
 sources: [],
 } as unknown as Card;
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

interface Props {
 excludePair?: string;
}

export function RecentCompares({ excludePair }: Props = {}) {
 const t = useTranslations('ComparePage');
 const { recentCompares, removeCompare } = useRecentCompares();
 const excludeKey = excludePair ? normalizePair(excludePair) : null;
 const { lookup, load } = useCardSearch();
 const [mounted, setMounted] = useState(false);

 useEffect(() => { load(); }, [load]);
 useEffect(() => { setMounted(true); }, []);

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
 <h2 className="text-card-heading mb-4">
 {t('recent_title')}
 </h2>
 <div className="divide-y divide-slate-100">
 {visible.map(({ pair, visitedAt }) => {
 const ids = pair.includes(',') ? pair.split(',') : pair.split('-vs-');
 const searchCards = ids.map((id) => lookup(id));

 const href = pair.includes('-vs-')
 ? `/so-sanh/${pair}`
 : `/so-sanh?compare=${ids.join(',')}`;

 return (
 <div key={pair} className="group flex items-center gap-3 py-3">
 <Link
 href={href}
 className="flex-1 flex items-center gap-4 min-w-0 hover:opacity-80 transition-opacity"
 >
 <div className="flex items-center gap-3 min-w-0">
 {searchCards.map((sc, i) => (
 <div key={ids[i]} className="flex items-center gap-1.5 w-[200px]">
 {i > 0 && <span className="text-slate-300 text-xs">·</span>}
 {sc ? (
 <CardImage card={toCardShell(sc)} className="h-7 w-auto shrink-0" />
 ) : (
 <div className="h-7 w-11 bg-slate-100 rounded-sm shrink-0" />
 )}
 <span className="text-sm text-slate-700 truncate">
 {sc?.name ?? ids[i]}
 </span>
 </div>
 ))}
 </div>
 <span className="shrink-0 text-xs text-slate-400 ml-auto">
 {formatRelativeTime(visitedAt)}
 </span>
 </Link>
 <button
 type="button"
 onClick={() => removeCompare(pair)}
 className="shrink-0 w-5 h-5 flex items-center justify-center text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
 aria-label="Xoá"
 >
 <IconX size={12} />
 </button>
 </div>
 );
 })}
 </div>
 </div>
 );
}
