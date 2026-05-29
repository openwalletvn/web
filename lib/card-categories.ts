export interface CardCategory {
    slug: string;
    name: string;
    href: string;
    description: string;
    group: 'daily' | 'digital' | 'business';
    theme?: 'primary' | 'black';
    available?: boolean;
}

export const CARD_CATEGORIES: CardCategory[] = [
    {slug: 'shopee', name: 'Thẻ Shopee', href: '/the-theo-nhu-cau/shopee', description: 'Thẻ ưu đãi Shopee', group: 'daily'},
    {slug: 'groceries', name: 'Thẻ Siêu thị', href: '/the-theo-nhu-cau/sieu-thi', description: 'Coopmart, Go, Lotte, AEON,...', group: 'daily'},
    {slug: 'digital', name: 'Dịch vụ số', href: '/the-theo-nhu-cau/dich-vu-so', description: 'AI, Netflix, Spotify,...', group: 'digital', theme: 'primary'},
    {slug: 'business', name: 'Thẻ doanh nghiệp', href: '/the-theo-nhu-cau/doanh-nghiep', description: 'Thẻ cho doanh nghiệp', group: 'business', theme: 'black'},
    {slug: 'traveler', name: 'Thẻ Du Lịch', href: '/the-theo-nhu-cau/du-lich', description: 'Vé máy bay, khách sạn, Agoda', group: 'daily'},
    {slug: 'commuter', name: 'Thẻ Di Chuyển', href: '/the-theo-nhu-cau/di-chuyen', description: 'Grab, Be, vận chuyển hàng ngày', group: 'daily'},
    {slug: 'family', name: 'Thẻ Gia Đình', href: '/the-theo-nhu-cau/gia-dinh', description: 'Siêu thị, học phí, y tế, bảo hiểm', group: 'daily'},
];
