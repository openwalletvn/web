import type {Metadata} from 'next';
import {getBanks} from '@/lib/api';
import {BankItem} from '@/components/shared/bank-item';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';
import {ROUTES} from '@/lib/routes';

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Ngân hàng'},
];

export async function generateMetadata(): Promise<Metadata> {
    const banks = await getBanks();
    const {metadata} = buildCollectionPageMeta({
        title: 'Ngân hàng | Open Wallet',
        description: 'Danh sách tất cả các ngân hàng Việt Nam trên Open Wallet.',
        url: ROUTES.banks,
        items: banks.map((b) => ({name: b.name, url: ROUTES.bank(b.id)})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function BanksPage() {
    const banks = await getBanks();

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: 'Ngân hàng | Open Wallet',
        description: 'Danh sách tất cả các ngân hàng Việt Nam trên Open Wallet.',
        url: ROUTES.banks,
        items: banks.map((b) => ({name: b.name, url: ROUTES.bank(b.id)})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    return (
        <MarketingPageShell title="Ngân hàng" description={`${banks.length} ngân hàng`} breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {banks.map((bank) => (
                    <BankItem key={bank.id} bank={bank}/>
                ))}
            </div>
        </MarketingPageShell>
    );
}
