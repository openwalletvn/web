import type {Metadata} from 'next';
import {getPersonas} from '@/lib/api';
import {CARD_CATEGORIES} from '@/lib/card-categories';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import Link from 'next/link';

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Thẻ theo nhu cầu'},
];

const META = {
    title: 'Thẻ ngân hàng theo nhu cầu | Open Wallet',
    description: 'Tìm thẻ ngân hàng phù hợp với nhu cầu chi tiêu của bạn: Shopee, siêu thị, y tế, giáo dục, bảo hiểm, dịch vụ số, doanh nghiệp.',
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
            description={META.description}
            breadcrumbItems={breadcrumbItems}
            jsonLd={jsonLd}
        >
            <section className="ow-persona-hub-page">
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
            </section>
        </MarketingPageShell>
    );
}
