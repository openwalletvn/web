import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ, type FAQ} from '@/components/marketing/category-seo-section';

const TITLE = 'Thẻ Chi Tiêu Y Tế';
const DESCRIPTION = 'So sánh thẻ tín dụng và ghi nợ có cashback khi thanh toán tại bệnh viện, phòng khám, nhà thuốc tại Việt Nam. Giảm gánh nặng chi phí y tế.';
const URL = '/the-danh-cho-y-te';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: '/the'},
    {label: TITLE},
];
const INTRO = 'Chi phí y tế ngày càng tăng — từ khám bệnh, mua thuốc đến điều trị tại bệnh viện tư. Một số thẻ ngân hàng tích hợp ưu đãi hoàn tiền cho giao dịch tại bệnh viện, phòng khám và nhà thuốc (MCC 8099, 5912), giúp giảm nhẹ gánh nặng tài chính. Bệnh viện công thường chưa hỗ trợ thanh toán thẻ — ưu đãi phổ biến hơn ở bệnh viện tư và chuỗi nhà thuốc.';
const FAQS: FAQ[] = [
    {q: 'Bệnh viện nào tại Việt Nam chấp nhận thanh toán thẻ?', a: 'Bệnh viện tư (Vinmec, FV, Thu Cúc...) và quốc tế thường hỗ trợ đầy đủ. Bệnh viện công vẫn chủ yếu dùng tiền mặt hoặc chuyển khoản.'},
    {q: 'Thẻ nào cashback khi mua thuốc ở nhà thuốc?', a: 'Xem bảng xếp hạng phía trên — lọc theo MCC nhà thuốc 5912.'},
    {q: 'Cashback y tế có áp dụng cho phí bảo hiểm sức khỏe không?', a: 'Thường không — phí bảo hiểm có MCC riêng (6311, 6399), khác với MCC dịch vụ y tế.'},
    {q: 'Có thẻ nào ưu tiên đặc biệt cho bệnh viện quốc tế không?', a: 'Một số thẻ premium (Visa Platinum, World) có cashback cao hơn tại chuỗi y tế tư nhân. Xem chi tiết trong bảng xếp hạng.'},
];

export async function generateMetadata(): Promise<Metadata> {
    const allCards = await getCards();
    const cards = allCards.filter((c) => c.intents?.includes('health'));
    const {metadata} = buildCollectionPageMeta({
        title: `${TITLE} | Open Wallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function YTeCardsPage() {
    const [allCards, initialRanked] = await Promise.all([
        getCards(),
        getRankedCards({spend: {health: 3_000_000}, limit: 50}).catch(() => []),
    ]);
    const cards = allCards.filter((c) => c.intents?.includes('health'));

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: `${TITLE} | Open Wallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    return (
        <MarketingPageShell title={TITLE} description={DESCRIPTION} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <CategoryIntro intro={INTRO}/>
            <CardRankingTable initialRanked={initialRanked} intentSlug="health" title="Xếp hạng thẻ theo cashback y tế"/>
            <CategoryFAQ faqs={FAQS}/>
            <BrowseCategories excludeHref={URL}/>
        </MarketingPageShell>
    );
}
