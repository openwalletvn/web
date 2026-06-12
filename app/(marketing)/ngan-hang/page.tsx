import type {Metadata} from 'next';
import {getBanks} from '@/lib/api';
import {OwBankRow} from '@/components/owui/ow-bank-row';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {ROUTES} from '@/lib/routes';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';
import {BANK_GROUP_LABELS, BANK_GROUP_ORDER} from '@/lib/bank-groups';

export const revalidate = 3600;

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Ngân hàng'},
];

export async function generateMetadata(): Promise<Metadata> {
    const banks = await getBanks();
    const {metadata} = buildCollectionPageMeta({
        title: buildTitle(SECTION_TITLES.banks),
        description: 'Danh sách các ngân hàng hoạt động ở Việt Nam trên OpenWallet.',
        url: ROUTES.banks,
        items: banks.map((b) => ({name: b.name, url: ROUTES.bank(b.id)})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function BanksPage() {
    const banks = await getBanks();

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: buildTitle(SECTION_TITLES.banks),
        description: 'Danh sách tất cả các ngân hàng Việt Nam trên OpenWallet.',
        url: ROUTES.banks,
        items: banks.map((b) => ({name: b.name, url: ROUTES.bank(b.id)})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    const grouped = BANK_GROUP_ORDER.map((group) => ({
        group,
        label: BANK_GROUP_LABELS[group],
        banks: banks.filter((b) => b.group === group),
    })).filter((g) => g.banks.length > 0);

    return (
        <MarketingPageShell title="Ngân hàng" description={`${banks.length} ngân hàng`} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <div className="flex flex-col md:gap-16 gap-8">
                {grouped.map(({group, label, banks: groupBanks}) => (
                    <section key={group}>
                        <h2 className="mb-4">{label}</h2>
                        <div className="flex flex-col gap-4">
                            {groupBanks.map((bank) => (
                                <OwBankRow key={bank.id} bank={bank}/>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </MarketingPageShell>
    );
}
