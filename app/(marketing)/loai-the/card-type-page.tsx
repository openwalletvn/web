import type {Metadata} from 'next';
import type {CardType} from '@/lib/api';
import {getBanks, getCards} from '@/lib/api';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {CardsGrid} from '@/components/cards/cards-grid';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';
import {ROUTES} from '@/lib/routes';

export interface CardTypePageConfig {
    type: CardType;
    slug: string;
    label: string;
    title: string;
    description: string;
}

export async function generateCardTypeMetadata(config: CardTypePageConfig): Promise<Metadata> {
    const cards = await getCards({type: config.type}).catch(() => []);
    const href = ROUTES.cardTypePage(config.slug);
    const {metadata} = buildCollectionPageMeta({
        title: buildTitle(config.title, SECTION_TITLES.cardTypes),
        description: config.description,
        url: href,
        items: cards.map((c) => ({name: c.name, url: ROUTES.card(c.id)})),
        breadcrumbItems: [
            {label: 'Trang chủ', href: '/'},
            {label: 'Loại thẻ', href: ROUTES.cardTypes},
            {label: config.title},
        ],
    });
    return metadata;
}

export async function CardTypePage({config}: { config: CardTypePageConfig }) {
    const [cards, banks] = await Promise.all([
        getCards({type: config.type}).catch(() => []),
        getBanks().catch(() => []),
    ]);

    const href = ROUTES.cardTypePage(config.slug);
    const breadcrumbItems = [
        {label: 'Trang chủ', href: '/'},
        {label: 'Loại thẻ', href: ROUTES.cardTypes},
        {label: config.title},
    ];

    const {jsonLd} = buildCollectionPageMeta({
        title: buildTitle(config.title, SECTION_TITLES.cardTypes),
        description: config.description,
        url: href,
        items: cards.map((c) => ({name: c.name, url: ROUTES.card(c.id)})),
        breadcrumbItems,
    });

    return (
        <MarketingPageShell
            title={config.title}
            description={config.description}
            breadcrumbItems={breadcrumbItems}
            jsonLd={jsonLd}
        >
            <section className="ow-card-type-page flex flex-col gap-8">
                <CardsGrid cards={cards} banks={banks} hideTypeFilter/>
            </section>
        </MarketingPageShell>
    );
}
