import {BASE_URL} from './constants';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            ...(item.href ? {item: `${BASE_URL}${item.href}`} : {}),
        })),
    };
}
