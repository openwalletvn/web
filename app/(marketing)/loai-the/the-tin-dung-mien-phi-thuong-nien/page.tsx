import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {CardsGrid} from '@/components/cards/cards-grid';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';
import {ROUTES} from '@/lib/routes';

export const revalidate = 3600;

const SLUG = 'the-tin-dung-mien-phi-thuong-nien';
const TITLE = 'Thẻ Tín Dụng Miễn Phí Thường Niên';
const DESCRIPTION =
    'Danh sách thẻ tín dụng miễn phí thường niên tại Việt Nam. So sánh cashback, ưu đãi và điều kiện để chọn thẻ không mất phí duy trì phù hợp nhất.';

const BREADCRUMBS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Loại thẻ', href: ROUTES.cardTypes},
    {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
    const cards = await getCards({type: 'credit', annual_fee_free: true}).catch(() => []);
    const href = ROUTES.cardTypePage(SLUG);
    const {metadata} = buildCollectionPageMeta({
        title: buildTitle(TITLE, SECTION_TITLES.cardTypes),
        description: DESCRIPTION,
        url: href,
        items: cards.map((c) => ({name: c.name, url: ROUTES.card(c.id)})),
        breadcrumbItems: BREADCRUMBS,
    });
    return metadata;
}

export default async function FreeAnnualFeeCardsPage() {
    const [cards, banks] = await Promise.all([
        getCards({type: 'credit', annual_fee_free: true}).catch(() => []),
        getBanks().catch(() => []),
    ]);

    const href = ROUTES.cardTypePage(SLUG);
    const {jsonLd} = buildCollectionPageMeta({
        title: buildTitle(TITLE, SECTION_TITLES.cardTypes),
        description: DESCRIPTION,
        url: href,
        items: cards.map((c) => ({name: c.name, url: ROUTES.card(c.id)})),
        breadcrumbItems: BREADCRUMBS,
    });

    return (
        <MarketingPageShell
            title={TITLE}
            description={DESCRIPTION}
            breadcrumbItems={BREADCRUMBS}
            jsonLd={jsonLd}
        >
            <section className="ow-card-type-page flex flex-col gap-8">
                <CardsGrid cards={cards} banks={banks} hideTypeFilter/>
            </section>
        </MarketingPageShell>
    );
}
