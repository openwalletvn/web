'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dialog } from 'radix-ui';
import { IconX, IconTrash, IconExternalLink, IconUnlink } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { addCard, updateCard, removeCard } from '@/lib/wallet';
import {
  getCreditAccountsForBank,
  getCardsForCreditAccount,
  unlinkCardFromPool,
  reassignCardToAccount,
  createCreditAccount,
} from '@/lib/credit-account';
import { getCardImageUrl, type Card } from '@/lib/api';
import { db, type WalletCard, type CreditAccount, type CardStatus } from '@/lib/db';
import { CreditPoolSelector, type PoolSelection } from './credit-pool-selector';

interface Props {
  card: Card;
  walletCard?: WalletCard;
  open: boolean;
  onClose: () => void;
  onAfterSave?: () => void;
  onAfterDelete?: () => void;
}

const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

const STATUS_OPTIONS: { value: CardStatus; label: string }[] = [
  { value: 'active',   label: 'Đang dùng' },
  { value: 'expired',  label: 'Hết hạn' },
  { value: 'canceled', label: 'Đã huỷ' },
];

const inputClass =
  'w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm';

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-1">{hint}</p>}
      {children}
    </div>
  );
}

// ─── Credit limit section for edit mode ──────────────────────────────────────

function EditCreditLimitSection({
  walletCard,
  creditAccount,
  siblingCount,
  creditLimitInput,
  onCreditLimitChange,
  onUnlink,
}: {
  walletCard: WalletCard;
  creditAccount: CreditAccount | undefined;
  siblingCount: number;
  creditLimitInput: string;
  onCreditLimitChange: (value: string) => void;
  onUnlink: () => void;
}) {
  const isSupplementary = walletCard.isSupplementary;
  const isShared = siblingCount > 0;

  return (
    <div className="space-y-2">
      <FormField label="Hạn mức tín dụng (VND)">
        <input
          type="number"
          value={creditLimitInput}
          onChange={(e) => onCreditLimitChange(e.target.value)}
          placeholder="50.000.000"
          disabled={isSupplementary}
          className={cn(inputClass, isSupplementary ? 'opacity-50 cursor-not-allowed' : '')}
        />
      </FormField>

      {isSupplementary ? (
        <p className="text-xs text-slate-400 flex items-center gap-1">
          🔒 Hạn mức được quản lý bởi thẻ chính
        </p>
      ) : isShared ? (
        <p className="text-xs text-amber-600 border border-dashed border-amber-300 px-2 py-1.5 rounded-sm bg-amber-50/60">
          ⚠ Thẻ này đang dùng chung hạn mức với {siblingCount} thẻ khác. Thay đổi sẽ ảnh hưởng tất cả các thẻ.
        </p>
      ) : null}

      {!isSupplementary && isShared && (
        <button
          type="button"
          onClick={onUnlink}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-dashed border-slate-300 hover:border-slate-400 px-2.5 py-1.5 rounded-sm transition-colors"
        >
          <IconUnlink size={12} />
          Tách khỏi pool này
        </button>
      )}
    </div>
  );
}

// ─── Reassign section (edit mode, when multiple pools exist for bank) ─────────

function ReassignSection({
  currentAccountId,
  bankId,
  onReassign,
}: {
  currentAccountId: string;
  bankId: string;
  onReassign: (newAccountId: string) => void;
}) {
  const [otherAccounts, setOtherAccounts] = useState<CreditAccount[]>([]);
  const [cardCounts, setCardCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const all = await getCreditAccountsForBank(bankId);
      const others = all.filter((a) => a.id !== currentAccountId);
      setOtherAccounts(others);
      const counts: Record<string, number> = {};
      for (const acc of others) {
        counts[acc.id] = await getCardsForCreditAccount(acc.id).then((c) => c.length);
      }
      setCardCounts(counts);
    })();
  }, [bankId, currentAccountId]);

  if (otherAccounts.length === 0) return null;

  return (
    <FormField label="Chuyển sang pool khác">
      <select
        defaultValue=""
        onChange={(e) => { if (e.target.value) onReassign(e.target.value); }}
        className={inputClass}
      >
        <option value="">— giữ nguyên —</option>
        {otherAccounts.map((account) => (
          <option key={account.id} value={account.id}>
            Pool {account.creditLimit.toLocaleString('vi-VN')}đ ({cardCounts[account.id] ?? 0} thẻ)
          </option>
        ))}
      </select>
    </FormField>
  );
}

