import type {Metadata} from 'next';
import type {Bank, Card} from '@/lib/api';
import {buildBreadcrumbJsonLd, type BreadcrumbItem} from './breadcrumb';
import {BASE_URL, API_URL} from './constants';
import {ROUTES} from '@/lib/routes';

export interface BankPageMeta {
    metadata: Metadata;
    jsonLd: object;
    breadcrumbItems: BreadcrumbItem[];
}

export function buildBankPageMeta(bank: Bank, cards: Card[]): BankPageMeta {
    const description = `${bank.full_name} - thẻ và thông tin chi tiết trên OpenWallet.`;
    const title = `${bank.name} | OpenWallet`;

    const breadcrumbItems: BreadcrumbItem[] = [
        {label: 'Trang chủ', href: '/'},
        {label: 'Ngân hàng', href: ROUTES.banks},
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
