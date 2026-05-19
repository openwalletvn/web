import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const TITLE = 'Thẻ Doanh Nghiệp Miễn Phí';
const DESCRIPTION = 'Tổng hợp thẻ doanh nghiệp miễn phí thường niên từ các ngân hàng Việt Nam';
const URL = '/the-doanh-nghiep-mien-phi';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: 'Thẻ Doanh Nghiệp', href: '/the-doanh-nghiep'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const cards = await getCards({for_business: true});
 const {metadata} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });
 return metadata;
}

export default async function DoanhNghiepMienPhiCardsPage() {
 const [cards, banks] = await Promise.all([getCards({for_business: true}), getBanks()]);

 const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });

 return (
 <div className="px-4 py-12">
 <div className="max-w-container mx-auto">
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
 <Breadcrumbs items={breadcrumbItems}/>
 <h1 className="mb-2">{TITLE}</h1>
 <p className="text-slate-500 mb-8">{DESCRIPTION}</p>
 <CardsGrid cards={cards} banks={banks} noCardsLabel="Chưa có thẻ nào"/>
 </div>
 </div>
 );
}
