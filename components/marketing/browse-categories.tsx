import {PersonaModel} from '@/lib/persona-model';

export function BrowsePersonas({currentHref}: { currentHref?: string }) {
    return (
        <section className="ow-browse-categories py-12">
            <h2 className="mb-6 heading-3">Khám phá danh mục thẻ</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {PersonaModel.all().map((persona) => {
                    const isCurrent = persona.getHref() === currentHref;
                    return (
                        <a
                            key={persona.getSlug()}
                            href={persona.getHref()}
                            aria-current={isCurrent ? 'page' : undefined}
                            className={`rounded-2xl p-4 flex flex-col gap-1 hover:shadow-md border transition-shadow ${isCurrent ? 'bg-primary/10 border-primary font-bold' : 'bg-white'}`}
                        >
                            <span className="font-semibold text-sm">{persona.getName()}</span>
                            <span className="text-text-muted text-xs">{persona.getDescription()}</span>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
