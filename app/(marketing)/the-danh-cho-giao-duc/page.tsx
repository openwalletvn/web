import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const TITLE = 'Thẻ Chi Tiêu Giáo Dục';
const DESCRIPTION = 'Tổng hợp thẻ tín dụng và ghi nợ có ưu đãi thanh toán học phí, trường học, giáo dục';
const URL = '/the-danh-cho-giao-duc';
const BREADCRUMB_ITEMS = [
 {label: 'Trang chủ', href: '/'},
 {label: 'Thẻ', href: '/the'},
 {label: TITLE},
];

export async function generateMetadata(): Promise<Metadata> {
 const allCards = await getCards();
 const cards = allCards.filter((c) => c.intents?.includes('education'));
 const {metadata} = buildCollectionPageMeta({
 title: `${TITLE} | Open Wallet`,
 description: DESCRIPTION,
 url: URL,
 items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
 breadcrumbItems: BREADCRUMB_ITEMS,
 });
 return metadata;
}

export default async function GiaoDucCardsPage() {
 const [allCards, banks] = await Promise.all([getCards(), getBanks()]);
 const cards = allCards.filter((c) => c.intents?.includes('education'));

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
 <CardRankingTable cards={cards} banks={banks} intentSlug="education" title="Xếp hạng thẻ theo cashback giáo dục"/>
 </div>
 </div>
 );
}
