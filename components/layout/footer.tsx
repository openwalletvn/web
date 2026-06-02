import Image from 'next/image';
import Link from 'next/link';
import {OwLogo} from '@/components/ow-ui/ow-logo';
import {TOOLS} from '@/lib/tools';
import {cn} from '@/lib/utils';
import {ROUTES} from '@/lib/routes';
import {PersonaModel} from '@/lib/persona-model';

const LINKS = {
    tools: [
        ...TOOLS.map((t) => ({label: t.name, href: t.href, disabled: t.disabled}))],
    legal: [
        {label: 'Điều khoản', href: ROUTES.terms},
        {label: 'Chính sách bảo mật', href: ROUTES.privacy},
        {label: 'Miễn trừ trách nhiệm', href: ROUTES.disclaimer},
    ],
    directories: [
        {label: 'Ngân hàng', href: ROUTES.banks},
        {label: 'Thẻ', href: ROUTES.cards},
        {label: 'Tin tức', href: ROUTES.blog},
    ],
    about: [
        {label: 'Về OpenWallet', href: '/ve-openwallet'},
        {label: 'Liên hệ', href: ROUTES.contact},
        {label: 'Changelog', href: ROUTES.changelog},
    ],
    personas: [
        ...['shopee', 'groceries', 'family', 'commuter', 'traveler', 'digital']
            .map(slug => new PersonaModel(slug))
            .map(p => ({label: p.getName(), href: p.getHref()})),
        {label: 'Tất cả lĩnh vực', href: '/the-theo-nhu-cau'},
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
                    <div className="bg-black lg:rounded-2xl sm:rounded-xl rounded-lg px-6 py-8 sm:px-10 sm:py-10">
                        {/* Logo + columns */}
                        <div className="grid grid-cols-12 gap-x-4 gap-y-8">
                            {/* Logo */}
                            <div className="md:col-span-2 col-span-12">
                                <OwLogo variant="full" color="white" className="w-16 sm:w-20 xl:w-32"/>
                            </div>

                            {/* Link columns */}
                            <div className="md:col-span-10 col-span-12 grid grid-cols-12 gap-x-4 gap-y-8">
                                <div className="sm:col-span-4 col-span-6 flex flex-col gap-8">
                                    <LinkColumn heading="Danh mục" links={LINKS.directories}/>
                                    <LinkColumn heading="Công cụ" links={LINKS.tools}/>
                                </div>
                                <div className="sm:col-span-4 col-span-6 flex flex-col gap-8">
                                    <LinkColumn heading="Thẻ theo nhu cầu" links={LINKS.personas}/>
                                </div>
                                <div className="sm:col-span-4 col-span-12 flex flex-col gap-8">
                                    <LinkColumn heading="Về chúng tôi" links={LINKS.about}/>
                                    <LinkColumn heading="Pháp lý" links={LINKS.legal}/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom bar */}
                <div className="ow-container py-4 flex flex-col sm:flex-row justify-between gap-2 sm:gap-6">
                    <span className={metaCls}>© {new Date().getFullYear()} Openwallet. All rights reserved.</span>
                    <span className={cn(metaCls, 'sm:text-right')}>
                        Thông tin chỉ mang tính chất tham khảo, không phải lời khuyên đầu tư chuyên nghiệp.
                    </span>
                </div>

                {/* Big wordmark */}
                <div className="w-full leading-[0] overflow-hidden" style={{maxHeight: '11rem'}}>
                    <Image
                        src="/footer-open-wallet.svg"
                        alt="OpenWallet"
                        width={1602}
                        height={269}
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </footer>
    );
}

const linkCls =
    'font-medium text-[18px] sm:text-[20px] xl:text-[24px] leading-[120%] tracking-[-1px] text-white hover:text-white/70 transition-colors';

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
        <div className="flex flex-col xl:gap-4 gap-2">
            <p className="text-label text-neutral-400">{heading}</p>
            <ul className="flex flex-col gap-2">
                {links.map(({label, href, disabled, suffix}) => (
                    <li key={label} className="flex flex-wrap items-baseline gap-2">
                        {disabled ? (
                            <span className={cn(linkCls, 'opacity-40 cursor-default')}>{label}</span>
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
