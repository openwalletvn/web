import {Breadcrumbs, BreadcrumbSegment} from '@/components/layout/breadcrumbs';

export function BlogPageShell({
    title,
    description,
    breadcrumbItems,
    jsonLd,
    children,
}: {
    title: React.ReactNode;
    description?: string;
    breadcrumbItems: BreadcrumbSegment[];
    jsonLd?: object;
    children: React.ReactNode;
}) {
    return (
        <div className="ow-blog-page-shell ow-container md:pt-16 md:pb-32 pt-8 pb-14">
            {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>}
            <Breadcrumbs items={breadcrumbItems}/>
            <h1 className="mb-1">{title}</h1>
            {description && <p className="text-text-muted mb-8">{description}</p>}
            {children}
        </div>
    );
}
