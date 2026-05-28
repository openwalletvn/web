import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {buildIntentCategoryMeta, generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ} from '@/components/marketing/category-seo-section';

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Chi Tiêu Giáo Dục',
    description: 'So sánh thẻ tín dụng và ghi nợ có ưu đãi thanh toán học phí, trường học, trung tâm ngoại ngữ tại Việt Nam. Tìm thẻ hoàn tiền giáo dục phù hợp nhất.',
    url: '/the-danh-cho-giao-duc',
    intentSlug: 'education',
    rankingTitle: 'Xếp hạng thẻ theo cashback giáo dục',
    intro: 'Học phí là khoản chi lớn và thường xuyên — dù là học phí đại học, trường quốc tế hay trung tâm ngoại ngữ. Một số thẻ ngân hàng hoàn tiền từ 1–5% cho giao dịch tại cơ sở giáo dục, giúp tiết kiệm đáng kể mỗi học kỳ. Lưu ý: nhiều trường vẫn yêu cầu chuyển khoản — hãy xác nhận với cơ sở giáo dục trước khi chọn thẻ.',
    faqs: [
        {q: 'Trường đại học tại Việt Nam có chấp nhận thẻ tín dụng không?', a: 'Đại học công lập thường yêu cầu chuyển khoản. Trường tư thục và quốc tế phổ biến hơn với thanh toán thẻ.'},
        {q: 'Thẻ nào hoàn tiền khi đóng học phí?', a: 'Xem bảng xếp hạng phía trên — các thẻ được lọc theo MCC giáo dục thực tế.'},
        {q: 'Thẻ giáo dục có dùng cho trung tâm ngoại ngữ, kỹ năng không?', a: 'Có, nếu trung tâm phân loại đúng MCC giáo dục (8299). Một số nơi dùng MCC bán lẻ chung nên có thể không được tính.'},
        {q: 'Hạn mức tối thiểu để nhận cashback giáo dục là bao nhiêu?', a: 'Tùy từng thẻ, thường từ 500K–2 triệu mỗi giao dịch. Kiểm tra điều khoản cụ thể của từng ngân hàng.'},
    ],
    filterFn: (c) => c.intents?.includes('education') === true,
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, getCards);
}

export default async function GiaoDucCardsPage() {
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
