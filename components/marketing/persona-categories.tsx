import {PersonaModel} from '@/lib/persona-model';
import {OwButton} from '@/components/ow-ui/ow-button';

function CategoryLink({persona}: {persona: PersonaModel}) {
    if (!persona.isAvailable()) {
        return <span className="text-text-muted cursor-not-allowed">{persona.getName()} ({persona.getDescription()})</span>;
    }
    return <a href={persona.getHref()}>{persona.getName()} ({persona.getDescription()})</a>;
}

export function PersonaCategories() {
    const all = PersonaModel.all();
    const daily = all.filter((p) => p.getGroup() === 'daily');
    const digital = all.filter((p) => p.getGroup() === 'digital');
    const business = all.filter((p) => p.getGroup() === 'business');

    return (
        <section className="ow-persona-categories ow-container lg:py-32 py-16 relative z-20">
            <h2><a href="/linh-vuc">Lĩnh vực</a></h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:mt-10 mt-6">
                <div className="bg-white ow-rounded-small p-6 flex flex-col gap-3">
                    <h3>Tiêu dùng hàng ngày</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {daily.map((persona) => (
                            <li key={persona.getSlug()}>
                                <CategoryLink persona={persona}/>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    {digital.map((persona) => (
                        <div key={persona.getSlug()} className="ow-rounded-small p-6 flex flex-col gap-3 flex-1 bg-primary text-white">
                            <h3>{persona.getName()}</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li><CategoryLink persona={persona}/></li>
                            </ul>
                        </div>
                    ))}
                    {business.map((persona) => (
                        <div key={persona.getSlug()} className="bg-black text-white ow-rounded-small p-6 flex flex-col gap-3 flex-1">
                            <h3>{persona.getName()}</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li><CategoryLink persona={persona}/></li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center md:mt-10 mt-6">
                <OwButton asChild><a href="/linh-vuc">Xem tất cả thẻ theo nhu cầu</a></OwButton>
            </div>
        </section>
    );
}
