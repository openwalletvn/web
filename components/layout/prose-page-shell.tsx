import { cn } from '@/lib/utils';

export function ProsePageShell({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="ow-prose-page-shell ow-container md:pt-16 md:pb-32 pt-8 pb-14">
            <div className="max-w-3xl mx-auto">
                <h1 className={cn('heading-2', subtitle ? 'mb-4' : 'mb-12')}>{title}</h1>
                {subtitle && <p className="text-body text-text-muted mb-12">{subtitle}</p>}
                {children}
            </div>
        </div>
    );
}
