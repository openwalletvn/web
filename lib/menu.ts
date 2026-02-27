export interface MenuItem {
    label: string;
    href: string;
}

export interface MenuColumn {
    title: string;
    items: MenuItem[];
}

export interface MenuItemWithDropdown {
    label: string;
    /** Optional href for the dropdown trigger itself */
    href?: string;
    /** Columns for mega menu layout */
    columns?: MenuColumn[];
    /** Footer link for "View all" */
    footerLink?: MenuItem;
    /** Special type for dynamic content like banks */
    type?: 'banks';
}

export type NavItem = MenuItem | MenuItemWithDropdown;

function isDropdown(item: NavItem): item is MenuItemWithDropdown {
    return 'columns' in item || 'type' in item;
}

export const MENU: NavItem[] = [
    {label: 'Trang chủ', href: '/'},

    {
        label: 'Ngân hàng',
        type: 'banks',
        footerLink: {label: 'Xem tất cả ngân hàng →', href: '/ngan-hang'},
    },

    {
        label: 'Thẻ',
        columns: [
            {
                title: 'Theo loại',
                items: [
                    {label: 'Tất cả thẻ', href: '/the'},
                    {label: 'Thẻ tín dụng', href: '/the-tin-dung'},
                    {label: 'Thẻ ghi nợ', href: '/the-ghi-no'},
                    {label: 'Thẻ 2 trong 1', href: '/the-2-trong-1'},
                    {label: 'Thẻ đồng thương hiệu', href: '/the-dong-thuong-hieu'},
                ],
            },
            {
                title: 'Theo mạng',
                items: [
                    {label: 'Visa', href: '/the-tin-dung-visa'},
                    {label: 'Mastercard', href: '/the-tin-dung-mastercard'},
                    {label: 'JCB', href: '/the-tin-dung-jcb'},
                    {label: 'American Express', href: '/the-tin-dung-amex'},
                    {label: 'Napas (Nội địa)', href: '/the-ghi-no-noi-dia'},
                ],
            },
            {
                title: 'Theo phí',
                items: [
                    {label: 'Tín dụng miễn phí', href: '/the-tin-dung-mien-phi-thuong-nien'},
                    {label: 'Ghi nợ miễn phí', href: '/the-ghi-no-mien-phi'},
                ],
            },
        ],
    },

    {label: 'Tin tức', href: '/tin-tuc'},
    {label: 'API Docs', href: '/docs'},
];

export {isDropdown};
