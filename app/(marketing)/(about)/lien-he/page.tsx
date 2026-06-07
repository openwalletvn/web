import type {Metadata} from 'next';
import Link from 'next/link';
import {ProsePageShell} from '@/components/layout/prose-page-shell';
import {ContactForm} from '@/components/marketing/contact-form';
import {buildTitle} from '@/lib/page-meta/title';

export const metadata: Metadata = {
    title: buildTitle('Liên Hệ'),
    description: 'Liên hệ với đội ngũ OpenWallet để góp ý, báo lỗi dữ liệu, hoặc đề xuất tính năng.',
};

export default function Page() {
    return (
        <ProsePageShell title="Liên hệ">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3 text-body text-slate-700">
                    <p>
                        OpenWallet là dự án cộng đồng, được xây dựng với mong muốn giúp người Việt so sánh thẻ ngân hàng
                        một cách độc lập và minh bạch.
                    </p>
                    <p>
                        OpenWallet luôn sẵn sàng tiếp nhận ý kiến, góp ý, đề xuất tính năng, báo lỗi dữ liệu, hoặc bất kỳ
                        hình thức hợp tác nào. Nếu bạn có điều gì muốn chia sẻ, hãy liên hệ qua email bên dưới hoặc nhắn
                        trực tiếp trên{' '}
                        <Link href="https://discord.gg/bsnHax5BYZ" target="_blank" rel="noopener noreferrer"
                              className="text-link">Discord</Link>.
                    </p>
                </div>

                <ContactForm/>

                <div className="flex flex-col gap-2 text-sm text-slate-600">
                    <p>
                        Hoặc tham gia cộng đồng trên Discord để trao đổi trực tiếp:
                    </p>
                    <Link
                        href="https://discord.gg/bsnHax5BYZ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link font-mono text-sm"
                    >
                        discord.gg/bsnHax5BYZ
                    </Link>
                </div>
            </div>
        </ProsePageShell>
    );
}
