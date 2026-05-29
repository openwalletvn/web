import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {cn} from '@/lib/utils';
import {getBank, getBankImageUrl, getBanks, getCards} from '@/lib/api';
import {ChatContextSetter} from '@/components/chat/chat-context-setter';
import {Breadcrumbs} from '@/components/layout/breadcrumbs';
import {CardsGrid} from '@/components/cards/cards-grid';
import {NetworkDistributionBar} from '@/components/shared/network-distribution-bar';
import {buildBankPageMeta} from '@/lib/page-meta/bank';

export async function generateStaticParams() {
    try {
        const banks = await getBanks();
        return banks.map((bank) => ({slug: bank.id}));
    } catch {
        return [];
    }
}

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const {slug} = await params;
    try {
        const [bank, cards] = await Promise.all([
            getBank(slug),
            getCards({bank_id: slug}),
        ]);
        const {metadata} = buildBankPageMeta(bank, cards);
        return metadata;
    } catch {
        return {title: 'Không tìm thấy | OpenWallet'};
    }
}

export default async function BankPage({params}: Props) {
    const {slug} = await params;

    let bank;
    try {
        bank = await getBank(slug);
    } catch {
        return (
            <div className="flex items-center justify-center py-32 px-4">
                <div className="text-center">
                    <p className="text-card-heading mb-4">Không tìm thấy ngân hàng</p>
                    <Link href="/ngan-hang" className="text-brand-red hover:underline">← Quay lại Ngân hàng</Link>
                </div>
            </div>
        );
    }

    const [cards, banks] = await Promise.all([
        getCards({bank_id: slug}).catch(() => [] as Awaited<ReturnType<typeof getCards>>),
        getBanks().catch(() => [] as Awaited<ReturnType<typeof getBanks>>),
    ]);

    const {jsonLd, breadcrumbItems} = buildBankPageMeta(bank, cards);

    const creditCards = cards.filter((c) => c.card_type.includes('credit'));
    const debitCards = cards.filter((c) => c.card_type.includes('debit'));
    const cobrandCards = cards.filter((c) => c.co_brand && c.co_brand !== '');
    const businessCards = cards.filter((c) => c.for_business === true);

    return (
        <>
        <div className="px-4 py-12">
            <div className="ow-container space-y-16">
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
                <Breadcrumbs items={breadcrumbItems}/>

                {/* Bank Identity */}
                <div className="flex items-start gap-12">
                    <div className="relative w-56 aspect-video shrink-0">
                        <Image src={getBankImageUrl(bank.logo_url)} alt="" fill className="object-contain"/>
                    </div>

                    <div className="flex-1">
                        <h1>{bank.name}</h1>
                        <p className="text-text-muted mt-1">{bank.full_name}</p>
                        {bank.link && (
                            <a
                                href={bank.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-3 text-body-sm text-text-subtle hover:text-text-primary"
                            >
                                {new URL(bank.link).hostname} ↗
                            </a>
                        )}
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Network Distribution */}
                    {bank.stats?.network_counts && bank.networks_data && (
                        <NetworkDistributionBar
                            networkCounts={bank.stats.network_counts}
                            networksData={bank.networks_data}
                            totalCards={bank.stats.card_count ?? 0}
                        />
                    )}

                    {/* Stats Row */}
                    {(() => {
                        const maxFee = bank.stats?.max_annual_fee;
                        const statsItems: { label: string; value: string }[] = [
                            {label: 'Tổng số thẻ', value: String(cards.length)},
                            {label: 'Tín dụng', value: String(creditCards.length)},
                            {label: 'Ghi nợ', value: String(debitCards.length)},
                            ...(maxFee && maxFee > 0
                                ? [{label: 'Phí thường niên tối đa', value: `${maxFee.toLocaleString('vi-VN')}đ`}]
                                : []),
                        ];
                        const gridClass = statsItems.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3';
                        return (
                            <div className={cn('grid', gridClass, 'gap-3')}>
                                {statsItems.map(({label, value}) => (
                                    <div key={label} className="border border-zinc-200 rounded-xl px-4 py-4 text-center">
                                        <p className="text-card-heading">{value}</p>
                                        <p className="text-body-sm text-text-muted mt-1">{label}</p>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>

                {/* Card Sections */}
                {creditCards.length > 0 && (
                    <CardsGrid cards={creditCards} banks={banks} title={`Thẻ tín dụng (${creditCards.length})`}/>
                )}

                {debitCards.length > 0 && (
                    <CardsGrid cards={debitCards} banks={banks} title={`Thẻ ghi nợ (${debitCards.length})`}/>
                )}

                {cobrandCards.length > 0 && (
                    <CardsGrid cards={cobrandCards} banks={banks}
                               title={`Thẻ đồng thương hiệu (${cobrandCards.length})`}/>
                )}

                {businessCards.length > 0 && (
                    <CardsGrid cards={businessCards} banks={banks}
                               title={`Thẻ doanh nghiệp (${businessCards.length})`}/>
                )}
            </div>
        </div>
        <ChatContextSetter context={{
            type: 'bank',
            bankId: bank.id,
            bankName: bank.name,
        }} />
        </>
    );
}
