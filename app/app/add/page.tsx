'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { getBanks, getCards, getCard, type Bank, type Card } from '@/lib/api';
import { CardDetailForm } from '@/components/wallet/card-detail-form';
import { PageContainer } from '@/components/ui/page-container';
import { BankSelectionStep } from '@/components/wallet/add/bank-selection-step';
import { CardSelectionStep } from '@/components/wallet/add/card-selection-step';
import { useWalletDb } from '@/providers/wallet-db-provider';
import { getMyCardUrl } from '@/lib/routes';
import { useLiveQuery } from 'dexie-react-hooks';
import posthog from 'posthog-js';

export default function AddCardPage() {
 const router = useRouter();
 const db = useWalletDb();

 const [step, setStep] = useState<1 | 2 | 3>(1);
 const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
 const [selectedCard, setSelectedCard] = useState<Card | null>(null);
 const [deepLinked, setDeepLinked] = useState(false);

 const [banks, setBanks] = useState<Bank[]>([]);
 const [bankCards, setBankCards] = useState<Card[]>([]);
 const [banksLoading, setBanksLoading] = useState(false);
 const [cardsLoading, setCardsLoading] = useState(false);

 // Owned card IDs — used by CardSelectionStep to show"already in wallet" indicator.
 const walletCards = useLiveQuery(() => db.walletCards.toArray(), [db]);
 const ownedCardIds = useMemo(
 () => new Set((walletCards ?? []).map((c) => c.cardId)),
 [walletCards],
 );

 // Deep link: if ?card=[id] is present on mount, skip straight to step 3.
 useEffect(() => {
 const params = new URLSearchParams(window.location.search);
 const cardId = params.get('card');
 if (!cardId) return;
 setDeepLinked(true);
 getCard(cardId)
 .then((card) => {
 setSelectedCard(card);
 setSelectedBank(card.bank_data ?? null);
 setStep(3);
 })
 .catch(() => {
 // Silently fall through to step 1 if card not found.
 });
 }, []);

 useEffect(() => {
 setBanksLoading(true);
 getBanks().then(setBanks).finally(() => setBanksLoading(false));
 }, []);

 useEffect(() => {
 if (!selectedBank) return;
 setCardsLoading(true);
 getCards({ bank_id: selectedBank.id }).then(setBankCards).finally(() => setCardsLoading(false));
 }, [selectedBank]);

 function handleBack() {
 if (step === 1 || (step === 3 && deepLinked)) {
 router.back();
 } else if (step === 2) {
 setStep(1);
 setSelectedBank(null);
 setBankCards([]);
 } else {
 setStep(2);
 }
 }

 function selectBank(bank: Bank) {
 setSelectedBank(bank);
 setStep(2);
 posthog.capture('add_card_wizard_bank_selected', {
 bank_id: bank.id,
 bank_name: bank.name,
 });
 }

 function selectCard(card: Card) {
 setSelectedCard(card);
 setStep(3);
 posthog.capture('add_card_wizard_card_selected', {
 card_id: card.id,
 card_name: card.name,
 card_network: card.card_network,
 card_type: card.card_type,
 bank_id: selectedBank?.id,
 bank_name: selectedBank?.name,
 });
 }

 return (
 <PageContainer maxWidth="4xl">
 {/* Header */}
 <div className="flex items-center gap-2 mb-6">
 <button
 onClick={handleBack}
 className="p-1.5 -ml-1.5 text-slate-500 hover:text-slate-600 transition-colors"
 >
 <IconArrowLeft size={20} />
 </button>
 <h1 className="flex-1">Thêm thẻ</h1>
 <span className="text-sm text-slate-500">Bước {step} / 3</span>
 </div>

 {/* Step progress bar */}
 <div className="flex gap-1 mb-8">
 {([1, 2, 3] as const).map((s) => (
 <div
 key={s}
 className={`flex-1 h-0.5 transition-colors ${s <= step ? 'bg-brand-blue' : 'bg-slate-200'}`}
 />
 ))}
 </div>

 {/* ── Step 1: Choose Bank ── */}
 {step === 1 && (
 <div>
 <p className="text-sm text-slate-500 mb-5">Chọn ngân hàng phát hành thẻ</p>
 <BankSelectionStep banks={banks} loading={banksLoading} onSelect={selectBank} />
 </div>
 )}

 {/* ── Step 2: Choose Card ── */}
 {step === 2 && selectedBank && (
 <CardSelectionStep
 bank={selectedBank}
 cards={bankCards}
 loading={cardsLoading}
 ownedCardIds={ownedCardIds}
 onSelect={selectCard}
 />
 )}

 {/* ── Step 3: Fill Details ── */}
 {step === 3 && selectedCard && (
 <>
 <div className="border-t border-dashed border-slate-200 mb-6" />
 <CardDetailForm
 card={selectedCard}
 bank={selectedBank}
 onSaved={(id) => router.push(getMyCardUrl(id))}
 />
 </>
 )}
 </PageContainer>
 );
}
