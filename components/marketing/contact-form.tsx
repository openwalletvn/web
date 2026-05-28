'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const TOPICS = [
    {
        label: 'Liên hệ chung',
        subject: '',
        desc: 'Góp ý, câu hỏi về dịch vụ, hoặc các vấn đề khác.',
    },
    {
        label: 'Yêu cầu API key (OpenWallet MCP)',
        subject: 'OpenWallet MCP Key Request',
        desc: 'Yêu cầu key thử nghiệm để tích hợp dữ liệu thẻ vào Claude và các AI assistant.',
    },
    {
        label: 'Yêu cầu truy cập beta (OpenWallet Chat)',
        subject: 'OpenWallet Chat Beta Access',
        desc: 'Đăng ký tham gia giai đoạn beta của OpenWallet Chat, trợ lý AI hỏi đáp thẻ ngân hàng.',
    },
    {
        label: 'Báo lỗi dữ liệu',
        subject: 'Báo lỗi dữ liệu thẻ',
        desc: 'Thông tin thẻ không chính xác về lãi suất, phí thường niên, hoặc ưu đãi.',
    },
];

const TO = 'hello@openwallet.vn';

export function ContactForm() {
    const [selected, setSelected] = useState(0);
    const topic = TOPICS[selected];
    const mailto = topic.subject
        ? `mailto:${TO}?subject=${encodeURIComponent(topic.subject)}`
        : `mailto:${TO}`;

    return (
        <div className="ow-contact-form flex flex-col gap-6">
            {/* Topic picker */}
            <div className="flex flex-col gap-2">
                {TOPICS.map((t, i) => (
                    <button
                        key={t.subject}
                        onClick={() => setSelected(i)}
                        className={cn('flex flex-col gap-0.5 text-left px-4 py-3 rounded-lg border transition-colors', selected === i ? 'border-foreground bg-foreground/5' : 'border-border hover:border-foreground/40')}
                    >
                        <span className="text-sm font-medium">{t.label}</span>
                        <span className="text-xs text-slate-500">{t.desc}</span>
                    </button>
                ))}
            </div>

            {/* Mail preview */}
            <div className="rounded-lg border border-border overflow-hidden text-sm">
                {/* Title bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
                    <span className="text-xs text-muted-foreground font-medium">New Message</span>
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-border" />
                        <span className="w-3 h-3 rounded-full bg-border" />
                        <span className="w-3 h-3 rounded-full bg-border" />
                    </div>
                </div>
                {/* Fields */}
                <div className="divide-y divide-border/60">
                    <div className="flex gap-3 px-4 py-2.5">
                        <span className="text-xs text-muted-foreground w-14 shrink-0 pt-px">To</span>
                        <span className="text-xs font-mono">{TO}</span>
                    </div>
                    <div className="flex gap-3 px-4 py-2.5">
                        <span className="text-xs text-muted-foreground w-14 shrink-0 pt-px">Subject</span>
                        <span className="text-xs font-mono text-slate-700">
                            {topic.subject || <span className="text-muted-foreground italic">(trống)</span>}
                        </span>
                    </div>
                    <div className="px-4 py-4 min-h-16 bg-background/50">
                        <span className="text-xs text-muted-foreground italic">Nội dung email của bạn...</span>
                    </div>
                </div>
            </div>

            <a
                href={mailto}
                className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity w-fit"
            >
                Mở ứng dụng email
            </a>
            <p className="text-xs text-slate-500 -mt-3">
                Chúng tôi cố gắng phản hồi trong vòng 2 ngày làm việc.
            </p>
        </div>
    );
}
