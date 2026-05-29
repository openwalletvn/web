import type { Metadata } from 'next';
import { ProsePageShell } from '@/components/layout/prose-page-shell';
import { ContactForm } from '@/components/marketing/contact-form';
import {buildTitle} from '@/lib/page-meta/title';

export const metadata: Metadata = {
    title: buildTitle('Liên Hệ'),
    description: 'Liên hệ với đội ngũ OpenWallet để góp ý, báo lỗi dữ liệu, hoặc yêu cầu truy cập vào các tính năng đang phát triển.',
};

export default function Page() {
    return (
        <ProsePageShell title="Liên hệ">
            <ContactForm />
        </ProsePageShell>
    );
}
