export function PersonaIntro({intro}: {intro: string}) {
    return (
        <p className="ow-category-intro text-text-muted mb-8 max-w-2xl">{intro}</p>
    );
}

export type FAQ = {q: string; a: string};

export function PersonaFAQ({faqs}: {faqs: FAQ[]}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({q, a}) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: {'@type': 'Answer', text: a},
        })),
    };

    return (
        <div className="ow-category-faq mt-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
            <h2 className="mb-4">Câu hỏi thường gặp</h2>
            <div className="divide-y divide-border">
                {faqs.map(({q, a}, i) => (
                    <details key={i} className="group py-4">
                        <summary className="cursor-pointer list-none flex justify-between items-start gap-4 font-medium">
                            <span>{q}</span>
                            <span className="shrink-0 text-text-muted group-open:rotate-180 transition-transform">↓</span>
                        </summary>
                        <p className="mt-3 text-text-muted">{a}</p>
                    </details>
                ))}
            </div>
        </div>
    );
}
