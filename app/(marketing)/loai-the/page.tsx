import type {Metadata} from 'next';
import Link from 'next/link';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';
import {ROUTES} from '@/lib/routes';
import {CARD_TYPE_LABELS, CARD_TYPE_HEX, CARD_TYPE_ICON, CARD_TYPE_SLUGS} from '@/lib/card-model';
import type {CardType} from '@/lib/api';

const CARD_TYPE_DESCRIPTIONS: Partial<Record<CardType, string>> = {
    credit: 'Thẻ thanh toán sau, thường có cashback hoặc tích điểm. Phù hợp để tối ưu hoàn tiền và quản lý chi tiêu linh hoạt.',
    debit: 'Thẻ thanh toán trực tiếp từ tài khoản ngân hàng. Không mất phí lãi suất, phù hợp kiểm soát chi tiêu chặt chẽ.',
    hybrid: 'Kết hợp tính năng thẻ tín dụng và ghi nợ. Linh hoạt trong thanh toán, phù hợp nhiều nhu cầu khác nhau.',
};

const ITEMS = (Object.entries(CARD_TYPE_SLUGS) as [CardType, string][]).map(([type, slug]) => ({
    type,
    slug,
    label: CARD_TYPE_LABELS[type],
    description: CARD_TYPE_DESCRIPTIONS[type] ?? '',
    href: ROUTES.cardTypePage(slug),
    hex: CARD_TYPE_HEX[type],
    Icon: CARD_TYPE_ICON[type],
}));

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Loại thẻ'},
];

const META = {
    title: buildTitle(SECTION_TITLES.cardTypes),
    description: 'Tổng hợp các loại thẻ ngân hàng tại Việt Nam: thẻ tín dụng, thẻ ghi nợ, thẻ hybrid. So sánh đặc điểm và tìm thẻ phù hợp.',
    url: ROUTES.cardTypes,
};

export async function generateMetadata(): Promise<Metadata> {
    const {metadata} = buildCollectionPageMeta({
        title: META.title,
        description: META.description,
        url: META.url,
        items: ITEMS.map((i) => ({name: i.label, url: i.href})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default function CardTypesPage() {
    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: META.title,
        description: META.description,
        url: META.url,
        items: ITEMS.map((i) => ({name: i.label, url: i.href})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    return (
        <MarketingPageShell
            title="Loại thẻ"
            description="Tổng hợp các loại thẻ ngân hàng tại Việt Nam. Chọn loại thẻ để xem danh sách và so sánh chi tiết."
            breadcrumbItems={breadcrumbItems}
            jsonLd={jsonLd}
        >
            <section className="ow-card-types-page flex flex-col gap-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {ITEMS.map(({type, label, description, href, hex, Icon}) => (
                        <Link
                            key={type}
                            href={href}
                            className="bg-white rounded-xl border p-5 flex flex-col gap-2 hover:shadow-md transition-shadow"
                        >
                            <span className="flex items-center gap-2 font-semibold text-base">
                                {Icon && <span style={{color: hex}}><Icon size={18}/></span>}
                                {label}
                            </span>
                            <span className="text-text-muted text-sm">{description}</span>
                        </Link>
                    ))}
                </div>
            </section>
        </MarketingPageShell>
    );
}
