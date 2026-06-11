import type { ReactNode } from 'react';
import { OwAccordion } from '@/components/owui/ow-accordion';

export function PersonaIntro({intro}: {intro: ReactNode}) {
    return (
        <p className="ow-category-intro text-text-muted mb-8 max-w-2xl">{intro}</p>
    );
}

export type FAQ = {q: string; a: ReactNode; aText?: string};

export function PersonaFAQ({faqs}: {faqs: FAQ[]}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({q, a, aText}) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: {'@type': 'Answer', text: aText ?? (typeof a === 'string' ? a : '')},
        })),
    };

    const items = faqs.map(({q, a}, i) => ({
        value: String(i),
        trigger: q,
        content: a,
    }));

    const defaultValue = faqs.map((_, i) => String(i));

    return (
        <div className="ow-category-faq mt-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
            <h2 className="mb-3 heading-3">Câu hỏi thường gặp</h2>
            <OwAccordion items={items} type="multiple" defaultValue={defaultValue}/>
        </div>
    );
}
