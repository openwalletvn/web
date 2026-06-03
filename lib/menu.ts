import { TOOLS, type Tool } from '@/lib/tools';
import { ROUTES } from '@/lib/routes';

export interface MenuItem {
    label: string;
    href: string;
}

export interface MenuColumn {
    title: string;
    items: MenuItem[];
}

export interface MenuRow {
    title: string;
    items: MenuItem[];
    type?: 'networks';
}

export interface MenuItemWithDropdown {
    label: string;
    /** Optional href for the dropdown trigger itself */
    href?: string;
    /** Simple flat list of items */
    items?: Tool[];
    /** Row-based layout for cards mega menu */
    rows?: MenuRow[];
    /** Columns for mega menu layout */
    columns?: MenuColumn[];
    /** Footer link for "View all" */
    footerLink?: MenuItem;
    /** Special type for dynamic content like banks */
    type?: 'banks';
}

export type NavItem = MenuItem | MenuItemWithDropdown;

function isDropdown(item: NavItem): item is MenuItemWithDropdown {
    return 'columns' in item || 'rows' in item || 'type' in item || 'items' in item;
}

export const MENU: NavItem[] = [
    {label: 'Trang chủ', href: '/'},

    {
        label: 'Ngân hàng',
        type: 'banks',
        footerLink: {label: 'Xem tất cả ngân hàng →', href: ROUTES.banks},
    },

    {
        label: 'Thẻ',
        rows: [
            {
                title: 'Mạng lưới thẻ',
                type: 'networks',
                items: [
                    {label: 'Visa', href: '/the-tin-dung-visa'},
                    {label: 'Mastercard', href: '/the-tin-dung-mastercard'},
                    {label: 'JCB', href: '/the-tin-dung-jcb'},
                    {label: 'American Express', href: '/the-tin-dung-amex'},
                    {label: 'NAPAS', href: '/the-tin-dung-noi-dia'},
                ],
            },
            {
                title: 'Thẻ tín dụng (credit)',
                items: [
                    {label: 'Tất cả', href: '/the-tin-dung'},
                    {label: 'Miễn phí thường niên', href: '/the-tin-dung-mien-phi-thuong-nien'},
                    {label: 'Thẻ tín dụng Napas', href: '/the-tin-dung-noi-dia'},
                    {label: 'Thẻ hybrid', href: '/the-2-trong-1'},
                ],
            },
            {
                title: 'Thẻ ghi nợ (debit)',
                items: [
                    {label: 'Tất cả', href: '/the-ghi-no'},
                    {label: 'Miễn phí thường niên', href: '/the-ghi-no-mien-phi'},
                    {label: 'Thẻ ghi nợ Napas', href: '/the-ghi-no-noi-dia'},
                ],
            },
            {
                title: 'OpenWallet Picks',
                items: [
                    {label: 'Thẻ ưu đãi Shopee', href: '/linh-vuc/shopee'},
                    {label: 'Thẻ kim loại', href: '/the-kim-loai'},
                    {label: 'Thẻ cao cấp', href: '/the-tin-dung-cao-cap'},
                    {label: 'Thẻ doanh nghiệp', href: '/linh-vuc/doanh-nghiep'},
                ],
            },
        ],
        footerLink: {label: 'Xem tất cả thẻ →', href: ROUTES.cards},
    },

    {label: 'Tin tức', href: ROUTES.blog},

    {
        label: 'Công cụ',
        items: TOOLS,
    },

    {label: 'Về chúng tôi', href: '/ve-openwallet'},
];

export {isDropdown};
