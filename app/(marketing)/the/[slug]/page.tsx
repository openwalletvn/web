import type {Metadata} from 'next';
import Link from 'next/link';
import {cn} from '@/lib/utils';
import {getBank, getCard, getCards, getRelatedCards} from '@/lib/api';
import {CardModel} from '@/lib/card-model';
import {ChatContextSetter} from '@/components/chat/chat-context-setter';
import {OwCardImage} from '@/components/ow-ui/ow-card-image';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {buildCardPageMeta} from '@/lib/page-meta/card';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';
import {CardDetailHeader} from '@/components/cards/detail/card-detail-header';
import {CardDetailBillingCycle} from '@/components/cards/detail/card-detail-billing-cycle';
import {CardDetailFees} from '@/components/cards/detail/card-detail-fees';
import {CardDetailOtherFees} from '@/components/cards/detail/card-detail-other-fees';
import {CardDetailSources} from '@/components/cards/detail/card-detail-sources';
import {CardDetailLastModified} from '@/components/cards/detail/card-detail-last-modified';
import {CardDetailRelated} from '@/components/cards/detail/card-detail-related';
import {CardDetailCompare} from '@/components/cards/detail/card-detail-compare';
import {CardDetailCashback} from '@/components/cards/detail/card-detail-cashback';
import {CardDetailIntents} from '@/components/cards/detail/card-detail-intents';
import {CompareButton} from '@/components/compare/compare-button';

export async function generateStaticParams() {
    try {
        const cards = await getCards();
        return cards.map((card) => ({ slug: card.id }));
    } catch {
        return [];
    }
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
        return { title: buildTitle('Không Tìm Thấy', SECTION_TITLES.cards) };
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
                    <p className="heading-3 mb-4">Không tìm thấy thẻ này</p>
                    <Link href="/the" className="text-brand-red hover:underline">Quay lại danh sách thẻ</Link>
                </div>
            </div>
        );
    }

    const [bank, relatedCards, compareCards] = await Promise.all([
        getBank(card.bank_id).catch(() => null),
        getCards({ bank_id: card.bank_id }).catch(() => []),
        getRelatedCards(card.id).catch(() => []),
    ]);

    const cardModel = new CardModel(card);
    const { jsonLd, breadcrumbItems } = buildCardPageMeta(card, bank);
    const isVertical = card.image?.orientation === 'vertical';

    const sameTypeCards = relatedCards.filter(
        (c) => c.id !== card.id && c.card_type.some((t) => card.card_type.includes(t)),
    );

    return (
        <>
            <div className="ow-marketing-page-shell ow-container md:pt-12 md:pb-24 pt-8 pb-12">
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <Breadcrumbs items={breadcrumbItems} />

                <div className="mt-8 grid grid-cols-12 xl:gap-8 gap-6">
                    {/* Left column: sticky */}
                    <div
                        className={cn(isVertical ? 'xl:col-span-2 md:col-span-3 col-span-12' : 'xl:col-span-3 md:col-span-4 col-span-12')}>
                        <div className={cn("lg:sticky lg:top-8", isVertical ? "sm:max-w-[300px] max-w-[240px] mx-auto" : "max-w-[360px]")}>
                            <OwCardImage card={card} tilt priority/>
                            <div className="mt-4 flex flex-col gap-2">
                                <CompareButton
                                    card={{id: card.id, name: card.name, image_url: card.image?.url ?? null}}/>
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
                    </div>

                    {/* Right column: scrollable sections */}
                    <div
                        className={cn(isVertical ? 'xl:col-span-10 md:col-span-9 col-span-12' : 'xl:col-span-9 md:col-span-8 col-span-12', "flex flex-col gap-8 min-w-0")}>
                        <CardDetailHeader card={cardModel} bank={bank} />
                        {card.description && (
                            <section className="flex flex-col gap-4">
                                <h2 className="text-label text-text-muted">Về thẻ này</h2>
                                {card.description.split('\n\n').map((para, i) => (
                                    <p key={i} className="text-body-sm text-text-primary">{para}</p>
                                ))}
                            </section>
                        )}
                        <CardDetailBillingCycle card={card} bank={bank} />
                        <CardDetailFees card={cardModel} bank={bank} />
                        <CardDetailOtherFees card={cardModel} bank={bank} />
                        <CardDetailIntents card={cardModel} />
                        <CardDetailCashback card={cardModel}/>
                        <CardDetailSources card={cardModel} bank={bank} />
                        <CardDetailLastModified card={cardModel} bank={bank} />
                    </div>
                </div>

                <CardDetailCompare
                    currentCard={card}
                    compareCards={compareCards}
                />
                <CardDetailRelated cards={sameTypeCards} currentCardId={card.id} />
            </div>
        <ChatContextSetter context={{
            type: 'card',
            cardId: card.id,
            cardName: card.name,
            bankId: card.bank_id,
            cardNetwork: card.card_network,
            cardType: card.card_type,
            description: card.description,
        }} />
        </>
    );
}
