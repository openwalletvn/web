'use client';

import {useSearchParams, useRouter, usePathname} from 'next/navigation';
import {Suspense, useMemo, useState, useTransition} from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import type {Bank, Card, CardSort, CardType} from '@/lib/api';
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
                            hideFeeFilter,
                            hideSortFilter,
                        }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const t = useTranslations('CardsSection');

    // Local state (used when useUrlState=false)
    const [localType, setLocalType] = useState<string | null>(null);
    const [localNetwork, setLocalNetwork] = useState<string | null>(null);
    const [localBankId, setLocalBankId] = useState<string | null>(null);
    const [localCoBrand, setLocalCoBrand] = useState<string | null>(null);
    const [localSort, setLocalSort] = useState<string | null>(null);
    const [localContactless, setLocalContactless] = useState<string | null>(null);
    const [localFee, setLocalFee] = useState<string | null>(null);

    // Active filter values — from URL params or local state
    const type = (useUrlState ? searchParams.get('type') : localType) as CardType | null;
    const network = useUrlState ? searchParams.get('network') : localNetwork;
    const bankId = useUrlState ? searchParams.get('bank') : localBankId;
    const coBrand = useUrlState ? searchParams.get('co_brand') : localCoBrand;
    const sort = (useUrlState ? searchParams.get('sort') : localSort) as CardSort | null;
    const contactless = useUrlState ? searchParams.get('contactless') : localContactless;
    const fee = useUrlState ? searchParams.get('fee') : localFee;

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
            }
        }
    }

    function handleClearAll() {
        if (useUrlState) {
            const params = new URLSearchParams(searchParams.toString());
            ['type', 'network', 'bank', 'co_brand', 'sort', 'contactless', 'fee'].forEach((k) => params.delete(k));
            startTransition(() => router.replace(`${pathname}?${params.toString()}`));
        } else {
            setLocalType(null);
            setLocalNetwork(null);
            setLocalBankId(null);
            setLocalCoBrand(null);
            setLocalSort(null);
            setLocalContactless(null);
            setLocalFee(null);
        }
    }

    // ── Auto-hide flags ────────────────────────────────────────────────────────

    const availableTypes = useMemo(
        () => [...new Set(cards.flatMap((c) => c.card_type))] as CardType[],
        [cards]
    );
    const typeFilterUseful = availableTypes.length > 1;

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
    const networkFilterUseful = availableNetworks.length > 1;

    const availableBankIds = useMemo(
        () => [...new Set(cards.map((c) => c.bank_id))],
        [cards]
    );
    const bankFilterUseful = availableBankIds.length > 1;

    const availableBrands = useMemo(() => {
        const map = new Map<string, { id: string; name: string; logo_url: string }>();
        cards.forEach((c) => {
            if (c.co_brand && c.co_brand_data) map.set(c.co_brand, c.co_brand_data);
        });
        return [...map.values()];
    }, [cards]);
    const coBrandFilterUseful = availableBrands.length >= 1;

    const availableContactless = useMemo(() => {
        const map = new Map<string, { id: string; name: string; logo_url: string }>();
        cards.forEach((c) => {
            c.contactless_methods_data?.forEach((w) => map.set(w.id, w));
        });
        return [...map.values()];
    }, [cards]);
    const contactlessFilterUseful = availableContactless.length > 1;

    const feeFilterUseful = cards.some((c) => c.annual_fee != null && c.annual_fee > 0);

    const sortFilterUseful = useMemo(
        () => cards.filter((c) => c.annual_fee != null).length > 1,
        [cards]
    );

    // ── Filtering ──────────────────────────────────────────────────────────────

    const filteredCards = useMemo(() => {
        let result = cards;

        if (type) result = result.filter((c) => c.card_type.includes(type));
        if (network) result = result.filter((c) => c.card_network === network);
        if (bankId) result = result.filter((c) => c.bank_id === bankId);
        if (coBrand) result = result.filter((c) => c.co_brand === coBrand);
        if (contactless) result = result.filter((c) => c.contactless_methods?.includes(contactless));
        if (fee === 'free') result = result.filter((c) => c.annual_fee === 0);
        const bucket = FEE_BUCKETS.find((b) => b.value === fee);
        if (bucket) {
            result = result.filter((c) => {
                if (c.annual_fee == null) return false;
                if (c.annual_fee < bucket.min) return false;
                if (bucket.max !== null && c.annual_fee > bucket.max) return false;
                return true;
            });
        }

        if (sort === 'fee_asc') {
            result = [...result].sort((a, b) => (a.annual_fee ?? 0) - (b.annual_fee ?? 0));
        } else if (sort === 'fee_desc') {
            result = [...result].sort((a, b) => (b.annual_fee ?? 0) - (a.annual_fee ?? 0));
        }

        return result;
    }, [cards, type, network, bankId, coBrand, contactless, fee, sort]);

    const displayed = limit ? filteredCards.slice(0, limit) : filteredCards;
    const heading = title;
    const emptyMessage = noCardsLabel ?? t('no_cards');

    const filterValues = {
        type,
        network,
        bankId,
        coBrand,
        sort: sort ?? 'default',
        contactless,
        fee,
    };

    const anyFilterShown = !(hideTypeFilter && hideNetworkFilter && hideBankFilter && hideCoBrandFilter && hideContactlessFilter && hideFeeFilter && hideSortFilter);

    return (
        <div>
            {heading && (
                <div className="mb-8">

                    <div className="flex relative overflow-hidden">
                        <h2 className="text-3xl font-bold text-slate-900 relative">
                            <span>{heading}</span>

                            <div className="border-t border-dashed border-slate-300 absolute top-1/2 left-full w-screen ml-6"/>
                        </h2>
                    </div>

                    {showViewAll && <p className="text-slate-500 mt-3">{t('description')}</p>}
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
                        hideFeeFilter={hideFeeFilter}
                        hideSortFilter={hideSortFilter}
                        typeFilterUseful={typeFilterUseful}
                        networkFilterUseful={networkFilterUseful}
                        bankFilterUseful={bankFilterUseful}
                        contactlessFilterUseful={contactlessFilterUseful}
                        feeFilterUseful={feeFilterUseful}
                        sortFilterUseful={sortFilterUseful}
                        coBrandFilterUseful={coBrandFilterUseful}
                        availableNetworks={availableNetworks}
                        availableBrands={availableBrands}
                        availableContactless={availableContactless}
                        filterValues={filterValues}
                        onUpdate={handleUpdate}
                        onClearAll={handleClearAll}
                        isPending={isPending}
                    />

                    {/*card count*/}
                    {anyFilterShown && (
                        <div className="">
                            {limit && displayed.length < filteredCards.length
                                ? `Hiển thị ${displayed.length} / ${filteredCards.length} thẻ`
                                : `${filteredCards.length} thẻ`}
                        </div>
                    )}
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
                        href="/the"
                        className="inline-block px-6 py-2.5 border border-dashed border-slate-300 rounded-sm font-medium text-slate-700 hover:border-slate-500 hover:text-slate-900 transition-colors"
                    >
                        {t('view_all', {count: filteredCards.length})}
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
