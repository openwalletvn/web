import {cn} from '@/lib/utils';

interface Props {
    title?: string;
    children: React.ReactNode;
    className?: string;
    titleClassName?: string;
}

export function CardDetailSection({title, children, className, titleClassName}: Props) {
    return (
        <section className={cn('ow-card-detail-section flex flex-col gap-3', className)}>
            {title && <h2 className={cn('text-label', titleClassName)}>{title}</h2>}
            {children}
        </section>
    );
}
