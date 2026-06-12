import {OwButton} from '@/components/owui/ow-button';

const TO = 'hello@openwallet.vn';

export function ContactForm() {
    return (
        <div className="ow-contact-form flex flex-col gap-6">
            <div className="rounded-2xl border border-border overflow-hidden text-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
                    <span className="text-xs text-muted-foreground font-medium">New Message</span>
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-border" />
                        <span className="w-3 h-3 rounded-full bg-border" />
                        <span className="w-3 h-3 rounded-full bg-border" />
                    </div>
                </div>
                <div className="divide-y divide-border/60">
                    <div className="flex gap-3 px-4 py-2.5">
                        <span className="text-xs text-muted-foreground w-14 shrink-0 pt-px">To</span>
                        <span className="text-xs font-mono">{TO}</span>
                    </div>
                    <div className="flex gap-3 px-4 py-2.5">
                        <span className="text-xs text-muted-foreground w-14 shrink-0 pt-px">Subject</span>
                        <span className="text-xs font-mono text-muted-foreground italic">(tùy ý)</span>
                    </div>
                    <div className="px-4 py-4 min-h-16 bg-background/50">
                        <span className="text-xs text-muted-foreground italic">Nội dung email của bạn...</span>
                    </div>
                </div>
            </div>

            <OwButton asChild size="sm">
                <a href={`mailto:${TO}`}>Mở ứng dụng email</a>
            </OwButton>
        </div>
    );
}
