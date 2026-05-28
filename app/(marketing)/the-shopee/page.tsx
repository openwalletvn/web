import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {buildIntentCategoryMeta, generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ} from '@/components/marketing/category-seo-section';

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Shopee',
    description: 'So sánh thẻ tín dụng và ghi nợ liên kết Shopee từ các ngân hàng Việt Nam. Tìm thẻ hoàn tiền Shopee cao nhất, phí thường niên thấp nhất.',
    url: '/the-shopee',
    intentSlug: 'shopee',
    rankingTitle: 'Xếp hạng thẻ theo cashback Shopee',
    intro: 'Mua sắm trên Shopee thường xuyên? Chọn đúng thẻ ngân hàng có thể giúp bạn tiết kiệm 5–10% mỗi đơn hàng nhờ cashback hoặc tích điểm đổi voucher. Không phải thẻ nào liên kết Shopee cũng như nhau — một số hoàn tiền cố định 5%, số khác chỉ áp dụng khi đạt ngưỡng chi tiêu tối thiểu.',
    faqs: [
        {q: 'Thẻ nào cashback Shopee cao nhất hiện nay?', a: 'Xem bảng xếp hạng phía trên — được cập nhật theo dữ liệu thực tế từ các ngân hàng.'},
        {q: 'Thẻ ghi nợ có cashback Shopee không?', a: 'Có, nhưng tỷ lệ hoàn tiền thường thấp hơn thẻ tín dụng. Thẻ tín dụng đồng thương hiệu Shopee thường có mức hoàn tốt nhất.'},
        {q: 'Dùng thẻ liên kết Shopee Pay có ưu đãi khác không?', a: 'Shopee Pay là ví điện tử, khác với thẻ ngân hàng. Một số thẻ tặng thêm điểm khi nạp vào Shopee Pay, nhưng cashback chính vẫn tính theo giao dịch mua hàng.'},
        {q: 'Phí thường niên thẻ Shopee có được miễn không?', a: 'Tùy ngân hàng. Nhiều thẻ miễn phí năm đầu hoặc miễn khi đạt mức chi tiêu nhất định trong năm.'},
    ],
    filterFn: (c) => c.co_brand === 'shopee' || c.intents?.includes('shopee') === true,
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, getCards);
}

export default async function ShopeeCardsPage() {
    const [allCards, initialRanked] = await Promise.all([
        getCards(),
        getRankedCards({intents: [CONFIG.intentSlug], limit: 50}).catch(() => []),
    ]);
    const {jsonLd, breadcrumbItems} = buildIntentCategoryMeta(CONFIG, allCards);

    return (
        <MarketingPageShell title={CONFIG.title} description={CONFIG.description} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <CategoryIntro intro={CONFIG.intro}/>
            <CardRankingTable initialRanked={initialRanked} intentSlug={CONFIG.intentSlug} title={CONFIG.rankingTitle}/>
            <CategoryFAQ faqs={CONFIG.faqs}/>
            <BrowseCategories excludeHref={CONFIG.url}/>
        </MarketingPageShell>
    );
}
