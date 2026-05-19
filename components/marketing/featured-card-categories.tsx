import {CARD_CATEGORIES} from '@/lib/card-categories';

export function FeaturedCardCategories() {
    const daily = CARD_CATEGORIES.filter((c) => c.group === 'daily');
    const digital = CARD_CATEGORIES.filter((c) => c.group === 'digital');
    const business = CARD_CATEGORIES.filter((c) => c.group === 'business');

    return (
        <section className="ow-featured-card-categories ow-container lg:py-32 py-16 relative z-20">
            <h2>Danh mục thẻ nổi bật</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:mt-10 mt-6">
                <div className="bg-white md:rounded-xl rounded-lg p-6 flex flex-col gap-3">
                    <h3>Tiêu dùng hàng ngày</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {daily.map((cat) => (
                            <li key={cat.slug}>
                                <a href={cat.href}>{cat.name} ({cat.description})</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-4">
                    {digital.map((cat) => (
                        <div key={cat.slug} className="md:rounded-xl rounded-lg p-6 flex flex-col gap-3 flex-1 bg-primary text-white">
                            <h3>{cat.name}</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li><a href={cat.href}>{cat.name} ({cat.description})</a></li>
                            </ul>
                        </div>
                    ))}
                    {business.map((cat) => (
                        <div key={cat.slug} className="bg-black text-white md:rounded-xl rounded-lg p-6 flex flex-col gap-3 flex-1">
                            <h3>{cat.name}</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li><a href={cat.href}>{cat.name}</a></li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
