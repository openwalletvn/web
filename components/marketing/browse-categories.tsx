import {CARD_CATEGORIES} from '@/lib/card-categories';

export function BrowsePersonas({excludeHref}: { excludeHref?: string }) {
    const categories = CARD_CATEGORIES.filter((c) => c.href !== excludeHref);

    return (
        <section className="ow-browse-categories py-12">
            <h2 className="mb-6 text-card-heading">Khám phá danh mục thẻ khác</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                    <a
                        key={cat.slug}
                        href={cat.href}
                        className="bg-white rounded-lg p-4 flex flex-col gap-1 hover:shadow-md border transition-shadow"
                    >
                        <span className="font-semibold text-sm">{cat.name}</span>
                        <span className="text-text-muted text-xs">{cat.description}</span>
                    </a>
                ))}
            </div>
        </section>
    );
}
