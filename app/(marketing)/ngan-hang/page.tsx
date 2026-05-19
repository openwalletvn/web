import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {getBanks} from '@/lib/api';
import {BankItem} from '@/components/shared/bank-item';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCollectionPageMeta} from '@/lib/page-meta/collection';

const BREADCRUMB_ITEMS = [
    {label: 'Trang chủ', href: '/'},
    {label: 'Ngân hàng'},
];

export async function generateMetadata(): Promise<Metadata> {
    const banks = await getBanks();
    const {metadata} = buildCollectionPageMeta({
        title: 'Ngân hàng | Open Wallet',
        description: 'Danh sách tất cả các ngân hàng Việt Nam trên Open Wallet.',
        url: '/ngan-hang',
        items: banks.map((b) => ({name: b.name, url: `/ngan-hang/${b.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });
    return metadata;
}

export default async function BanksPage() {
    const [banks, t] = await Promise.all([
        getBanks(),
        getTranslations('BanksPage'),
    ]);

    const {jsonLd, breadcrumbItems} = buildCollectionPageMeta({
        title: 'Ngân hàng | Open Wallet',
        description: 'Danh sách tất cả các ngân hàng Việt Nam trên Open Wallet.',
        url: '/ngan-hang',
        items: banks.map((b) => ({name: b.name, url: `/ngan-hang/${b.id}`})),
        breadcrumbItems: BREADCRUMB_ITEMS,
    });

    return (
        <div className="ow-banks-page py-12">
            <div className="ow-container">
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <Breadcrumbs items={breadcrumbItems}/>

                <h1 className="mb-1">{t('title')}</h1>
                <p className="text-text-muted mb-8">{t('count', {count: banks.length})}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {banks.map((bank) => (
                        <BankItem key={bank.id} bank={bank}/>
                    ))}
                </div>
            </div>
        </div>
    );
}
