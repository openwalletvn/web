import React from 'react';
import {Breadcrumbs, BreadcrumbSegment} from '@/components/layout/breadcrumbs';

export function MarketingPageShell({
    title,
    description,
    breadcrumbItems,
    jsonLd,
    hideHeader,
    className,
    children,
}: {
    title?: React.ReactNode;
    description?: string;
    breadcrumbItems: BreadcrumbSegment[];
    jsonLd?: object;
    hideHeader?: boolean;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={`ow-marketing-page-shell ow-container md:pt-12 md:pb-24 pt-8 pb-12${className ? ` ${className}` : ''}`}>
            {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>}
            <Breadcrumbs items={breadcrumbItems}/>
            {!hideHeader && title && <h1 className="mb-2">{title}</h1>}
            {!hideHeader && description && <p className="text-text-muted mb-8">{description}</p>}
            {children}
        </div>
    );
}
