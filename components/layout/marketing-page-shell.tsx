import React from 'react';
import {Breadcrumbs, BreadcrumbSegment} from '@/components/layout/breadcrumbs';

export function MarketingPageShell({
    title,
    description,
    breadcrumbItems,
    jsonLd,
    children,
}: {
    title?: React.ReactNode;
    description?: string;
    breadcrumbItems: BreadcrumbSegment[];
    jsonLd?: object;
    children: React.ReactNode;
}) {
    return (
        <div className="ow-marketing-page-shell ow-container md:pt-12 md:pb-24 pt-8 pb-12">
            {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>}
            <Breadcrumbs items={breadcrumbItems}/>
            {title && <h1 className="mb-2">{title}</h1>}
            {description && <p className="text-text-muted mb-8">{description}</p>}
            {children}
        </div>
    );
}
