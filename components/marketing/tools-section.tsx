import React from 'react';
import Link from 'next/link';
import {ROUTES} from '@/lib/routes';
import {OwWobbleCard} from '@/components/owui/ow-wobble-card';

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

export function ToolsSection() {
    return (
        <section className="ow-tools-section md:py-16 py-12 relative z-1">
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
            </div>
        </section>
    );
}
