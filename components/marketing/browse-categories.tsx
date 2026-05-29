import {CARD_CATEGORIES} from '@/lib/card-categories';

export function BrowsePersonas({currentHref}: { currentHref?: string }) {
    return (
        <section className="ow-browse-categories py-12">
            <h2 className="mb-6 heading-3">Khám phá danh mục thẻ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {CARD_CATEGORIES.map((cat) => {
                    const isCurrent = cat.href === currentHref;
                    return (
                        <a
                            key={cat.slug}
                            href={cat.href}
                            aria-current={isCurrent ? 'page' : undefined}
                            className={`rounded-lg p-4 flex flex-col gap-1 hover:shadow-md border transition-shadow ${isCurrent ? 'bg-primary/10 border-primary font-bold' : 'bg-white'}`}
                        >
                            <span className="font-semibold text-sm">{cat.name}</span>
                            <span className="text-text-muted text-xs">{cat.description}</span>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
