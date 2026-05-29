import type {Metadata} from 'next';
import {getPersonas} from '@/lib/api';
import {CARD_CATEGORIES} from '@/lib/card-categories';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';
import Link from 'next/link';
import {Button} from '@/components/ui/button';

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ theo nhu cầu'},
];

const META = {
    title: buildTitle(SECTION_TITLES.persona),
    description: 'Danh sách thẻ ngân hàng phân loại theo nhu cầu sử dụng: Shopee, siêu thị, du lịch, di chuyển, dịch vụ số, gia đình, doanh nghiệp. Xếp hạng tự động bằng thuật toán.',
    url: '/the-theo-nhu-cau',
};

export async function generateMetadata(): Promise<Metadata> {
    const {metadata} = buildCollectionPageMeta({
        title: META.title,
        description: META.description,
        url: META.url,
        items: CARD_CATEGORIES.map((c) => ({name: c.name, url: c.href})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function PersonaHubPage() {
    const personas = await getPersonas().catch(() => []);

    const categoryMap = Object.fromEntries(CARD_CATEGORIES.map((c) => [c.slug, c]));

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: META.title,
        description: META.description,
        url: META.url,
        items: CARD_CATEGORIES.map((c) => ({name: c.name, url: c.href})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    const items = personas
        .map((p) => ({persona: p, category: categoryMap[p.slug]}))
        .filter((item) => item.category);

    return (
        <MarketingPageShell
            title="Thẻ theo nhu cầu"
            description="Tìm thẻ ngân hàng phù hợp với nhu cầu của bạn, từ mua sắm online đến du lịch hay chi tiêu gia đình."
            breadcrumbItems={breadcrumbItems}
            jsonLd={jsonLd}
        >
            <section className="ow-persona-hub-page flex flex-col gap-10">
                <div className="flex flex-col gap-3 max-w-2xl">
                    <p className="text-base text-text-muted">
                        Dưới đây là danh sách thẻ ngân hàng được phân loại theo nhu cầu sử dụng thực tế phổ biến. Mỗi nhóm bao gồm thẻ tín dụng và thẻ ghi nợ từ nhiều ngân hàng, được xếp hạng tự động bằng thuật toán của OpenWallet dựa trên các tiêu chí như cashback, phí và điều kiện thực tế.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map(({persona, category}) => (
                        <Link
                            key={persona.slug}
                            href={category.href}
                            className="bg-white rounded-xl border p-5 flex flex-col gap-2 hover:shadow-md transition-shadow"
                        >
                            <span className="font-semibold text-base">{persona.labelVi ?? persona.label}</span>
                            <span className="text-text-muted text-sm">{category.description}</span>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col gap-3 max-w-2xl">
                    <p className="text-base text-text-muted">
                        OpenWallet tiếp tục cập nhật dữ liệu và tối ưu thuật toán để gợi ý thẻ chính xác hơn theo từng nhu cầu. Nếu bạn muốn tìm thẻ theo tiêu chí cá nhân cụ thể, mức chi tiêu hoặc danh mục riêng, hãy dùng công cụ Card Match.
                    </p>
                    <div>
                        <Button asChild variant="outline">
                            <Link href="/card-match">Đi đến Card Match</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </MarketingPageShell>
    );
}
