'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { addCard } from '@/lib/wallet';
import { createCreditAccount } from '@/lib/credit-account';
import { getBanks, getCards, getBankImageUrl, getCardImageUrl, type Bank, type Card } from '@/lib/api';
import type { CardStatus } from '@/lib/db';
import { CreditPoolSelector, type PoolSelection } from '@/components/wallet/credit-pool-selector';

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
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-1">{hint}</p>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm bg-white text-slate-900 focus:outline-none focus:border-brand-blue text-sm"
      >
        <option value="">— chọn ngày —</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
          <option key={d} value={String(d)}>Ngày {d}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddCardPage() {
  const router = useRouter();

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
  const [saving, setSaving] = useState(false);

  // Fetch banks on mount
  useEffect(() => {
    setBanksLoading(true);
    getBanks()
      .then(setBanks)
      .finally(() => setBanksLoading(false));
  }, []);

  // Fetch cards when bank is selected
  useEffect(() => {
    if (!selectedBank) return;
    setCardsLoading(true);
    getCards({ bank_id: selectedBank.id })
      .then(setBankCards)
      .finally(() => setCardsLoading(false));
  }, [selectedBank]);

  // Auto-calc payment due date
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
    setNickname('');
    setLast4('');
    setIssueDate('');
    setValidThru('');
    setPoolSelection({ poolChoice: 'new', creditLimit: '', isSupplementary: false });
    setStatementDate('');
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
            selectedBank.id,
            parseInt(poolSelection.creditLimit) || 0,
          );
          creditAccountId = newAccount.id;
        } else {
          creditAccountId = poolSelection.poolChoice;
        }
      }

      await addCard({
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

      router.push('/app');
    } finally {
      setSaving(false);
    }
  }

  const showCreditFields =
    selectedCard?.card_type.includes('credit') || selectedCard?.card_type.includes('2in1');

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleBack}
          className="p-1.5 -ml-1.5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <IconArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-slate-900 flex-1">Thêm thẻ</h1>
        <span className="text-sm text-slate-400">Bước {step} / 3</span>
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
          {banksLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 border border-dashed border-slate-200 rounded-sm">
                  <div className="w-12 h-12 bg-slate-100 rounded-sm animate-pulse" />
                  <div className="w-14 h-3 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => selectBank(bank)}
                  className="flex flex-col items-center gap-2 p-4 border border-dashed border-slate-200 rounded-sm hover:border-brand-blue hover:bg-blue-50/40 transition-colors text-center"
                >
                  <img src={getBankImageUrl(bank.logo_url)} alt={bank.name} className="w-12 h-12 object-contain" />
                  <span className="text-xs text-slate-600 leading-tight">{bank.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: Choose Card ── */}
      {step === 2 && selectedBank && (
        <div>
          <div className="flex items-center gap-2 mb-5 p-2.5 border border-dashed border-slate-200 rounded-sm w-fit">
            <img src={getBankImageUrl(selectedBank.logo_url)} alt={selectedBank.name} className="w-7 h-7 object-contain" />
            <span className="text-sm font-medium text-slate-700">{selectedBank.name}</span>
          </div>
          <p className="text-sm text-slate-500 mb-4">Chọn thẻ của bạn</p>
          {cardsLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-dashed border-slate-200 rounded-sm p-3">
                  <div className="w-full aspect-[16/10] bg-slate-100 rounded-sm animate-pulse mb-2" />
                  <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : bankCards.length === 0 ? (
            <p className="text-sm text-slate-400">Không tìm thấy thẻ nào của ngân hàng này.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {bankCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => selectCard(card)}
                  className="flex flex-col gap-2 p-3 border border-dashed border-slate-200 rounded-sm hover:border-brand-blue hover:bg-blue-50/40 transition-colors text-left"
                >
                  <div className="w-full aspect-[16/10] bg-slate-50 overflow-hidden rounded-sm">
                    <img src={getCardImageUrl(card)} alt={card.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-medium text-slate-800 leading-tight">{card.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
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
              <p className="text-xs text-slate-400 capitalize mt-0.5">
                {selectedCard.card_network} · {selectedCard.card_type.join(' / ')}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-200 mb-6" />
          <p className="text-xs text-slate-400 mb-6">Tất cả các trường đều không bắt buộc</p>

          <div className="space-y-5">
            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên gợi nhớ</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                placeholder="Thẻ chính, thẻ công ty..."
                className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm" />
            </div>

            {/* Last 4 digits */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">4 số cuối thẻ</label>
              <input type="number" value={last4} onChange={(e) => setLast4(e.target.value.slice(0, 4))}
                placeholder="1234"
                className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm" />
            </div>

            {/* Issue date + valid thru */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ngày phát hành</label>
                <input type="text" value={issueDate} onChange={(e) => setIssueDate(e.target.value)}
                  placeholder="MM/YY" maxLength={5}
                  className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hiệu lực đến</label>
                <input type="text" value={validThru} onChange={(e) => setValidThru(e.target.value)}
                  placeholder="MM/YY" maxLength={5}
                  className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm" />
              </div>
            </div>

            {/* Credit pool + statement dates */}
            {showCreditFields && (
              <>
                <CreditPoolSelector
                  bankId={selectedBank!.id}
                  value={poolSelection}
                  onChange={setPoolSelection}
                />

                <DaySelect
                  label="Ngày sao kê"
                  value={statementDate}
                  onChange={(v) => { setStatementDate(v); setDueDateOverridden(false); }}
                />

                <DaySelect
                  label="Ngày đến hạn thanh toán"
                  hint={
                    !dueDateOverridden && statementDate && selectedCard.interest_free_days
                      ? `Tự tính: ngày sao kê + ${selectedCard.interest_free_days} ngày miễn lãi`
                      : undefined
                  }
                  value={paymentDueDate}
                  onChange={(v) => { setPaymentDueDate(v); setDueDateOverridden(true); }}
                />
              </>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái thẻ</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as CardStatus)}
                className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm bg-white text-slate-900 focus:outline-none focus:border-brand-blue text-sm">
                <option value="active">Đang dùng</option>
                <option value="expired">Hết hạn</option>
                <option value="canceled">Đã huỷ</option>
              </select>
            </div>

            {status !== 'active' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lý do</label>
                <input type="text" value={statusNote} onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Ví dụ: hết hạn tháng 12/2024..."
                  className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm" />
              </div>
            )}

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Thẻ chính, thẻ công ty..." rows={3}
                className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm resize-none" />
            </div>
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
    </div>
  );
}
