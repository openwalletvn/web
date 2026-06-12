import React from 'react';
import Link from 'next/link';
import {ROUTES} from '@/lib/routes';
import {fmtIsoDate} from '@/lib/utils';

export function OwPostCategoryDate({
    category,
    categorySlug,
    date,
    readingTime,
}: {
    category: string;
    categorySlug: string;
    date?: string;
    readingTime?: string;
}) {
    const items: (string | React.ReactNode)[] = [
        <Link
            key="category"
            href={ROUTES.blogCategory(categorySlug)}
            className="text-label hover:underline"
        >
            {category}
        </Link>,
    ];

    if (date) items.push(fmtIsoDate(date));
    if (readingTime) items.push(readingTime);

    return (
        <div className="ow-post-category-date flex items-center gap-2 text-xs text-text-muted">
            {items.map((item, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <span>·</span>}
                    <span>{item}</span>
                </React.Fragment>
            ))}
        </div>
    );
}
