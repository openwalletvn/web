import {CARD_CATEGORIES, type CardCategory} from '@/lib/card-categories';
import {OwButton} from '@/components/ow-ui/ow-button';

function CategoryLink({cat}: {cat: CardCategory}) {
    if (cat.available === false) {
        return <span className="text-text-muted cursor-not-allowed">{cat.name} ({cat.description})</span>;
    }
    return <a href={cat.href}>{cat.name} ({cat.description})</a>;
}

export function PersonaCategories() {
    const daily = CARD_CATEGORIES.filter((c) => c.group === 'daily');
    const digital = CARD_CATEGORIES.filter((c) => c.group === 'digital');
    const business = CARD_CATEGORIES.filter((c) => c.group === 'business');

    return (
        <section className="ow-persona-categories ow-container lg:py-32 py-16 relative z-20">
            <h2><a href="/the-theo-nhu-cau">Thẻ theo nhu cầu</a></h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:mt-10 mt-6">
                <div className="bg-white md:rounded-xl rounded-lg p-6 flex flex-col gap-3">
                    <h3>Tiêu dùng hàng ngày</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {daily.map((cat) => (
                            <li key={cat.slug}>
                                <CategoryLink cat={cat}/>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    {digital.map((cat) => (
                        <div key={cat.slug} className="md:rounded-xl rounded-lg p-6 flex flex-col gap-3 flex-1 bg-primary text-white">
                            <h3>{cat.name}</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li><CategoryLink cat={cat}/></li>
                            </ul>
                        </div>
                    ))}
                    {business.map((cat) => (
                        <div key={cat.slug} className="bg-black text-white md:rounded-xl rounded-lg p-6 flex flex-col gap-3 flex-1">
                            <h3>{cat.name}</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li><CategoryLink cat={cat}/></li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center md:mt-10 mt-6">
                <OwButton asChild><a href="/the-theo-nhu-cau">Xem tất cả thẻ theo nhu cầu</a></OwButton>
            </div>
        </section>
    );
}
