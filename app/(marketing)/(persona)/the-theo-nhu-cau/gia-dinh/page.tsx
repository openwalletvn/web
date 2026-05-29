import type {Metadata} from 'next';
import {getCards, getRankedCards} from '@/lib/api';
import {buildIntentCategoryMeta, generateIntentCategoryMetadata, type IntentCategoryConfig} from '@/lib/page-meta/intent-category';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {PersonaPoolCards} from '@/components/marketing/persona-pool-cards';
import {CategoryIntro, CategoryFAQ} from '@/components/marketing/category-seo-section';

const CONFIG: IntentCategoryConfig = {
    title: 'Thẻ Gia Đình',
    description: 'So sánh thẻ ngân hàng phù hợp cho chi tiêu gia đình tại Việt Nam: siêu thị, giáo dục, y tế, bảo hiểm. Tìm thẻ hoàn tiền cao nhất cho các khoản chi thiết yếu.',
    url: '/the-theo-nhu-cau/gia-dinh',
    personaSlug: 'family',
    rankingTitle: 'Xếp hạng thẻ theo ưu đãi gia đình',
    intro: 'Chi tiêu gia đình bao gồm nhiều danh mục khác nhau: siêu thị, học phí, viện phí, bảo hiểm. Thẻ gia đình phù hợp là thẻ có cashback đa danh mục, giúp tối ưu hoàn tiền trên phần lớn các khoản chi hàng tháng thay vì chỉ tập trung vào một danh mục duy nhất.',
    faqs: [
        {q: 'Thẻ nào phù hợp nhất cho gia đình có con nhỏ?', a: 'Xem bảng xếp hạng phía trên. Ưu tiên thẻ có cashback cho cả siêu thị, học phí và y tế cùng lúc.'},
        {q: 'Một thẻ có thể hoàn tiền cả siêu thị, học phí và y tế không?', a: 'Có, một số thẻ có quy tắc cashback đa danh mục. Mức hoàn mỗi danh mục thường thấp hơn thẻ chuyên biệt nhưng linh hoạt hơn.'},
        {q: 'Phí thường niên thẻ gia đình có xứng đáng không?', a: 'Tùy mức chi tiêu hàng tháng. Thẻ phí cao thường có cashback tốt hơn. So sánh cashback ước tính với phí thường niên để quyết định.'},
        {q: 'Nên dùng một thẻ hay nhiều thẻ cho chi tiêu gia đình?', a: 'Nhiều thẻ chuyên biệt tối ưu hơn về cashback, nhưng một thẻ đa năng dễ quản lý hơn. Tùy theo thói quen chi tiêu của gia đình.'},
    ],
    breadcrumbItems: [
        {label: 'Trang chủ', href: '/'},
        {label: 'Thẻ theo nhu cầu', href: '/the-theo-nhu-cau'},
        {label: 'Thẻ Gia Đình'},
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    return generateIntentCategoryMetadata(CONFIG, () => getCards({persona: CONFIG.personaSlug}));
}

export default async function FamilyCardsPage() {
    const [poolCards, initialRanked] = await Promise.all([
        getCards({persona: CONFIG.personaSlug}),
        getRankedCards({persona: CONFIG.personaSlug, intents: [], limit: 10}).catch(() => []),
    ]);
    const {jsonLd, breadcrumbItems} = buildIntentCategoryMeta(CONFIG, poolCards);
    const rankedIds = new Set(initialRanked.map((r) => r.card.id));

    return (
        <MarketingPageShell title={CONFIG.title} description={CONFIG.description} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <CategoryIntro intro={CONFIG.intro}/>
            <CardRankingTable initialRanked={initialRanked} personaSlug={CONFIG.personaSlug} title={CONFIG.rankingTitle}/>
            <CategoryFAQ faqs={CONFIG.faqs}/>
            <BrowseCategories excludeHref={CONFIG.url}/>
            <PersonaPoolCards poolCards={poolCards} excludeIds={rankedIds} excludeRanked={true}/>
        </MarketingPageShell>
    );
}
