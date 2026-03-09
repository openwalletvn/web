import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {getTranslations, getLocale} from 'next-intl/server';
import {Badge} from '@/components/ui/badge';
import {getBank, getBankImageUrl, getCard, getCards, getWalletImageUrl} from '@/lib/api';
import {MetalBadge} from '@/components/cards/metal-badge';
import {CardImage} from '@/components/cards/card-image';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {AddToWalletButton} from './_add-to-wallet-button';
import {CoBrandDisplay} from '@/components/cards/co-brand-display';
import {buildCardPageMeta} from '@/lib/page-meta/card';
import {getRelatedStatements} from '@/lib/card-dates';

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
    const isVertical = card.image?.orientation === 'vertical';
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
                                const today = new Date();
                                const tod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                const nextDue = getRelatedStatements(tod, card.statement_date, card.interest_free_days).find((s) => s.due >= tod)?.due ?? null;
                                const due = nextDue?.getDate() ?? null;
                                if (due == null) return null;
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

                        {card.fees && Object.keys(card.fees).length > 0 && (() => {
                            const FEE_LABELS: Record<string, string> = {
                                annual: 'Phí thường niên',
                                annual_supplementary: 'Phí thường niên thẻ phụ',
                                issuance: 'Phí phát hành',
                                cancellation: 'Phí huỷ thẻ',
                                foreign: 'Phí giao dịch ngoại tệ',
                                foreign_dcc: 'Phí giao dịch ngoại tệ (DCC)',
                            };
                            const entries = (Object.keys(FEE_LABELS) as (keyof typeof FEE_LABELS)[])
                                .filter((k) => card.fees![k as keyof typeof card.fees] != null)
                                .map((k) => ({ key: k, label: FEE_LABELS[k], entry: card.fees![k as keyof typeof card.fees]! }));
                            if (entries.length === 0) return null;
                            return (
                                <div>
                                    <h2 className="text-base font-semibold text-slate-700 mb-2">Biểu phí</h2>
                                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-base">
                                        {entries.map(({ key, label, entry }) => (
                                            <>
                                                <dt key={`${key}-dt`} className="text-slate-500">{label}</dt>
                                                <dd key={`${key}-dd`} className="font-medium">
                                                    {entry.type === 'currency' ? (
                                                        entry.amount === 0
                                                            ? <span className="text-green-600">Miễn phí</span>
                                                            : <span className="text-slate-900">{entry.amount.toLocaleString('vi-VN')}đ</span>
                                                    ) : (
                                                        <span className="text-slate-900">{entry.amount}%</span>
                                                    )}
                                                    {entry.note && (
                                                        <span className="block text-sm text-slate-400 mt-0.5">{entry.note}</span>
                                                    )}
                                                </dd>
                                            </>
                                        ))}
                                        {card.sources && card.sources.length > 0 && (
                                            <>
                                                <dt className="text-slate-500">Nguồn</dt>
                                                <dd className="flex flex-col gap-0.5">
                                                    {card.sources.map((src, i) => (
                                                        <a
                                                            key={i}
                                                            href={src.page != null ? `${src.url}#page=${src.page}` : src.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-brand-blue hover:underline"
                                                        >
                                                            {src.label}
                                                        </a>
                                                    ))}
                                                </dd>
                                            </>
                                        )}
                                    </dl>
                                </div>
                            );
                        })()}

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
