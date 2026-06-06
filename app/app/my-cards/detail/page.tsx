'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconArrowLeft } from '@tabler/icons-react';
import { type Bank, type Card, getBank, getCard } from '@/lib/api';
import { CardDetailForm } from '@/components/wallet/card-detail-form';
import { PageContainer } from '@/components/ui/page-container';
import { useWalletDb } from '@/providers/wallet-db-provider';
import type { CreditAccount } from '@/lib/db';

export default function CardDetailPage() {
 const searchParams = useSearchParams();
 const id = searchParams.get('id') ?? '';
 const router = useRouter();
 const db = useWalletDb();

 // Use null-coercion so useLiveQuery can distinguish"loading" (undefined) from"not found" (null)
 const walletCard = useLiveQuery(
 () => db.walletCards.get(id).then((c) => c ?? null),
 [db, id],
 );
 const creditAccount = useLiveQuery<CreditAccount | undefined>(
 () =>
 walletCard?.creditAccountId
 ? db.creditAccounts.get(walletCard.creditAccountId)
 : Promise.resolve(undefined),
 [db, walletCard?.creditAccountId],
 );

 const [catalogCard, setCatalogCard] = useState<Card | null>(null);
 const [bank, setBank] = useState<Bank | null>(null);

 useEffect(() => {
 if (!walletCard) return;
 getCard(walletCard.cardId).then(setCatalogCard).catch(() => null);
 getBank(walletCard.bankId).then(setBank).catch(() => null);
 }, [walletCard?.cardId, walletCard?.bankId]);

 // Loading: walletCard still fetching, or API data not yet loaded
 const isLoading = walletCard === undefined || (walletCard !== null && !catalogCard);

 if (isLoading) {
 return (
 <PageContainer maxWidth="4xl">
 <div className="animate-pulse space-y-6">
 <div className="h-4 w-20 bg-slate-100 rounded" />
 <div className="h-6 w-48 bg-slate-100 rounded" />
 <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8">
 <div className="space-y-4">
 <div className="aspect-[16/10] bg-slate-100 rounded-sm" />
 <div className="border border-dashed border-slate-200 rounded-sm p-4 space-y-3">
 {[1, 2, 3, 4].map((i) => (
 <div key={i} className="flex justify-between">
 <div className="h-3 w-20 bg-slate-100 rounded" />
 <div className="h-3 w-28 bg-slate-100 rounded" />
 </div>
 ))}
 </div>
 </div>
 <div className="space-y-4">
 {[1, 2, 3, 4, 5].map((i) => (
 <div key={i} className="h-10 bg-slate-100 rounded-sm" />
 ))}
 </div>
 </div>
 </div>
 </PageContainer>
 );
 }

 if (walletCard === null) {
 return (
 <PageContainer maxWidth="4xl">
 <p className="text-slate-500 mb-2">Không tìm thấy thẻ.</p>
 <Link href="/app/my-cards" className="text-brand-blue hover:underline">
 ← Ví của tôi
 </Link>
 </PageContainer>
 );
 }

 const cardTitle = walletCard.nickname ?? catalogCard?.name ?? walletCard.cardId;

 return (
 <PageContainer maxWidth="4xl">
 {/* Back */}
 <Link
 href="/app/my-cards"
 className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 mb-6 transition-colors text-sm"
 >
 <IconArrowLeft size={15} />
 Ví của tôi
 </Link>

 {/* Header */}
 <div className="flex items-baseline justify-between mb-2">
 <h1 className="">{cardTitle}</h1>
 </div>
 <div className="border-t border-dashed border-slate-200 mb-6" />

 {/* Two-column form - key forces remount when credit account loads */}
 {catalogCard && (
 <CardDetailForm
 key={`${walletCard.id}-${creditAccount?.id ?? 'nc'}`}
 card={catalogCard}
 bank={bank}
 walletCard={walletCard}
 creditAccount={creditAccount}
 onSaved={() => {}}
 onDeleted={() => router.replace('/app/my-cards')}
 onMoved={() => router.replace('/app/my-cards')}
 />
 )}
 </PageContainer>
 );
}
