import type {Metadata} from 'next';
import {getBanks, getCards} from '@/lib/api';
import {CardRankingTable} from '@/components/marketing/card-ranking-table';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {BrowseCategories} from '@/components/marketing/browse-categories';
import {CategoryIntro, CategoryFAQ, type FAQ} from '@/components/marketing/category-seo-section';

const TITLE = 'Thẻ Siêu Thị';
const DESCRIPTION = 'So sánh thẻ tín dụng và ghi nợ có cashback khi mua sắm tại Coopmart, Go!, Lotte Mart, AEON. Tìm thẻ hoàn tiền siêu thị tốt nhất tại Việt Nam.';
const URL = '/the-sieu-thi';
const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ', href: '/the'},
    {label: TITLE},
];
const INTRO = 'Mua sắm tại siêu thị là khoản chi cố định hàng tháng của hầu hết gia đình Việt. Nhiều ngân hàng hợp tác với Coopmart, Go!, Lotte Mart và AEON để cung cấp cashback từ 3–10% cho chủ thẻ, một số còn tặng voucher hoặc tích điểm riêng. Mức hoàn tiền và điều kiện áp dụng khác nhau đáng kể giữa các thẻ.';
const FAQS: FAQ[] = [
    {q: 'Thẻ nào cashback siêu thị cao nhất?', a: 'Xem bảng xếp hạng phía trên, được tính dựa trên mức chi tiêu thực tế phổ biến.'},
    {q: 'Coopmart, Go!, Lotte Mart chấp nhận thẻ nào?', a: 'Hầu hết siêu thị lớn chấp nhận Visa và Mastercard. Thẻ đồng thương hiệu riêng của từng siêu thị thường có ưu đãi cao hơn.'},
    {q: 'Thẻ siêu thị có dùng được ở cửa hàng tiện lợi không?', a: 'Phụ thuộc vào điều khoản từng thẻ. Một số thẻ áp ưu đãi cho toàn bộ nhóm MCC bán lẻ, số khác chỉ áp cho siêu thị lớn.'},
    {q: 'Có cần đăng ký thêm để nhận cashback siêu thị không?', a: 'Thường không — cashback được tính tự động theo MCC giao dịch. Kiểm tra điều khoản thẻ để chắc chắn.'},
];

export async function generateMetadata(): Promise<Metadata> {
    const allCards = await getCards();
    const cards = allCards.filter((c) => c.intents?.includes('groceries'));
    const {metadata} = buildCollectionPageMeta({
        title: `${TITLE} | Open Wallet`,
        description: DESCRIPTION,
        url: URL,
        items: cards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function SieuThiCardsPage() {
    const [allCards, banks] = await Promise.all([getCards(), getBanks()]);
    const cards = allCards.filter((c) => c.intents?.includes('groceries'));

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
            <CardRankingTable cards={cards} banks={banks} intentSlug="groceries" title="Xếp hạng thẻ theo cashback siêu thị"/>
            <CategoryFAQ faqs={FAQS}/>
            <BrowseCategories excludeHref={URL}/>
        </MarketingPageShell>
    );
}
