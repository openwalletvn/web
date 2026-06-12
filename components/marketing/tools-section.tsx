import React from 'react';
import Link from 'next/link';
import {ROUTES} from '@/lib/routes';
import {OwWobbleCard} from '@/components/owui/ow-wobble-card';
import {IconExternalLink} from '@tabler/icons-react';

const TOOLS: {name: string; href: string; description: React.ReactNode; color: string}[] = [
    {
        name: 'Card Match',
        href: ROUTES.cardMatch,
        description: 'Nhập thói quen chi tiêu, nhận đề xuất thẻ phù hợp nhất theo nhu cầu cụ thể.',
        color: '#EF3C23',
    },
    {
        name: 'Card Battle',
        href: ROUTES.cardBattle,
        description: 'So sánh hai thẻ bất kỳ cạnh nhau, dựa trên dữ liệu thực về phí, hoàn tiền và ưu đãi.',
        color: '#1a1a1a',
    },
    {
        name: 'Owie Chat',
        href: ROUTES.owieChat,
        description: <>
          Trợ lý AI tư vấn thẻ, trả lời dựa trên dữ liệu thực từ OpenWallet. <span className="inline-block">Miễn phí, không cần đăng ký.</span>
        </>,
        color: '#2563eb',
    },
    {
        name: 'OpenWallet MCP',
        href: ROUTES.openwalletMcp,
        description: 'Tích hợp dữ liệu thẻ OpenWallet vào AI assistant qua giao thức MCP.',
        color: '#7c3aed',
    },
];

const DEV_TOOLS: {name: string; href: string; description: string}[] = [
    {
        name: 'Dashboard',
        href: 'https://dash.openwallet.vn',
        description: 'Quản lý dữ liệu thẻ và nội dung OpenWallet.',
    },
    {
        name: 'Storybook',
        href: 'https://storybook.openwallet.vn',
        description: 'Thư viện component UI của OpenWallet.',
    },
    {
        name: 'MCP Inspector',
        href: 'https://inspector.openwallet.vn',
        description: 'Kiểm tra và debug OpenWallet MCP server.',
    },
];

export function ToolsSection() {
    return (
        <section id="cong-cu" className="ow-tools-section md:py-16 py-12 relative z-1 min-h-screen flex flex-col justify-center items-center">
            <div className="ow-container flex flex-col gap-8">
                <h2>Công cụ</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {TOOLS.map((tool) => (
                        <Link key={tool.href} href={tool.href}>
                            <OwWobbleCard brandColor={tool.color} className="items-start text-left gap-3 sm:min-h-52 min-h-40">
                                <h3 className="text-white">{tool.name}</h3>
                                <p className="text-white/70">{tool.description}</p>
                            </OwWobbleCard>
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col gap-3 md:pt-8 pt-4">
                    <p className="text-sm font-medium text-foreground/40 uppercase tracking-wider">Dành cho developer</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {DEV_TOOLS.map((tool) => (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col gap-1.5 rounded-xl border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/60 hover:border-border"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-semibold text-foreground/70 group-hover:text-foreground transition-colors">{tool.name}</span>
                                    <IconExternalLink size={13} className="text-foreground/30 shrink-0" />
                                </div>
                                <span className="text-xs text-foreground/40">{tool.description}</span>
                                <span className="text-xs text-foreground/25">{tool.href.replace('https://', '')}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
