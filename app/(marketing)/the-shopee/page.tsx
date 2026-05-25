import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ, type FAQ} from '@/components/marketing/category-seo-section';

const TITLE = 'Thẻ Shopee';
const DESCRIPTION = 'So sánh thẻ tín dụng và ghi nợ liên kết Shopee từ các ngân hàng Việt Nam. Tìm thẻ hoàn tiền Shopee cao nhất, phí thường niên thấp nhất.';
const URL = '/the-shopee';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: '/the'},
    {label: TITLE},
];
const INTRO = 'Mua sắm trên Shopee thường xuyên? Chọn đúng thẻ ngân hàng có thể giúp bạn tiết kiệm 5–10% mỗi đơn hàng nhờ cashback hoặc tích điểm đổi voucher. Không phải thẻ nào liên kết Shopee cũng như nhau — một số hoàn tiền cố định 5%, số khác chỉ áp dụng khi đạt ngưỡng chi tiêu tối thiểu.';
const FAQS: FAQ[] = [
    {q: 'Thẻ nào cashback Shopee cao nhất hiện nay?', a: 'Xem bảng xếp hạng phía trên — được cập nhật theo dữ liệu thực tế từ các ngân hàng.'},
    {q: 'Thẻ ghi nợ có cashback Shopee không?', a: 'Có, nhưng tỷ lệ hoàn tiền thường thấp hơn thẻ tín dụng. Thẻ tín dụng đồng thương hiệu Shopee thường có mức hoàn tốt nhất.'},
    {q: 'Dùng thẻ liên kết Shopee Pay có ưu đãi khác không?', a: 'Shopee Pay là ví điện tử, khác với thẻ ngân hàng. Một số thẻ tặng thêm điểm khi nạp vào Shopee Pay, nhưng cashback chính vẫn tính theo giao dịch mua hàng.'},
    {q: 'Phí thường niên thẻ Shopee có được miễn không?', a: 'Tùy ngân hàng. Nhiều thẻ miễn phí năm đầu hoặc miễn khi đạt mức chi tiêu nhất định trong năm.'},
];

export async function generateMetadata(): Promise<Metadata> {
    const allCards = await getCards();
    const cards = allCards.filter((c) => c.co_brand === 'shopee' || c.intents?.includes('shopee'));
    const {metadata} = buildCollectionPageMeta({
        title: `${TITLE} | Open Wallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function ShopeeCardsPage() {
    const [allCards, initialRanked] = await Promise.all([
        getCards(),
        getRankedCards({intents: ['shopee'], limit: 50}).catch(() => []),
    ]);
    const cards = allCards.filter((c) => c.co_brand === 'shopee' || c.intents?.includes('shopee'));

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
            <CardRankingTable initialRanked={initialRanked} intentSlug="shopee" title="Xếp hạng thẻ theo cashback Shopee"/>
            <CategoryFAQ faqs={FAQS}/>
            <BrowseCategories excludeHref={URL}/>
        </MarketingPageShell>
    );
}
