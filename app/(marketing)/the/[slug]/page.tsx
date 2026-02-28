import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {getTranslations, getLocale} from 'next-intl/server';
import {Badge} from '@/components/ui/badge';
import {getBank, getBankImageUrl, getCard, getCards, getWalletImageUrl} from '@/lib/api';
import {MetalBadge} from '@/components/cards/metal-badge';
import {getFeeBucket} from '@/lib/fee-buckets';
import {CardImage} from '@/components/cards/card-image';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {AddToWalletButton} from './_add-to-wallet-button';
import {CoBrandDisplay} from '@/components/cards/co-brand-display';
import {buildCardPageMeta} from '@/lib/page-meta/card';

export async function generateStaticParams() {
    const cards = await getCards();
    return cards.map((card) => ({slug: card.id}));
}

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug} = await params;
    try {
        const card = await getCard(slug);
        const bank = await getBank(card.bank_id).catch(() => null);
        const {metadata} = buildCardPageMeta(card, bank);
        return metadata;
    } catch {
        return {title: 'Không tìm thấy | Open Wallet'};
    }
}

export default async function CardPage({params}: Props) {
    const {slug} = await params;
    const [t, locale] = await Promise.all([
        getTranslations('CardDetail'),
        getLocale(),
    ]);

    let card;
    try {
        card = await getCard(slug);
    } catch {
        return (
            <div className="flex items-center justify-center py-32 px-4">
                <div className="text-center">
                    <p className="text-2xl font-semibold text-slate-900 mb-4">{t('not_found')}</p>
                    <Link href="/the" className="text-brand-red hover:underline">{t('back')}</Link>
                </div>
            </div>
        );
    }

    const bank = await getBank(card.bank_id).catch(() => null);
    const isVertical = card.image_orientation === 'vertical';
    const {jsonLd, breadcrumbItems} = buildCardPageMeta(card, bank);

    return (
        <div className="px-4 py-12">
            <div className="max-w-container mx-auto">
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <Breadcrumbs items={breadcrumbItems}/>

                <div className="flex flex-col md:flex-row gap-10">
                    <div className={`shrink-0 ${isVertical ? 'md:w-48' : 'md:w-80'}`}>
                        <CardImage card={card}/>
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900">{card.name}</h1>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {card.status === 'discontinued' && (
                                            <Badge variant="outline" className="border-amber-400 text-amber-600 bg-amber-50">
                                                Dừng phát hành mới
                                            </Badge>
                                        )}
                                        <Badge variant="secondary"
                                               className="capitalize bg-brand-blue text-white border-transparent">{card.card_network}</Badge>
                                        {card.card_type.map((type) => (
                                            <Badge key={type} variant="outline" className="capitalize">{type}</Badge>
                                        ))}
                                        {card.card_tier && (
                                            <Badge variant="outline" className="capitalize">{card.card_tier}</Badge>
                                        )}
                                        {card.is_metal && <MetalBadge />}
                                    </div>
                                </div>
                                {process.env.NODE_ENV === 'development' && (
                                    <a
                                        href={`http://localhost:3003/edit-card.html?id=${card.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 px-3 py-1.5 text-xs border border-dashed border-orange-300 bg-orange-50 text-orange-700 rounded-sm hover:border-orange-400 hover:bg-orange-100 transition-colors font-medium"
                                    >
                                        Edit ✏️
                                    </a>
                                )}
                            </div>
                        </div>

                        <AddToWalletButton card={card}/>

                        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-base">
                            {card.annual_fee != null && (() => {
                                const feeBucket = card.annual_fee > 0 ? getFeeBucket(card.annual_fee) : null;
                                return (
                                    <>
                                        <dt className="text-slate-500">{t('annual_fee')}</dt>
                                        <dd className="font-medium">
                      <span className="text-slate-900">
                        {card.annual_fee === 0 ? t('free') : `${card.annual_fee.toLocaleString()} ${card.currency ?? ''}`}
                      </span>
                                            {feeBucket && (
                                                <Link href={`/the?fee=${feeBucket.value}&sort=fee_desc`}
                                                      className="block text-sm text-slate-400 hover:text-brand-blue underline underline-offset-2 transition-colors mt-0.5">
                                                    Xem thêm thẻ {feeBucket.label}
                                                </Link>
                                            )}
                                        </dd>
                                    </>
                                );
                            })()}
                            {card.interest_free_days !== undefined && (
                                <>
                                    <dt className="text-slate-500">{t('interest_free_days')}</dt>
                                    <dd className="text-slate-900 font-medium">{t('days', {count: card.interest_free_days})}</dd>
                                </>
                            )}
                            {card.statement_date !== undefined && (
                                <>
                                    <dt className="text-slate-500">{t('statement_date')}</dt>
                                    <dd className="text-slate-900 font-medium">{t('statement_date_value', {day: card.statement_date})}</dd>
                                </>
                            )}
                            {card.statement_date !== undefined && card.interest_free_days !== undefined && (() => {
                                const raw = (card.statement_date + card.interest_free_days) % 30;
                                const due = raw === 0 ? 30 : raw;
                                return (
                                    <>
                                        <dt className="text-slate-500">{t('payment_due_date')}</dt>
                                        <dd className="text-slate-900 font-medium">{t('statement_date_value', {day: due})}</dd>
                                    </>
                                );
                            })()}
                            {card.co_brand && (
                                <>
                                    <dt className="text-slate-500">{t('co_brand_label')}</dt>
                                    <dd>
                                        {card.co_brand_data
                                            ? <CoBrandDisplay brand={card.co_brand_data} fallback={card.co_brand}/>
                                            : <span className="text-slate-900 font-medium">{card.co_brand}</span>
                                        }
                                    </dd>
                                </>
                            )}
                        </dl>

                        {card.contactless_methods_data && card.contactless_methods_data.length > 0 && (
                            <div>
                                <h2 className="text-base font-semibold text-slate-700 mb-2">{t('contactless_methods')}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {card.contactless_methods_data.map((wallet) => (
                                        <div
                                            key={wallet.id}
                                            className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-200 rounded-sm"
                                        >
                                            <div className="relative w-6 h-6">
                                                <Image src={getWalletImageUrl(wallet.logo_url)} alt="" fill
                                                       className="object-contain"/>
                                            </div>
                                            <span className="text-sm text-slate-700">{wallet.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {card.card_link && (
                            <a href={card.card_link} target="_blank" rel="noopener noreferrer"
                               className="text-brand-red hover:underline text-base">
                                {t('view_details')}
                            </a>
                        )}

                        {bank && (
                            <Link
                                href={`/ngan-hang/${bank.id}`}
                                className="flex items-center gap-3 p-3 border border-dashed border-slate-200 rounded-sm hover:border-slate-400 hover:bg-slate-50/60 transition-colors w-fit"
                            >
                                <div className="relative w-8 h-8">
                                    <Image src={getBankImageUrl(bank.logo_url)} alt="" fill className="object-contain"/>
                                </div>
                                <span className="text-base font-medium text-slate-800">{bank.name}</span>
                            </Link>
                        )}

                        {card.last_modified && (
                            <p className="text-xs text-slate-500 mt-4">
                                {t('last_updated')}: {new Date(card.last_modified).toLocaleDateString(locale, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
