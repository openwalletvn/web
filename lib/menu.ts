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
        footerLink: {label: 'Xem tất cả thẻ →', href: '/the'},
        columns: [
            {
                title: 'Thẻ tín dụng',
                items: [
                    {label: 'Tất cả thẻ tín dụng', href: '/the-tin-dung'},
                    {label: 'Thẻ tín dụng Visa', href: '/the-tin-dung-visa'},
                    {label: 'Thẻ tín dụng Mastercard', href: '/the-tin-dung-mastercard'},
                    {label: 'Thẻ tín dụng JCB', href: '/the-tin-dung-jcb'},
                    {label: 'Thẻ tín dụng American Express', href: '/the-tin-dung-amex'},
                    {label: 'Thẻ tín dụng miễn phí thường niên', href: '/the-tin-dung-mien-phi-thuong-nien'},
                    {label: 'Thẻ tín dụng cao cấp', href: '/the-tin-dung-cao-cap'},
                ],
            },
            {
                title: 'Thẻ ghi nợ',
                items: [
                    {label: 'Tất cả thẻ ghi nợ', href: '/the-ghi-no'},
                    {label: 'Thẻ ghi nợ Visa', href: '/the-ghi-no-visa'},
                    {label: 'Thẻ ghi nợ Mastercard', href: '/the-ghi-no-mastercard'},
                    {label: 'Thẻ ghi nợ nội địa (Napas)', href: '/the-ghi-no-noi-dia'},
                    {label: 'Thẻ ghi nợ miễn phí', href: '/the-ghi-no-mien-phi'},
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
        ],
    },

    {label: 'Tin tức', href: '/tin-tuc'},
    {label: 'API Docs', href: '/docs'},
];

export {isDropdown};
