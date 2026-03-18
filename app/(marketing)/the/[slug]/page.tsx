import type { Metadata } from 'next';
import Link from 'next/link';
import { getCard, getCards, getBank } from '@/lib/api';
import { CardImage } from '@/components/cards/card-image';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { buildCardPageMeta } from '@/lib/page-meta/card';
import { AddToWalletButton } from './_add-to-wallet-button';
import { CardDetailHeader } from '@/components/cards/detail/card-detail-header';
import { CardDetailBillingCycle } from '@/components/cards/detail/card-detail-billing-cycle';
import { CardDetailFees } from '@/components/cards/detail/card-detail-fees';
import { CardDetailOtherFees } from '@/components/cards/detail/card-detail-other-fees';
import { CardDetailSources } from '@/components/cards/detail/card-detail-sources';
import { CardDetailLastModified } from '@/components/cards/detail/card-detail-last-modified';
import { CardDetailRelated } from '@/components/cards/detail/card-detail-related';

export async function generateStaticParams() {
    const cards = await getCards();
    return cards.map((card) => ({ slug: card.id }));
}

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const card = await getCard(slug);
        const bank = await getBank(card.bank_id).catch(() => null);
        const { metadata } = buildCardPageMeta(card, bank);
        return metadata;
    } catch {
        return { title: 'Không tìm thấy | Open Wallet' };
    }
}

export default async function CardPage({ params }: Props) {
    const { slug } = await params;

    let card;
    try {
        card = await getCard(slug);
    } catch {
        return (
            <div className="flex items-center justify-center py-32 px-4">
                <div className="text-center">
                    <p className="text-2xl font-semibold text-slate-900 mb-4">Không tìm thấy thẻ này</p>
                    <Link href="/the" className="text-brand-red hover:underline">Quay lại danh sách thẻ</Link>
                </div>
            </div>
        );
    }

    const [bank, relatedCards] = await Promise.all([
        getBank(card.bank_id).catch(() => null),
        getCards({ bank_id: card.bank_id }).catch(() => []),
    ]);

    const { jsonLd, breadcrumbItems } = buildCardPageMeta(card, bank);
    const isVertical = card.image?.orientation === 'vertical';

    const sameTypeCards = relatedCards.filter(
        (c) => c.id !== card.id && c.card_type.some((t) => card.card_type.includes(t)),
    );

    return (
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <Breadcrumbs items={breadcrumbItems} />

                <div className="mt-8 flex flex-col lg:flex-row gap-10 items-start">
                    {/* Left column: sticky */}
                    <div className={`shrink-0 w-full ${isVertical ? 'lg:w-48' : 'lg:w-72'} lg:sticky lg:top-8`}>
                        <CardImage card={card} tilt />
                        <div className="mt-4 flex flex-col gap-2">
                            {/*<AddToWalletButton card={card} />*/}
                            {process.env.NODE_ENV === 'development' && (
                                <a
                                    href={`http://localhost:3004/#/cards/${card.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center px-4 py-2 border border-dashed border-orange-300 bg-orange-50 text-orange-700 rounded-sm hover:border-orange-400 hover:bg-orange-100 transition-colors text-sm font-medium w-full"
                                >
                                    ✏ Edit
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right column: scrollable sections */}
                    <div className="flex-1 flex flex-col gap-8 min-w-0">
                        <CardDetailHeader card={card} bank={bank} />
                        {card.description && (
                            <section className="flex flex-col gap-4">
                                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Về thẻ này</h2>
                                {card.description.split('\n\n').map((para, i) => (
                                    <p key={i} className="text-sm text-slate-800">{para}</p>
                                ))}
                            </section>
                        )}
                        <CardDetailBillingCycle card={card} bank={bank} />
                        <CardDetailFees card={card} bank={bank} />
                        <CardDetailOtherFees card={card} bank={bank} />
                        <CardDetailSources card={card} bank={bank} />
                        <CardDetailLastModified card={card} bank={bank} />
                    </div>
                </div>

                <CardDetailRelated cards={sameTypeCards} currentCardId={card.id} />
            </div>
        </div>
    );
}
