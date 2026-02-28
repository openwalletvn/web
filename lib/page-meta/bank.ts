import type {Metadata} from 'next';
import type {Bank, Card} from '@/lib/api';
import {buildBreadcrumbJsonLd, type BreadcrumbItem} from './breadcrumb';

const BASE_URL = 'https://openwallet.vn';
const API_URL = 'https://api.openwallet.vn';

export interface BankPageMeta {
    metadata: Metadata;
    jsonLd: object;
    breadcrumbItems: BreadcrumbItem[];
}

export function buildBankPageMeta(bank: Bank, cards: Card[]): BankPageMeta {
    const description = `${bank.full_name} - thẻ và thông tin chi tiết trên Open Wallet.`;
    const title = `${bank.name} | Open Wallet`;

    const breadcrumbItems: BreadcrumbItem[] = [
        {label: 'Trang chủ', href: '/'},
        {label: 'Ngân hàng', href: '/ngan-hang'},
        {label: bank.name},
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'FinancialService',
                name: bank.name,
                alternateName: bank.full_name,
                url: bank.link,
                logo: `${API_URL}${bank.logo_url}`,
                areaServed: 'VN',
                hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    itemListElement: cards.map((card) => ({
                        '@type': 'Offer',
                        name: card.name,
                        url: `${BASE_URL}/the/${card.id}`,
                    })),
                },
            },
            {
                '@type': 'ItemList',
                itemListElement: cards.map((card, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: card.name,
                    url: `${BASE_URL}/the/${card.id}`,
                })),
            },
            buildBreadcrumbJsonLd(breadcrumbItems),
        ],
    };

    return {
        metadata: {
            title,
            description,
            openGraph: {title, description},
            twitter: {title, description},
        },
        jsonLd,
        breadcrumbItems,
    };
}
