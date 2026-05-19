import Image from 'next/image';
import Link from 'next/link';
import {Logo} from '@/components/layout/logo';

const LINKS = {
    tools: [
        {label: 'So sánh thẻ', href: '/so-sanh'},
        {label: 'Find your card', disabled: true, href: '/so-sanh'},
        {label: 'Wallet App', disabled: true, href: '/tai-app'},
        {label: 'WalletAI', href: '#', disabled: true, suffix: 'coming soon'},
    ],
    legal: [
        {label: 'Điều khoản', href: '/dieu-khoan'},
        {label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat'},
        {label: 'Miễn trừ trách nhiệm', href: '/mien-tru-trach-nhiem'},
    ],
    categories: [
        {label: 'Ngân hàng', href: '/ngan-hang'},
        {label: 'Thẻ', href: '/the'},
        {label: 'Tin tức', href: '/tin-tuc'},
        {label: 'Về OpenWallet', href: '/ve-openwallet'},
    ],
};

export function Footer() {
    return (
        <footer className="ow-footer relative">
            {/* Zip: red scallops on white bg — creates page→footer edge */}
            <div className="w-full absolute top-0 left-0 right-0 -translate-y-1/2 md:h-[75px] h-[40px] overflow-hidden">
                <Image src="/zip.svg" alt="" width={2803} height={75} className="h-full max-w-none aspect-[2803/75] block absolute left-1/2 -translate-x-1/2 top-0" aria-hidden/>
            </div>

            <div className="bg-[#EF3C23]">

                {/* Main black box */}
                <div className="ow-container py-6 sm:py-10">
                    <div className="bg-black rounded-2xl px-6 py-8 sm:px-10 sm:py-10">
                        {/* Logo + columns */}
                        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-0">
                            {/* Logo */}
                            <Logo variant="full" color="white" className="w-16 sm:w-24 md:w-32 md:mr-16" />

                            {/* Link columns */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1">
                                <LinkColumn heading="Công cụ" links={LINKS.tools}/>
                                <LinkColumn heading="Pháp lý" links={LINKS.legal}/>
                                <LinkColumn heading="Danh mục" links={LINKS.categories}/>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom bar */}
                <div className="ow-container py-4 flex flex-col sm:flex-row justify-between gap-2 sm:gap-6">
                    <span className={metaCls}>© {new Date().getFullYear()} Openwallet. All rights reserved.</span>
                    <span className={`${metaCls} sm:text-right`}>
                        Thông tin chỉ mang tính chất tham khảo, không phải lời khuyên đầu tư chuyên nghiệp.
                    </span>
                </div>

                {/* Big wordmark */}
                <div className="w-full leading-[0] overflow-hidden" style={{maxHeight: '11rem'}}>
                    <Image
                        src="/footer-open-wallet.svg"
                        alt="Open Wallet"
                        width={1602}
                        height={269}
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </footer>
    );
}

const titleCls =
    'font-semibold text-[12px] leading-[130%] tracking-[1px] uppercase text-[#9a9a9a]';

const linkCls =
    'font-medium text-[18px] sm:text-[24px] leading-[120%] tracking-[-1px] text-white hover:text-white/70 transition-colors';

const metaCls =
    'font-semibold text-[11px] sm:text-[12px] leading-[130%] tracking-[1px] uppercase text-white';

function LinkColumn({
    heading,
    links,
}: {
    heading: string;
    links: { label: string; href: string; disabled?: boolean; suffix?: string }[];
}) {
    return (
        <div className="flex flex-col gap-4">
            <p className={titleCls}>{heading}</p>
            <ul className="flex flex-col gap-2">
                {links.map(({label, href, disabled, suffix}) => (
                    <li key={label} className="flex flex-wrap items-baseline gap-2">
                        {disabled ? (
                            <span className={`${linkCls} opacity-40 cursor-default`}>{label}</span>
                        ) : (
                            <Link href={href} className={linkCls}>{label}</Link>
                        )}
                        {suffix && (
                            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide uppercase text-white/40">{suffix}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