// ─── Main dialog ─────────────────────────────────────────────────────────────

export function CardFormDialog({ card, walletCard, open, onClose, onAfterSave, onAfterDelete }: Props) {
  const isEdit = !!walletCard;
  const showCreditFields = card.card_type.includes('credit') || card.card_type.includes('2in1');

  // Common form fields
  const [nickname, setNickname] = useState('');
  const [last4, setLast4] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [validThru, setValidThru] = useState('');
  const [statementDate, setStatementDate] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [dueDateOverridden, setDueDateOverridden] = useState(false);
  const [isSupplementary, setIsSupplementary] = useState(false);
  const [status, setStatus] = useState<CardStatus>('active');
  const [statusNote, setStatusNote] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Add-mode credit pool state
  const [poolSelection, setPoolSelection] = useState<PoolSelection>({
    poolChoice: 'new',
    creditLimit: '',
    isSupplementary: false,
  });

  // Edit-mode credit account state
  const [creditAccount, setCreditAccount] = useState<CreditAccount | undefined>();
  const [siblingCount, setSiblingCount] = useState(0);
  const [creditLimitInput, setCreditLimitInput] = useState('');

  // Populate form on open
  useEffect(() => {
    if (!open) return;

    if (isEdit && walletCard) {
      setNickname(walletCard.nickname ?? '');
      setLast4(walletCard.last4 ?? '');
      setIssueDate(walletCard.issueDate ?? '');
      setValidThru(walletCard.validThru ?? '');
      setStatementDate(walletCard.statementDate?.toString() ?? '');
      setPaymentDueDate(walletCard.paymentDueDate?.toString() ?? '');
      setDueDateOverridden(!!walletCard.paymentDueDate);
      setIsSupplementary(walletCard.isSupplementary ?? false);
      setStatus(walletCard.status ?? 'active');
      setStatusNote(walletCard.statusNote ?? '');
      setNote(walletCard.note ?? '');

      // Fetch credit account data for edit mode
      if (showCreditFields && walletCard.creditAccountId) {
        (async () => {
          const account = await db.creditAccounts.get(walletCard.creditAccountId!);
          if (account) {
            setCreditAccount(account);
            setCreditLimitInput(account.creditLimit.toString());
            const siblings = await getCardsForCreditAccount(account.id);
            setSiblingCount(siblings.filter((c) => c.id !== walletCard.id).length);
          }
        })();
      }
    } else {
      setNickname('');
      setLast4('');
      setIssueDate('');
      setValidThru('');
      setStatementDate('');
      setPaymentDueDate('');
      setDueDateOverridden(false);
      setIsSupplementary(false);
      setStatus('active');
      setStatusNote('');
      setNote('');
      setPoolSelection({ poolChoice: 'new', creditLimit: '', isSupplementary: false });
      setCreditAccount(undefined);
      setSiblingCount(0);
      setCreditLimitInput('');
    }
  }, [open, card.id, walletCard?.id]);

  // Auto-calc payment due date
  useEffect(() => {
    if (dueDateOverridden || !statementDate || !card.interest_free_days) return;
    const raw = (parseInt(statementDate) + card.interest_free_days) % 30;
    setPaymentDueDate(String(raw === 0 ? 30 : raw));
  }, [statementDate, card.interest_free_days, dueDateOverridden]);

  async function handleSave() {
    setSaving(true);
    try {
      let resolvedCreditAccountId: string | undefined;

      if (showCreditFields) {
        if (isEdit && walletCard?.creditAccountId) {
          // Update the credit account limit if it changed and not supplementary
          if (!walletCard.isSupplementary && creditAccount && creditLimitInput) {
            const newLimit = parseInt(creditLimitInput);
            if (newLimit !== creditAccount.creditLimit) {
              const { db } = await import('@/lib/db');
              await db.creditAccounts.update(creditAccount.id, { creditLimit: newLimit });
            }
          }
          resolvedCreditAccountId = walletCard.creditAccountId;
        } else {
          // Add mode: create or assign pool
          if (poolSelection.poolChoice === 'new') {
            const newAccount = await createCreditAccount(
              card.bank_id,
              parseInt(poolSelection.creditLimit) || 0,
            );
            resolvedCreditAccountId = newAccount.id;
          } else {
            resolvedCreditAccountId = poolSelection.poolChoice;
          }
        }
      }

      const data = {
        cardId: card.id,
        bankId: card.bank_id,
        cardType: card.card_type.includes('credit') ? 'credit'
          : card.card_type.includes('2in1') ? '2in1'
          : card.card_type.includes('debit') ? 'debit'
          : 'prepaid',
        nickname: nickname || undefined,
        creditAccountId: resolvedCreditAccountId,
        isSupplementary: showCreditFields
          ? (isEdit ? isSupplementary : poolSelection.isSupplementary)
          : undefined,
        last4: last4 || undefined,
        issueDate: issueDate || undefined,
        validThru: validThru || undefined,
        statementDate: statementDate ? parseInt(statementDate) : undefined,
        paymentDueDate: paymentDueDate ? parseInt(paymentDueDate) : undefined,
        status,
        statusNote: status !== 'active' ? (statusNote || undefined) : undefined,
        note: note || undefined,
      };

      if (isEdit && walletCard) {
        await updateCard(walletCard.id, data);
      } else {
        await addCard(data);
      }

      onClose();
      onAfterSave?.();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!walletCard || !window.confirm('Xóa thẻ này khỏi ví?')) return;
    setDeleting(true);
    try {
      await removeCard(walletCard.id);
      onClose();
      onAfterDelete?.();
    } finally {
      setDeleting(false);
    }
  }

  async function handleUnlink() {
    if (!walletCard || !window.confirm('Tách thẻ này ra khỏi pool chung? Thẻ sẽ có pool hạn mức riêng.')) return;
    await unlinkCardFromPool(walletCard);
    // Reload credit account data
    const updatedCard = await db.walletCards.get(walletCard.id);
    if (updatedCard?.creditAccountId) {
      const account = await db.creditAccounts.get(updatedCard.creditAccountId);
      if (account) {
        setCreditAccount(account);
        setCreditLimitInput(account.creditLimit.toString());
        setSiblingCount(0);
      }
    }
  }

  async function handleReassign(newAccountId: string) {
    if (!walletCard) return;
    await reassignCardToAccount(walletCard.id, newAccountId);
    onClose();
    onAfterSave?.();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2',
            'max-h-[90vh] overflow-y-auto',
            'bg-white border border-dashed border-slate-200 rounded-sm shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <div className="w-16 aspect-[16/10] bg-slate-50 rounded-sm overflow-hidden shrink-0">
              <img src={getCardImageUrl(card)} alt={card.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <Dialog.Title className="font-bold text-slate-900 text-sm leading-tight truncate">
                {card.name}
              </Dialog.Title>
              <p className="text-xs text-slate-400 capitalize mt-0.5">
                {card.card_network} · {card.card_type.join(' / ')}
              </p>
              {isEdit && (
                <Link
                  href={`/cards/${card.id}`}
                  onClick={onClose}
                  className="text-xs text-brand-blue hover:underline underline-offset-2 flex items-center gap-0.5 mt-0.5 w-fit"
                >
                  Xem chi tiết <IconExternalLink size={11} />
                </Link>
              )}
            </div>
            <Dialog.Close className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors self-start">
              <IconX size={16} />
            </Dialog.Close>
          </div>

          <div className="border-t border-dashed border-slate-200" />

          {/* Form */}
          <div className="px-4 py-4 space-y-4">
            <p className="text-xs text-slate-400">Tất cả các trường đều không bắt buộc</p>

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
                <input type="text" value={issueDate} onChange={(e) => setIssueDate(e.target.value)}
                  placeholder="MM/YY" maxLength={5} className={inputClass} />
              </FormField>
              <FormField label="Hiệu lực đến">
                <input type="text" value={validThru} onChange={(e) => setValidThru(e.target.value)}
                  placeholder="MM/YY" maxLength={5} className={inputClass} />
              </FormField>
            </div>

            {/* Credit fields */}
            {showCreditFields && (
              <>
                {isEdit ? (
                  <>
                    <EditCreditLimitSection
                      walletCard={walletCard!}
                      creditAccount={creditAccount}
                      siblingCount={siblingCount}
                      creditLimitInput={creditLimitInput}
                      onCreditLimitChange={setCreditLimitInput}
                      onUnlink={handleUnlink}
                    />
                    {walletCard?.creditAccountId && (
                      <ReassignSection
                        currentAccountId={walletCard.creditAccountId}
                        bankId={card.bank_id}
                        onReassign={handleReassign}
                      />
                    )}
                    <FormField label="">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSupplementary}
                          onChange={(e) => setIsSupplementary(e.target.checked)}
                          className="accent-brand-blue"
                        />
                        <span className="text-xs text-slate-600">Thẻ phụ (thẻ bổ sung)</span>
                      </label>
                    </FormField>
                  </>
                ) : (
                  <CreditPoolSelector
                    bankId={card.bank_id}
                    value={poolSelection}
                    onChange={setPoolSelection}
                  />
                )}

                <FormField label="Ngày sao kê">
                  <select
                    value={statementDate}
                    onChange={(e) => { setStatementDate(e.target.value); setDueDateOverridden(false); }}
                    className={inputClass}
                  >
                    <option value="">— chọn ngày —</option>
                    {dayOptions.map((d) => <option key={d} value={String(d)}>Ngày {d}</option>)}
                  </select>
                </FormField>

                <FormField
                  label="Ngày đến hạn thanh toán"
                  hint={
                    !dueDateOverridden && statementDate && card.interest_free_days
                      ? `Tự tính: ngày ${statementDate} + ${card.interest_free_days} ngày miễn lãi`
                      : undefined
                  }
                >
                  <select
                    value={paymentDueDate}
                    onChange={(e) => { setPaymentDueDate(e.target.value); setDueDateOverridden(true); }}
                    className={inputClass}
                  >
                    <option value="">— chọn ngày —</option>
                    {dayOptions.map((d) => <option key={d} value={String(d)}>Ngày {d}</option>)}
                  </select>
                </FormField>
              </>
            )}

            <FormField label="Trạng thái thẻ">
              <select value={status} onChange={(e) => setStatus(e.target.value as CardStatus)} className={inputClass}>
                {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </FormField>

            {status !== 'active' && (
              <FormField label="Lý do">
                <input type="text" value={statusNote} onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Ví dụ: hết hạn tháng 12/2024..." className={inputClass} />
              </FormField>
            )}

            <FormField label="Ghi chú">
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Thẻ chính, thẻ công ty..." rows={2}
                className={cn(inputClass, 'resize-none')} />
            </FormField>
          </div>

          {/* Footer */}
          <div className="border-t border-dashed border-slate-200 px-4 py-3 flex flex-col gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2.5 border border-dashed border-brand-blue text-brand-blue font-semibold rounded-sm hover:bg-blue-50/60 transition-colors disabled:opacity-50 text-sm"
            >
              {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Lưu thẻ vào ví'}
            </button>

            {isEdit && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-2 border border-dashed border-brand-red text-brand-red rounded-sm hover:bg-red-50/60 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-1.5"
              >
                <IconTrash size={14} />
                {deleting ? 'Đang xóa...' : 'Xóa thẻ'}
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
