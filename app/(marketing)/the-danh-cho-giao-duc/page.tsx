import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ, type FAQ} from '@/components/marketing/category-seo-section';

const TITLE = 'Thẻ Chi Tiêu Giáo Dục';
const DESCRIPTION = 'So sánh thẻ tín dụng và ghi nợ có ưu đãi thanh toán học phí, trường học, trung tâm ngoại ngữ tại Việt Nam. Tìm thẻ hoàn tiền giáo dục phù hợp nhất.';
const URL = '/the-danh-cho-giao-duc';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: '/the'},
    {label: TITLE},
];
const INTRO = 'Học phí là khoản chi lớn và thường xuyên — dù là học phí đại học, trường quốc tế hay trung tâm ngoại ngữ. Một số thẻ ngân hàng hoàn tiền từ 1–5% cho giao dịch tại cơ sở giáo dục, giúp tiết kiệm đáng kể mỗi học kỳ. Lưu ý: nhiều trường vẫn yêu cầu chuyển khoản — hãy xác nhận với cơ sở giáo dục trước khi chọn thẻ.';
const FAQS: FAQ[] = [
    {q: 'Trường đại học tại Việt Nam có chấp nhận thẻ tín dụng không?', a: 'Đại học công lập thường yêu cầu chuyển khoản. Trường tư thục và quốc tế phổ biến hơn với thanh toán thẻ.'},
    {q: 'Thẻ nào hoàn tiền khi đóng học phí?', a: 'Xem bảng xếp hạng phía trên — các thẻ được lọc theo MCC giáo dục thực tế.'},
    {q: 'Thẻ giáo dục có dùng cho trung tâm ngoại ngữ, kỹ năng không?', a: 'Có, nếu trung tâm phân loại đúng MCC giáo dục (8299). Một số nơi dùng MCC bán lẻ chung nên có thể không được tính.'},
    {q: 'Hạn mức tối thiểu để nhận cashback giáo dục là bao nhiêu?', a: 'Tùy từng thẻ, thường từ 500K–2 triệu mỗi giao dịch. Kiểm tra điều khoản cụ thể của từng ngân hàng.'},
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
        <MarketingPageShell title={TITLE} description={DESCRIPTION} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <CategoryIntro intro={INTRO}/>
            <CardRankingTable cards={cards} banks={banks} intentSlug="education" title="Xếp hạng thẻ theo cashback giáo dục"/>
            <CategoryFAQ faqs={FAQS}/>
            <BrowseCategories excludeHref={URL}/>
        </MarketingPageShell>
    );
}
