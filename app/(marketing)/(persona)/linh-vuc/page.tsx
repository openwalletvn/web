import type {Metadata} from 'next';
import {getPersonas} from '@/lib/api';
import {PersonaModel} from '@/lib/persona-model';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';
import Link from 'next/link';
import {OwButton} from '@/components/ow-ui/ow-button';
import {OwWobbleCard} from '@/components/ow-ui/ow-wobble-card';

export const revalidate = 3600;

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Lĩnh vực'},
];

const META = {
    title: buildTitle(SECTION_TITLES.persona),
    description: 'Danh sách thẻ ngân hàng phân loại theo nhu cầu sử dụng: Shopee, siêu thị, du lịch, di chuyển, dịch vụ số, gia đình, doanh nghiệp. Xếp hạng tự động bằng thuật toán.',
    url: '/linh-vuc',
};

export async function generateMetadata(): Promise<Metadata> {
    const {metadata} = buildCollectionPageMeta({
        title: META.title,
        description: META.description,
        url: META.url,
        items: PersonaModel.all().map((p) => ({name: p.getName(), url: p.getHref()})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function PersonaHubPage() {
    const personas = await getPersonas().catch(() => []);

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: META.title,
        description: META.description,
        url: META.url,
        items: PersonaModel.all().map((p) => ({name: p.getName(), url: p.getHref()})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    const items = personas
        .map((p) => new PersonaModel(p))
        .filter((p) => p.isKnown() && !p.isHidden());

    return (
        <MarketingPageShell
            title="Lĩnh vực"
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

                <div className="ow-persona-hub-page-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map((persona) => (
                        <Link key={persona.getSlug()} href={persona.getHref()}>
                            <OwWobbleCard brandColor={persona.getColor()}>
                                <span className="heading-5 text-white">{persona.getDisplayLabel()}</span>
                                <span className="inline-flex gap-1">{persona.getEmoji().map((e, i) => <span key={i}>{e}</span>)}</span>
                                <span className="text-white/70 text-sm">{persona.getDescription()}</span>
                            </OwWobbleCard>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col gap-3 max-w-2xl">
                    <p className="text-base text-text-muted">
                        OpenWallet tiếp tục cập nhật dữ liệu và tối ưu thuật toán để gợi ý thẻ chính xác hơn theo từng nhu cầu. Nếu bạn muốn tìm thẻ theo tiêu chí cá nhân cụ thể, mức chi tiêu hoặc danh mục riêng, hãy dùng công cụ Card Match.
                    </p>
                    <div>
                        <OwButton asChild>
                            <Link href="/card-match">Đi đến Card Match</Link>
                        </OwButton>
                    </div>
                </div>
            </section>
        </MarketingPageShell>
    );
}
