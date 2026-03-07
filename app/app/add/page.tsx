'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { getBanks, getCards, type Bank, type Card } from '@/lib/api';
import { CardDetailForm } from '@/components/wallet/card-detail-form';
import { PageContainer } from '@/components/ui/page-container';
import { BankSelectionStep } from '@/components/wallet/add/bank-selection-step';
import { CardSelectionStep } from '@/components/wallet/add/card-selection-step';
import posthog from 'posthog-js';

export default function AddCardPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankCards, setBankCards] = useState<Card[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(false);

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
    if (step === 1) {
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
    <PageContainer maxWidth={step === 3 ? '4xl' : '2xl'}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleBack}
          className="p-1.5 -ml-1.5 text-slate-500 hover:text-slate-600 transition-colors"
        >
          <IconArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-slate-900 flex-1">Thêm thẻ</h1>
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
            onSaved={(id) => router.push(`/app/my-cards/${id}`)}
          />
        </>
      )}
    </PageContainer>
  );
}
