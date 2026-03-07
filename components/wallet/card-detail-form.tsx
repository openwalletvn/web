'use client';

import { useState, useEffect } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { inputClass } from '@/lib/ui-constants';
import { addCard, updateCard, removeCard, hasCardWithSameCatalogId } from '@/lib/wallet';
import { createCreditAccount } from '@/lib/credit-account';
import { type Card, type Bank } from '@/lib/api';
import type { WalletCard, CreditAccount, CardStatus } from '@/lib/db';
import { CardImage } from '@/components/cards/card-image';
import { FormField } from '@/components/ui/form-field';
import { CreditPoolSelector, type PoolSelection } from './credit-pool-selector';
import { useWalletDb } from '@/providers/wallet-db-provider';
import posthog from 'posthog-js';

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_TYPE_LABELS: Record<string, string> = {
  credit:  'Tín dụng',
  debit:   'Ghi nợ',
  '2in1':  '2 trong 1',
  prepaid: 'Trả trước',
};

const NETWORK_LABELS: Record<string, string> = {
  visa:       'Visa',
  mastercard: 'Mastercard',
  jcb:        'JCB',
  napas:      'Napas',
  amex:       'American Express',
  unionpay:   'UnionPay',
};

const STATUS_OPTIONS: { value: CardStatus; label: string }[] = [
  { value: 'active',   label: 'Đang dùng' },
  { value: 'locked',   label: 'Đã khoá (tạm ngưng sử dụng)' },
  { value: 'expired',  label: 'Hết hạn' },
  { value: 'canceled', label: 'Đã huỷ' },
];

const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

// ─── Sub-components ───────────────────────────────────────────────────────────

function ApiInfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex justify-between gap-3 py-2 border-b border-dashed border-slate-100 last:border-0 text-sm">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="text-slate-700 text-right">{value}</span>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CardDetailFormProps {
  card: Card;
  bank: Bank | null;
  walletCard?: WalletCard;        // undefined = add mode
  creditAccount?: CreditAccount;  // only relevant in edit mode
  onSaved: (walletCardId: string) => void;
  onDeleted?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CardDetailForm({
  card,
  bank,
  walletCard,
  creditAccount,
  onSaved,
  onDeleted,
}: CardDetailFormProps) {
  const db = useWalletDb();
  const isEdit = !!walletCard;
  const showCreditFields = card.card_type.includes('credit') || card.card_type.includes('2in1');

  // ── Form state ──
  const [nickname, setNickname] = useState(walletCard?.nickname ?? '');
  const [last4, setLast4] = useState(walletCard?.last4 ?? '');
  const [issueDate, setIssueDate] = useState(walletCard?.issueDate ?? '');
  const [validThru, setValidThru] = useState(walletCard?.validThru ?? '');
  const [statementDate, setStatementDate] = useState(
    walletCard?.statementDate?.toString() ??
    (card.statement_date ? String(card.statement_date) : ''),
  );
  const [paymentDueDate, setPaymentDueDate] = useState(walletCard?.paymentDueDate?.toString() ?? '');
  const [dueDateOverridden, setDueDateOverridden] = useState(
    walletCard?.paymentDueDateSource === 'custom' ||
    (!walletCard?.paymentDueDateSource && !!walletCard?.paymentDueDate),
  );
  const [status, setStatus] = useState<CardStatus>(walletCard?.status ?? 'active');
  const [statusNote, setStatusNote] = useState(walletCard?.statusNote ?? '');
  const [note, setNote] = useState(walletCard?.note ?? '');

  // ── Credit fields ──
  const [creditLimitInput, setCreditLimitInput] = useState(creditAccount?.creditLimit?.toString() ?? '');
  const [poolSelection, setPoolSelection] = useState<PoolSelection>({
    poolChoice: 'new',
    creditLimit: '',
    isSupplementary: false,
  });
  const [canBeSupplementary, setCanBeSupplementary] = useState(false);

  // ── UI state ──
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    hasCardWithSameCatalogId(db, card.id, walletCard?.id).then(setCanBeSupplementary);
  }, [db, card.id, walletCard?.id]);

  // Auto-calculate due date from statement date + interest_free_days
  useEffect(() => {
    if (dueDateOverridden || !statementDate || !card.interest_free_days) return;
    const raw = (parseInt(statementDate) + card.interest_free_days) % 30;
    setPaymentDueDate(String(raw === 0 ? 30 : raw));
  }, [statementDate, card.interest_free_days, dueDateOverridden]);

  async function handleSave() {
    setSaving(true);
    try {
      let resolvedCreditAccountId = walletCard?.creditAccountId;

      if (showCreditFields) {
        if (isEdit) {
          if (!walletCard!.isSupplementary && creditAccount && creditLimitInput) {
            const newLimit = parseInt(creditLimitInput);
            if (newLimit !== creditAccount.creditLimit) {
              await db.creditAccounts.update(creditAccount.id, { creditLimit: newLimit });
            }
          }
        } else {
          if (poolSelection.poolChoice === 'new') {
            const newAccount = await createCreditAccount(
              db,
              card.bank_id,
              parseInt(poolSelection.creditLimit) || 0,
            );
            resolvedCreditAccountId = newAccount.id;
          } else {
            resolvedCreditAccountId = poolSelection.poolChoice;
          }
        }
      }

      const cardType = card.card_type.includes('credit') ? 'credit'
        : card.card_type.includes('2in1') ? '2in1'
        : card.card_type.includes('debit') ? 'debit'
        : 'prepaid';

      const data = {
        cardId: card.id,
        bankId: card.bank_id,
        cardType,
        nickname: nickname || undefined,
        creditAccountId: resolvedCreditAccountId,
        isSupplementary: showCreditFields
          ? (isEdit ? walletCard!.isSupplementary : poolSelection.isSupplementary)
          : undefined,
        last4: last4 || undefined,
        issueDate: issueDate || undefined,
        validThru: validThru || undefined,
        statementDate: statementDate ? parseInt(statementDate) : undefined,
        paymentDueDate: paymentDueDate ? parseInt(paymentDueDate) : undefined,
        paymentDueDateSource: paymentDueDate
          ? (dueDateOverridden ? 'custom' : 'calculated') as 'custom' | 'calculated'
          : undefined,
        status,
        statusNote: status !== 'active' ? (statusNote || undefined) : undefined,
        note: note || undefined,
      };

      if (isEdit && walletCard) {
        await updateCard(db, walletCard.id, data);
        posthog.capture('card_updated', {
          card_id: card.id,
          card_name: card.name,
          bank_id: card.bank_id,
          status,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        onSaved(walletCard.id);
      } else {
        const newId = await addCard(db, data);
        posthog.capture('card_added_to_wallet', {
          card_id: card.id,
          card_name: card.name,
          card_type: cardType,
          card_network: card.card_network,
          bank_id: card.bank_id,
          is_supplementary: showCreditFields ? poolSelection.isSupplementary : false,
          has_nickname: !!nickname,
          has_statement_date: !!statementDate,
          status,
        });
        onSaved(newId);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!walletCard || !window.confirm('Xóa thẻ này khỏi ví?')) return;
    setDeleting(true);
    try {
      await removeCard(db, walletCard.id);
      posthog.capture('card_deleted', { card_id: card.id, bank_id: card.bank_id });
      onDeleted?.();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 items-start">

      {/* ── Left column: card image + uneditable API info ── */}
      <div className="space-y-5">
        <CardImage card={card} />

        <div className="border border-dashed border-slate-200 rounded-sm">
          <div className="px-4 py-2.5 border-b border-dashed border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Thông tin thẻ</p>
          </div>
          <div className="px-4 py-1">
            <ApiInfoRow label="Tên thẻ" value={card.name} />
            <ApiInfoRow label="Ngân hàng" value={bank?.full_name ?? bank?.name} />
            <ApiInfoRow
              label="Mạng thẻ"
              value={NETWORK_LABELS[card.card_network] ?? card.card_network}
            />
            {card.card_tier && <ApiInfoRow label="Hạng thẻ" value={card.card_tier} />}
            <ApiInfoRow
              label="Loại thẻ"
              value={card.card_type.map((t) => CARD_TYPE_LABELS[t] ?? t).join(' / ')}
            />
            {card.annual_fee != null && (
              <ApiInfoRow
                label="Phí thường niên"
                value={
                  card.annual_fee === 0
                    ? <span className="text-green-600">Miễn phí</span>
                    : `${card.annual_fee.toLocaleString('vi-VN')}đ`
                }
              />
            )}
            {card.interest_free_days && (
              <ApiInfoRow label="Ngày miễn lãi" value={`${card.interest_free_days} ngày`} />
            )}
          </div>
        </div>
      </div>

      {/* ── Right column: editable wallet fields ── */}
      <div className="space-y-5">
        <p className="text-slate-400 text-sm">Tất cả các trường đều không bắt buộc</p>

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
            {isEdit ? (
              <FormField label="Hạn mức tín dụng (VND)">
                <input
                  type="number"
                  value={creditLimitInput}
                  onChange={(e) => setCreditLimitInput(e.target.value)}
                  placeholder="50.000.000"
                  disabled={walletCard!.isSupplementary}
                  className={cn(
                    inputClass,
                    walletCard!.isSupplementary ? 'opacity-50 cursor-not-allowed' : '',
                  )}
                />
                {walletCard!.isSupplementary && (
                  <p className="text-slate-400 text-sm mt-1">Hạn mức được quản lý bởi thẻ chính</p>
                )}
              </FormField>
            ) : (
              <CreditPoolSelector
                bankId={card.bank_id}
                value={poolSelection}
                onChange={setPoolSelection}
                canBeSupplementary={canBeSupplementary}
              />
            )}

            <FormField
              label="Ngày sao kê"
              hint={
                !isEdit && card.statement_date && statementDate === String(card.statement_date)
                  ? 'Mặc định của ngân hàng — bạn có thể thay đổi nếu khác'
                  : undefined
              }
            >
              <select
                value={statementDate}
                onChange={(e) => {
                  setStatementDate(e.target.value);
                  setDueDateOverridden(false);
                }}
                className={inputClass}
              >
                <option value="">- chọn ngày -</option>
                {dayOptions.map((d) => (
                  <option key={d} value={String(d)}>Ngày {d}</option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Ngày đề nghị thanh toán"
              hint={
                statementDate && card.interest_free_days
                  ? `Tự tính: ngày ${statementDate} + ${card.interest_free_days} ngày miễn lãi`
                  : undefined
              }
            >
              <select
                value={paymentDueDate}
                onChange={(e) => {
                  setPaymentDueDate(e.target.value);
                  setDueDateOverridden(true);
                }}
                className={inputClass}
              >
                <option value="">- chọn ngày -</option>
                {dayOptions.map((d) => (
                  <option key={d} value={String(d)}>Ngày {d}</option>
                ))}
              </select>
            </FormField>
          </>
        )}

        <FormField label="Trạng thái thẻ">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CardStatus)}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
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
            rows={2}
            className={cn(inputClass, 'resize-none')}
          />
        </FormField>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 border border-dashed border-brand-blue text-brand-blue font-semibold rounded-sm hover:bg-blue-50/60 transition-colors disabled:opacity-50 text-sm"
          >
            {saving
              ? 'Đang lưu...'
              : saved
              ? 'Đã lưu ✓'
              : isEdit
              ? 'Lưu thay đổi'
              : 'Thêm thẻ vào ví'}
          </button>

          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full py-2 border border-dashed border-brand-red text-brand-red rounded-sm hover:bg-red-50/60 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-1.5"
            >
              <IconTrash size={14} />
              {deleting ? 'Đang xóa...' : 'Xóa thẻ khỏi ví'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
