import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const TITLE = 'Thẻ tín dụng cao cấp';
const DESCRIPTION = 'Tổng hợp các thẻ tín dụng cao cấp nhất Việt Nam: Visa Infinite, Visa Signature, Mastercard World Elite và nhiều hơn nữa. So sánh ưu đãi, phí thường niên và đặc quyền.';
const URL = '/the-tin-dung-cao-cap';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: '/the'},
    {label: 'Thẻ Tín Dụng', href: '/the-tin-dung'},
    {label: TITLE},
];
const NETWORK_TIER_FILTER = 'visa:infinite,visa:signature,mastercard:world-elite,mastercard:world,amex:platinum,jcb:ultimate';
const NETWORK_ORDER = ['visa', 'mastercard', 'amex', 'jcb', 'unionpay'];

export async function generateMetadata(): Promise<Metadata> {
    const cards = await getCards({type: 'credit', network_tier: NETWORK_TIER_FILTER});
    const {metadata} = buildCollectionPageMeta({
        title: `${TITLE} | OpenWallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function PremiumCreditPage() {
    const [cards, banks, t] = await Promise.all([
        getCards({type: 'credit', network_tier: NETWORK_TIER_FILTER}),
        getBanks(),
        getTranslations('SeoPages'),
    ]);

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: `${TITLE} | OpenWallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    // Sort all cards by annual fee asc, then group by network
    const sorted = [...cards].sort((a, b) => (a.annual_fee ?? 0) - (b.annual_fee ?? 0));

    const networkMap = new Map<string, { name: string; cards: typeof sorted }>();
    for (const card of sorted) {
        const key = card.card_network;
        if (!networkMap.has(key)) {
            networkMap.set(key, {
                name: card.card_network_data?.name ?? key,
                cards: [],
            });
        }
        networkMap.get(key)!.cards.push(card);
    }

    const networkSections = [...networkMap.entries()].sort(([a], [b]) => {
        const ai = NETWORK_ORDER.indexOf(a);
        const bi = NETWORK_ORDER.indexOf(b);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    return (
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <Breadcrumbs items={breadcrumbItems}/>

                <h1 className="text-4xl font-bold text-slate-900 mb-2">{t('premium_credit')}</h1>
                <p className="text-slate-500 mb-8">{t('premium_credit_subtitle')}</p>

                <div className="space-y-16">
                    {networkSections.map(([key, {name, cards: networkCards}]) => (
                        <CardsGrid
                            key={key}
                            cards={networkCards}
                            banks={banks}
                            title={name}
                            hideTypeFilter
                            hideNetworkFilter
                            hideBankFilter
                            hideCoBrandFilter
                            hideContactlessFilter
                            hideTierFilter
                            hideFeeFilter
                            hideSortFilter
                            noCardsLabel={t('no_cards')}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
