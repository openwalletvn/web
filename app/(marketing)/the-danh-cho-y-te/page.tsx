import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {buildIntentCategoryMeta, generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ} from '@/components/marketing/category-seo-section';

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Chi Tiêu Y Tế',
    description: 'So sánh thẻ tín dụng và ghi nợ có cashback khi thanh toán tại bệnh viện, phòng khám, nhà thuốc tại Việt Nam. Giảm gánh nặng chi phí y tế.',
    url: '/the-danh-cho-y-te',
    intentSlug: 'health',
    rankingTitle: 'Xếp hạng thẻ theo cashback y tế',
    intro: 'Chi phí y tế ngày càng tăng — từ khám bệnh, mua thuốc đến điều trị tại bệnh viện tư. Một số thẻ ngân hàng tích hợp ưu đãi hoàn tiền cho giao dịch tại bệnh viện, phòng khám và nhà thuốc (MCC 8099, 5912), giúp giảm nhẹ gánh nặng tài chính. Bệnh viện công thường chưa hỗ trợ thanh toán thẻ — ưu đãi phổ biến hơn ở bệnh viện tư và chuỗi nhà thuốc.',
    faqs: [
        {q: 'Bệnh viện nào tại Việt Nam chấp nhận thanh toán thẻ?', a: 'Bệnh viện tư (Vinmec, FV, Thu Cúc...) và quốc tế thường hỗ trợ đầy đủ. Bệnh viện công vẫn chủ yếu dùng tiền mặt hoặc chuyển khoản.'},
        {q: 'Thẻ nào cashback khi mua thuốc ở nhà thuốc?', a: 'Xem bảng xếp hạng phía trên — lọc theo MCC nhà thuốc 5912.'},
        {q: 'Cashback y tế có áp dụng cho phí bảo hiểm sức khỏe không?', a: 'Thường không — phí bảo hiểm có MCC riêng (6311, 6399), khác với MCC dịch vụ y tế.'},
        {q: 'Có thẻ nào ưu tiên đặc biệt cho bệnh viện quốc tế không?', a: 'Một số thẻ premium (Visa Platinum, World) có cashback cao hơn tại chuỗi y tế tư nhân. Xem chi tiết trong bảng xếp hạng.'},
    ],
    filterFn: (c) => c.intents?.includes('health') === true,
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, getCards);
}

export default async function YTeCardsPage() {
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
