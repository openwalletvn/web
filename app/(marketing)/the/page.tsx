import type {Metadata} from 'next';
import Link from 'next/link';
import {getBanks, getCards, getPersonas} from '@/lib/api';
import {CardsGrid} from '@/components/cards/cards-grid';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {OpenOwieButton} from '@/components/chat/open-owie-button';
import {OwBadge, OwBadges} from '@/components/ow-ui/ow-badge';
import {PersonaModel} from '@/lib/persona-model';
import {ROUTES} from '@/lib/routes';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';

export const revalidate = 3600;

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ'},
];

export async function generateMetadata(): Promise<Metadata> {
    const [cards, banks] = await Promise.all([getCards(), getBanks()]);
    const description = `Tra cứu ${cards.length}+ thẻ tín dụng và thẻ ghi nợ từ ${banks.length}+ ngân hàng tại Việt Nam. Lọc theo hoàn tiền, miễn phí thường niên, cashback, du lịch. Thông tin được kiểm duyệt, độc lập, không quảng cáo.`;
    const {metadata} = buildCollectionPageMeta({
        title: buildTitle('Thẻ Tín Dụng & Thẻ Ghi Nợ Ngân Hàng Việt Nam', SECTION_TITLES.cards),
        description,
        url: ROUTES.cards,
        items: cards.map((c) => ({name: c.name, url: ROUTES.card(c.id)})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function CardsPage() {
    const [allCards, banks, rawPersonas] = await Promise.all([
        getCards(),
        getBanks(),
        getPersonas().catch(() => []),
    ]);

    const personas = rawPersonas.filter((p) => {
        const model = new PersonaModel(p);
        return model.isKnown() && !model.isHidden();
    });

    const description = `Tra cứu ${allCards.length}+ thẻ tín dụng và thẻ ghi nợ từ ${banks.length}+ ngân hàng tại Việt Nam. Lọc theo hoàn tiền, miễn phí thường niên, cashback, du lịch. Thông tin được kiểm duyệt, độc lập, không quảng cáo.`;

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: buildTitle('Thẻ Tín Dụng & Thẻ Ghi Nợ Ngân Hàng Việt Nam', SECTION_TITLES.cards),
        description,
        url: '/the',
        items: allCards.map((c) => ({name: c.name, url: `/the/${c.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    return (
        <MarketingPageShell hideHeader breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}
                            className="space-y-12 md:space-y-16">
            <div className="intro grid grid-cols-12 gap-y-3 gap-x-4">
                <h1 className="col-span-12">Thẻ ngân hàng</h1>
                <div className="md:col-span-6 col-span-12 space-y-4">
                    <p className="">
                        Dưới đây là danh sách thẻ ngân hàng được phân loại theo nhu cầu sử dụng thực tế phổ biến. Mỗi
                        nhóm bao gồm thẻ tín dụng và thẻ ghi nợ từ nhiều ngân hàng, được xếp hạng tự động bằng thuật
                        toán của OpenWallet dựa trên các tiêu chí như cashback, phí và điều kiện thực tế.
                    </p>
                    <p className="">
                        Tra cứu danh sách {allCards.length}+ các loại thẻ ngân hàng tại Việt Nam. Với sự phát triển của
                        thanh toán không tiền mặt và hưởng ứng chủ trương của chính phủ, OpenWallet thu thập danh sách
                        thẻ
                        từ {banks.length}+ ngân hàng đang hoạt động tại Việt Nam với thông tin được kiểm duyệt thận
                        trọng.
                        Mục tiêu mang đến cho mọi người một công cụ tra cứu thẻ phù hợp với nhu cầu tiêu dùng.
                    </p>
                </div>
                <div className="md:col-span-6 col-span-12 space-y-4">
                    <p className="">
                        Bạn có thể bắt đầu với bảng xếp hạng thẻ theo lĩnh vực chi tiêu được tổng hợp tại đây:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <OwBadges>
                            {personas.map((p) => (
                                <Link key={p.slug} href={new PersonaModel(p).getHref()}>
                                    <OwBadge variant="persona" personaData={p}/>
                                </Link>
                            ))}
                        </OwBadges>
                    </div>
                    <p className="">
                        Bạn muốn được tư vấn? Hãy đặt câu hỏi với Owie.
                    </p>
                    <OpenOwieButton label="Hỏi Owie ngay" size="sm"/>
                </div>
            </div>

            <section className="space-y-6">
                <div className="border-t border-border pt-4 mt-2">
                    <h2 className="heading-5">Bộ lọc thẻ</h2>
                </div>
                <CardsGrid
                    cards={allCards}
                    banks={banks}
                    noCardsLabel='Không tìm thấy thẻ nào.'
                    useUrlState={true}
                    max={24}
                    defaultFilters="fee=under_500k&sort=tier_asc"
                />
            </section>
        </MarketingPageShell>
    );
}
