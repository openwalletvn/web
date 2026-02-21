'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { addCard, hasCardWithSameCatalogId } from '@/lib/wallet';
import { createCreditAccount } from '@/lib/credit-account';
import { getBanks, getCards, getCardImageUrl, type Bank, type Card } from '@/lib/api';
import type { CardStatus } from '@/lib/db';
import { inputClass } from '@/lib/ui-constants';
import { CreditPoolSelector, type PoolSelection } from '@/components/wallet/credit-pool-selector';
import { PageContainer } from '@/components/ui/page-container';
import { FormField } from '@/components/ui/form-field';
import { BankSelectionStep } from '@/components/wallet/add/bank-selection-step';
import { CardSelectionStep } from '@/components/wallet/add/card-selection-step';
import { useWalletDb } from '@/providers/wallet-db-provider';

// ─── Day select helper ────────────────────────────────────────────────────────

function DaySelect({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <FormField label={label} hint={hint}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        <option value="">- chọn ngày -</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
          <option key={d} value={String(d)}>Ngày {d}</option>
        ))}
      </select>
    </FormField>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddCardPage() {
  const router = useRouter();
  const db = useWalletDb();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankCards, setBankCards] = useState<Card[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(false);

  // Step 3 form
  const [nickname, setNickname] = useState('');
  const [last4, setLast4] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [validThru, setValidThru] = useState('');
  const [poolSelection, setPoolSelection] = useState<PoolSelection>({ poolChoice: 'new', creditLimit: '', isSupplementary: false });
  const [statementDate, setStatementDate] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [dueDateOverridden, setDueDateOverridden] = useState(false);
  const [status, setStatus] = useState<CardStatus>('active');
  const [statusNote, setStatusNote] = useState('');
  const [note, setNote] = useState('');
  const [canBeSupplementary, setCanBeSupplementary] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBanksLoading(true);
    getBanks().then(setBanks).finally(() => setBanksLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedBank) return;
    setCardsLoading(true);
    getCards({ bank_id: selectedBank.id }).then(setBankCards).finally(() => setCardsLoading(false));
  }, [selectedBank]);

  useEffect(() => {
    if (dueDateOverridden || !statementDate || !selectedCard?.interest_free_days) return;
    const raw = (parseInt(statementDate) + selectedCard.interest_free_days) % 30;
    setPaymentDueDate(String(raw === 0 ? 30 : raw));
  }, [statementDate, selectedCard, dueDateOverridden]);

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
  }

  function selectCard(card: Card) {
    setSelectedCard(card);
    setStep(3);
    hasCardWithSameCatalogId(db, card.id).then(setCanBeSupplementary);
    setNickname('');
    setLast4('');
    setIssueDate('');
    setValidThru('');
    setPoolSelection({ poolChoice: 'new', creditLimit: '', isSupplementary: false });
    setStatementDate(card.statement_date ? String(card.statement_date) : '');
    setPaymentDueDate('');
    setDueDateOverridden(false);
    setStatus('active');
    setStatusNote('');
    setNote('');
  }

  async function handleSave() {
    if (!selectedCard || !selectedBank) return;
    setSaving(true);
    try {
      const showCreditFields =
        selectedCard.card_type.includes('credit') || selectedCard.card_type.includes('2in1');

      let creditAccountId: string | undefined;

      if (showCreditFields) {
        if (poolSelection.poolChoice === 'new') {
          const newAccount = await createCreditAccount(
            db,
            selectedBank.id,
            parseInt(poolSelection.creditLimit) || 0,
          );
          creditAccountId = newAccount.id;
        } else {
          creditAccountId = poolSelection.poolChoice;
        }
      }

      await addCard(db, {
        cardId: selectedCard.id,
        bankId: selectedBank.id,
        cardType: selectedCard.card_type.includes('credit') ? 'credit'
          : selectedCard.card_type.includes('2in1') ? '2in1'
          : selectedCard.card_type.includes('debit') ? 'debit'
          : 'prepaid',
        nickname: nickname || undefined,
        creditAccountId,
        isSupplementary: showCreditFields ? poolSelection.isSupplementary : undefined,
        last4: last4 || undefined,
        issueDate: issueDate || undefined,
        validThru: validThru || undefined,
        statementDate: statementDate ? parseInt(statementDate) : undefined,
        paymentDueDate: paymentDueDate ? parseInt(paymentDueDate) : undefined,
        status,
        statusNote: status !== 'active' ? (statusNote || undefined) : undefined,
        note: note || undefined,
      });

      router.push('/app/my-cards');
    } finally {
      setSaving(false);
    }
  }

  const showCreditFields =
    selectedCard?.card_type.includes('credit') || selectedCard?.card_type.includes('2in1');

  return (
    <PageContainer maxWidth="2xl">
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
        <div>
          {/* Card preview */}
          <div className="flex items-center gap-4 mb-6 p-4 border border-dashed border-slate-200 rounded-sm">
            <div className="w-24 aspect-[16/10] bg-slate-50 rounded-sm overflow-hidden shrink-0">
              <img src={getCardImageUrl(selectedCard)} alt={selectedCard.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{selectedCard.name}</p>
              <p className="text-slate-500 capitalize mt-0.5">
                {selectedCard.card_network} · {selectedCard.card_type.join(' / ')}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-200 mb-6" />
          <p className="text-slate-500 mb-6">Tất cả các trường đều không bắt buộc</p>

          <div className="space-y-5">
            <FormField label="Tên gợi nhớ">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Thẻ chính, thẻ công ty..."
                className={inputClass}
              />
            </FormField>

            <FormField label="4 số cuối thẻ">
              <input
                type="number"
                value={last4}
                onChange={(e) => setLast4(e.target.value.slice(0, 4))}
                placeholder="1234"
                className={inputClass}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Ngày phát hành">
                <input
                  type="text"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Hiệu lực đến">
                <input
                  type="text"
                  value={validThru}
                  onChange={(e) => setValidThru(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={inputClass}
                />
              </FormField>
            </div>

            {showCreditFields && (
              <>
                <CreditPoolSelector
                  bankId={selectedBank!.id}
                  value={poolSelection}
                  onChange={setPoolSelection}
                  canBeSupplementary={canBeSupplementary}
                />

                <DaySelect
                  label="Ngày sao kê"
                  hint={
                    selectedCard.statement_date && statementDate === String(selectedCard.statement_date)
                      ? 'Mặc định của ngân hàng — bạn có thể thay đổi nếu khác'
                      : undefined
                  }
                  value={statementDate}
                  onChange={(v) => { setStatementDate(v); setDueDateOverridden(false); }}
                />

                <DaySelect
                  label="Ngày đến hạn thanh toán"
                  hint={
                    statementDate && selectedCard.interest_free_days
                      ? `Tự tính: ngày sao kê + ${selectedCard.interest_free_days} ngày miễn lãi`
                      : undefined
                  }
                  value={paymentDueDate}
                  onChange={(v) => { setPaymentDueDate(v); setDueDateOverridden(true); }}
                />
              </>
            )}

            <FormField label="Trạng thái thẻ">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CardStatus)}
                className={inputClass}
              >
                <option value="active">Đang dùng</option>
                <option value="locked">Đã khoá (tạm ngưng sử dụng)</option>
                <option value="expired">Hết hạn</option>
                <option value="canceled">Đã huỷ</option>
              </select>
            </FormField>

            {status !== 'active' && (
              <FormField label="Lý do">
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Ví dụ: hết hạn tháng 12/2024..."
                  className={inputClass}
                />
              </FormField>
            )}

            <FormField label="Ghi chú">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Thẻ chính, thẻ công ty..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </FormField>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-8 w-full py-3 border border-dashed border-brand-blue text-brand-blue font-semibold rounded-sm hover:bg-blue-50/60 transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? 'Đang lưu...' : 'Lưu thẻ'}
          </button>
        </div>
      )}
    </PageContainer>
  );
}
