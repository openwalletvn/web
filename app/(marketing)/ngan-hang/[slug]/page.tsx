import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {cn} from '@/lib/utils';
import {getBank, getBanks, getCards} from '@/lib/api';
import {BankModel} from '@/lib/bank-model';
import {ChatContextSetter} from '@/components/chat/chat-context-setter';
import {CardsGrid} from '@/components/cards/cards-grid';
import {NetworkDistributionBar} from '@/components/shared/network-distribution-bar';
import {buildBankPageMeta} from '@/lib/page-meta/bank';
import {buildTitle, SECTION_TITLES} from '@/lib/page-meta/title';
import {MarketingPageShell} from '@/components/layout/marketing-page-shell';

export const revalidate = 3600;

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
        return {title: buildTitle('Không Tìm Thấy', SECTION_TITLES.banks)};
    }
}

export default async function BankPage({params}: Props) {
    const {slug} = await params;

    let bank: BankModel;
    try {
        bank = new BankModel(await getBank(slug));
    } catch {
        return (
            <MarketingPageShell title="Không tìm thấy" breadcrumbItems={[{label: 'Trang chủ', href: '/'}, {label: 'Ngân hàng', href: '/ngan-hang'}, {label: 'Không tìm thấy'}]}>
                <p className="heading-3 mb-4">Không tìm thấy ngân hàng</p>
                <Link href="/ngan-hang" className="text-brand-red hover:underline">← Quay lại Ngân hàng</Link>
            </MarketingPageShell>
        );
    }

    const [cards, banks] = await Promise.all([
        getCards({bank_id: slug}).catch(() => [] as Awaited<ReturnType<typeof getCards>>),
        getBanks().catch(() => [] as Awaited<ReturnType<typeof getBanks>>),
    ]);

    const {jsonLd, breadcrumbItems} = buildBankPageMeta(bank.toRaw(), cards);

    const hybridCards = cards.filter((c) => c.card_type.includes('hybrid'));
    const hybridIds = new Set(hybridCards.map((c) => c.id));
    const creditCards = cards.filter((c) => c.card_type.includes('credit') && !hybridIds.has(c.id));
    const debitCards = cards.filter((c) => c.card_type.includes('debit') && !hybridIds.has(c.id));
    const cobrandCards = cards.filter((c) => c.co_brand && c.co_brand !== '');
    const businessCards = cards.filter((c) => c.for_business === true);

    return (
        <>
        <MarketingPageShell breadcrumbItems={breadcrumbItems} jsonLd={jsonLd}>
            <div className="space-y-16">

                {/* Bank Identity */}
                <div className="flex items-start gap-12">
                    <div className="relative w-56 aspect-video shrink-0">
                        <Image src={bank.getLogoUrl()} alt="" fill className="object-contain"/>
                    </div>

                    <div className="flex-1">
                        <h1>{bank.getName()}</h1>
                        <p className="text-text-muted mt-1">{bank.getFullName()}</p>
                        {bank.hasLink() && (
                            <a
                                href={bank.getLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-3 text-body-sm text-text-subtle hover:text-text-primary"
                            >
                                {bank.getLinkHostname()} ↗
                            </a>
                        )}
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Network Distribution */}
                    {bank.getStats()?.network_counts && bank.getNetworksData().length > 0 && (
                        <NetworkDistributionBar
                            networkCounts={bank.getStats()!.network_counts!}
                            networksData={bank.getNetworksData()}
                            totalCards={bank.getCardCount()}
                        />
                    )}

                    {/* Stats Row */}
                    {(() => {
                        const maxFee = bank.getStats()?.max_annual_fee;
                        const statsItems: { label: string; value: string }[] = [
                            {label: 'Tổng số thẻ', value: String(cards.length)},
                            ...(creditCards.length > 0 ? [{label: 'Tín dụng', value: String(creditCards.length)}] : []),
                            ...(debitCards.length > 0 ? [{label: 'Ghi nợ', value: String(debitCards.length)}] : []),
                            ...(hybridCards.length > 0 ? [{label: 'Hybrid', value: String(hybridCards.length)}] : []),
                            ...(maxFee && maxFee > 0
                                ? [{label: 'Phí thường niên tối đa', value: `${maxFee.toLocaleString('vi-VN')}đ`}]
                                : []),
                        ];
                        const gridClass = statsItems.length <= 3 ? `grid-cols-${statsItems.length}` : 'grid-cols-2 sm:grid-cols-4';
                        return (
                            <div className={cn('grid', gridClass, 'gap-3')}>
                                {statsItems.map(({label, value}) => (
                                    <div key={label} className="border border-zinc-200 rounded-xl px-4 py-4 text-center">
                                        <p className="heading-3">{value}</p>
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

                {hybridCards.length > 0 && (
                    <CardsGrid cards={hybridCards} banks={banks} title={`Thẻ hybrid (${hybridCards.length})`}/>
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
        </MarketingPageShell>
        <ChatContextSetter context={{
            type: 'bank',
            bankId: bank.getId(),
            bankName: bank.getName(),
        }} />
        </>
    );
}
