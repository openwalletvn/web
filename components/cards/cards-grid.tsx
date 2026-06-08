'use client';

import {useSearchParams, useRouter, usePathname} from 'next/navigation';
import {Suspense, useMemo, useState, useTransition} from 'react';
import Link from 'next/link';
import type {Bank, Card, CardSort, CardType} from '@/lib/api';
import {ROUTES} from '@/lib/routes';
import {FEE_BUCKETS} from '@/lib/fee-buckets';
import {CardsFilter} from './cards-filter';
import {CardMasonry} from './card-masonry';

interface Props {
 cards: Card[];
 banks: Bank[];
 title?: string;
 limit?: number;
 showViewAll?: boolean;
 noCardsLabel?: string;
 useUrlState?: boolean;
 hideTypeFilter?: boolean;
 hideNetworkFilter?: boolean;
 hideBankFilter?: boolean;
 hideCoBrandFilter?: boolean;
 hideContactlessFilter?: boolean;
 hideTierFilter?: boolean;
 hideFeeFilter?: boolean;
 hideSortFilter?: boolean;
}

function CardsGridInner({
 cards,
 banks,
 title,
 limit,
 showViewAll,
 noCardsLabel,
 useUrlState = false,
 hideTypeFilter,
 hideNetworkFilter,
 hideBankFilter,
 hideCoBrandFilter,
 hideContactlessFilter,
 hideTierFilter,
 hideFeeFilter,
 hideSortFilter,
 }: Props) {
 const searchParams = useSearchParams();
 const router = useRouter();
 const pathname = usePathname();
 const [isPending, startTransition] = useTransition();

 // Local state (used when useUrlState=false)
 const [localType, setLocalType] = useState<string | null>(null);
 const [localNetwork, setLocalNetwork] = useState<string | null>(null);
 const [localBankId, setLocalBankId] = useState<string | null>(null);
 const [localCoBrand, setLocalCoBrand] = useState<string | null>(null);
 const [localSort, setLocalSort] = useState<string | null>(null);
 const [localContactless, setLocalContactless] = useState<string | null>(null);
 const [localFee, setLocalFee] = useState<string | null>(null);
 const [localTier, setLocalTier] = useState<string | null>(null);

 // Active filter values - from URL params or local state
 const type = (useUrlState ? searchParams.get('type') : localType) as CardType | null;
 const network = useUrlState ? searchParams.get('network') : localNetwork;
 const bankId = useUrlState ? searchParams.get('bank') : localBankId;
 const coBrand = useUrlState ? searchParams.get('co_brand') : localCoBrand;
 const sort = (useUrlState ? searchParams.get('sort') : localSort) as CardSort | null;
 const contactless = useUrlState ? searchParams.get('contactless') : localContactless;
 const fee = useUrlState ? searchParams.get('fee') : localFee;
 const tier = useUrlState ? searchParams.get('tier') : localTier;

 function handleUpdate(key: string, value: string) {
 const isEmpty = value === 'all' || value === '' || value === 'default';

 if (useUrlState) {
 const params = new URLSearchParams(searchParams.toString());
 if (isEmpty) params.delete(key); else params.set(key, value);
 startTransition(() => router.replace(`${pathname}?${params.toString()}`));
 } else {
 const v = isEmpty ? null : value;
 switch (key) {
 case 'type': setLocalType(v); break;
 case 'network': setLocalNetwork(v); break;
 case 'bank': setLocalBankId(v); break;
 case 'co_brand': setLocalCoBrand(v); break;
 case 'sort': setLocalSort(v); break;
 case 'contactless': setLocalContactless(v); break;
 case 'fee': setLocalFee(v); break;
 case 'tier': setLocalTier(v); break;
 }
 }
 }

 function handleClearAll() {
 if (useUrlState) {
 const params = new URLSearchParams(searchParams.toString());
 ['type', 'network', 'bank', 'co_brand', 'sort', 'contactless', 'fee', 'tier'].forEach((k) => params.delete(k));
 startTransition(() => router.replace(`${pathname}?${params.toString()}`));
 } else {
 setLocalType(null);
 setLocalNetwork(null);
 setLocalBankId(null);
 setLocalCoBrand(null);
 setLocalSort(null);
 setLocalContactless(null);
 setLocalFee(null);
 setLocalTier(null);
 }
 }

 // ── Auto-hide flags ────────────────────────────────────────────────────────

 const availableTypes = useMemo(
 () => [...new Set(cards.flatMap((c) => c.card_type))] as CardType[],
 [cards]
 );
 const availableNetworks = useMemo(() => {
 const map = new Map<string, { id: string; name: string; logo_url: string }>();
 cards.forEach((c) => {
 if (c.card_network_data) {
 map.set(c.card_network, c.card_network_data);
 } else {
 map.set(c.card_network, {id: c.card_network, name: c.card_network, logo_url: ''});
 }
 });
 return [...map.values()];
 }, [cards]);
 const availableBankIds = useMemo(
 () => [...new Set(cards.map((c) => c.bank_id))],
 [cards]
 );
 const availableBrands = useMemo(() => {
 const map = new Map<string, { id: string; name: string; logo_url: string }>();
 cards.forEach((c) => {
 if (c.co_brand && c.co_brand_data) map.set(c.co_brand, c.co_brand_data);
 });
 return [...map.values()];
 }, [cards]);
 const availableContactless = useMemo(() => {
 const map = new Map<string, { id: string; name: string; logo_url: string }>();
 cards.forEach((c) => {
 c.contactless_methods_data?.forEach((w) => map.set(w.id, w));
 });
 return [...map.values()];
 }, [cards]);
 const availableTiers = useMemo(() => {
 const map = new Map<string, { id: string; rank: number; logo_url: string }>();
 cards.forEach((c) => {
 if (c.card_tier && c.card_tier_data?.rank != null && !map.has(c.card_tier)) {
 map.set(c.card_tier, {
 id: c.card_tier,
 rank: c.card_tier_data.rank,
 logo_url: c.card_network_data?.logo_url ?? '',
 });
 }
 });
 return [...map.values()].sort((a, b) => a.rank - b.rank);
 }, [cards]);
 const feeFilterUseful = cards.some((c) => c.fees?.annual != null && c.fees.annual.amount > 0);

 const sortFilterUseful = useMemo(
 () => cards.filter((c) => c.fees?.annual != null).length > 1,
 [cards]
 );

 // ── Filtering ──────────────────────────────────────────────────────────────

 const filteredCards = useMemo(() => {
 let result = cards;

 if (type) result = result.filter((c) => c.card_type.includes(type));
 if (network) result = result.filter((c) => c.card_network === network);
 if (tier) result = result.filter((c) => c.card_tier === tier);
 if (bankId) result = result.filter((c) => c.bank_id === bankId);
 if (coBrand) result = result.filter((c) => c.co_brand === coBrand);
 if (contactless) result = result.filter((c) => c.contactless_methods?.includes(contactless as never));
 if (fee === 'free') result = result.filter((c) => c.fees?.annual?.amount === 0);
 if (fee === 'unknown') result = result.filter((c) => c.fees?.annual == null);
 const bucket = FEE_BUCKETS.find((b) => b.value === fee);
 if (bucket) {
 result = result.filter((c) => {
 if (c.fees?.annual == null) return false;
 if (c.fees.annual.amount < bucket.min) return false;
 if (bucket.max !== null && c.fees.annual.amount > bucket.max) return false;
 return true;
 });
 }

 if (sort === 'fee_asc') {
 result = [...result].sort((a, b) => (a.fees?.annual?.amount ?? 0) - (b.fees?.annual?.amount ?? 0));
 } else if (sort === 'fee_desc') {
 result = [...result].sort((a, b) => (b.fees?.annual?.amount ?? 0) - (a.fees?.annual?.amount ?? 0));
 } else if (sort === 'tier_asc') {
 result = [...result].sort((a, b) => (a.card_tier_data?.rank ?? Infinity) - (b.card_tier_data?.rank ?? Infinity));
 }

 return result;
 }, [cards, type, network, bankId, coBrand, contactless, fee, tier, sort]);

 const displayed = limit ? filteredCards.slice(0, limit) : filteredCards;
 const heading = title;
 const emptyMessage = noCardsLabel ?? 'Không tìm thấy thẻ nào.';

 const filterValues = {
 type,
 network,
 bankId,
 coBrand,
 sort: sort ?? 'default',
 contactless,
 fee,
 tier,
 };

 const anyFilterShown = !(hideTypeFilter && hideNetworkFilter && hideBankFilter && hideCoBrandFilter && hideContactlessFilter && hideTierFilter && hideFeeFilter && hideSortFilter);

 return (
 <div className="ow-cards-grid">
 {heading && (
 <div className="mb-8">

 <div className="flex relative overflow-hidden">
 <h2 className="relative">
 <span>{heading}</span>

 <div className="border-t border-dashed border-slate-300 absolute top-1/2 left-full w-screen ml-6"/>
 </h2>
 </div>

 {showViewAll && <p className="text-slate-500 mt-3">Khám phá thẻ tín dụng, thẻ ghi nợ và thẻ trả trước từ các ngân hàng hàng đầu Việt Nam.</p>}
 </div>
 )}

 {/*filter*/}
 {anyFilterShown && cards.length > 5 && (
 <div className="mb-8 flex gap-4 items-center">
 <CardsFilter
 banks={banks}
 hideTypeFilter={hideTypeFilter}
 hideNetworkFilter={hideNetworkFilter}
 hideBankFilter={hideBankFilter}
 hideCoBrandFilter={hideCoBrandFilter}
 hideContactlessFilter={hideContactlessFilter}
 hideTierFilter={hideTierFilter}
 hideFeeFilter={hideFeeFilter}
 hideSortFilter={hideSortFilter}
 availableNetworks={availableNetworks}
 availableBrands={availableBrands}
 availableContactless={availableContactless}
 availableTiers={availableTiers}
 availableTypes={availableTypes.length}
 availableBanks={availableBankIds.length}
 hasFeeCards={feeFilterUseful}
 hasSortableCards={sortFilterUseful}
 filterValues={filterValues}
 onUpdate={handleUpdate}
 onClearAll={handleClearAll}
 isPending={isPending}
 />
 </div>
 )}

 {/*card count*/}
 {anyFilterShown && (
 <div className="mb-8">
 {limit && displayed.length < filteredCards.length
 ? `Hiển thị ${displayed.length} / ${filteredCards.length} thẻ`
 : `${filteredCards.length} thẻ`}
 </div>
 )}

 {/*grid*/}
 <div className="">
 {displayed.length === 0 ? (
 <p className="text-slate-500">{emptyMessage}</p>
 ) : (
 <CardMasonry cards={displayed}/>
 )}
 </div>

 {showViewAll && displayed.length > 0 && (
 <div className="pt-8">
 <Link
 href={ROUTES.cards}
 className="inline-block px-6 py-2.5 border border-dashed border-slate-300 rounded font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors"
 >
 {`Xem tất cả ${filteredCards.length} thẻ →`}
 </Link>
 </div>
 )}
 </div>
 );
}

export function CardsGrid(props: Props) {
 return (
 <Suspense>
 <CardsGridInner {...props} />
 </Suspense>
 );
}
