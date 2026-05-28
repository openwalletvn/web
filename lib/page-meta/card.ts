import type {Metadata} from 'next';
import type {Card, Bank} from '@/lib/api';
import {getCardImageUrl, getBankImageUrl} from '@/lib/api';
import {buildBreadcrumbJsonLd, type BreadcrumbItem} from './breadcrumb';
import {BASE_URL} from './constants';

export interface CardPageMeta {
    metadata: Metadata;
    jsonLd: object;
    breadcrumbItems: BreadcrumbItem[];
}

export function buildCardPageMeta(card: Card, bank: Bank | null): CardPageMeta {
    const bankName = bank?.name ?? '';
    const fallbackDescription = `${card.name} - thẻ ${card.card_network} ${card.card_type.join('/')} ${bankName ? `của ${bankName}` : 'trên Open Wallet'}.`;
    const description = card.description ? card.description.slice(0, 160) : fallbackDescription;
    const title = `${card.name} | Open Wallet`;
    const url = `${BASE_URL}/the/${card.id}`;

    const breadcrumbItems: BreadcrumbItem[] = [
        {label: 'Trang chủ', href: '/'},
        {label: 'Thẻ', href: '/the'},
        {label: card.name},
    ];

    const cardCategory =
        card.card_type.includes('credit') && card.card_type.includes('debit')
            ? 'Thẻ 2 trong 1'
            : card.card_type.includes('credit')
                ? 'Thẻ tín dụng'
                : 'Thẻ ghi nợ';

    const feesSpec =
        card.fees?.annual?.amount === 0
            ? 'Miễn phí thường niên'
            : card.fees?.annual != null
                ? `${card.fees.annual.amount.toLocaleString('vi-VN')} VNĐ/năm`
                : undefined;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'FinancialProduct',
                name: card.name,
                description,
                url,
                image: getCardImageUrl(card),
                category: cardCategory,
                ...(bank ? {
                    provider: {
                        '@type': 'BankOrCreditUnion',
                        name: bank.name,
                        url: bank.link,
                        image: getBankImageUrl(bank.logo_url),
                        ...(bank.stats?.max_annual_fee && bank.stats.max_annual_fee > 0 ? {
                            priceRange: `Từ 0đ - ${bank.stats.max_annual_fee.toLocaleString('vi-VN')} VNĐ/năm`,
                        } : {}),
                    },
                } : {}),
                ...(feesSpec ? {feesAndCommissionsSpecification: feesSpec} : {}),
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
