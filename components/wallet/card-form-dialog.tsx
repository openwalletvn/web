'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dialog } from 'radix-ui';
import { IconX, IconTrash, IconExternalLink } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { addCard, updateCard, removeCard } from '@/lib/wallet';
import { getCardImageUrl, type Card } from '@/lib/api';
import type { UserCard } from '@/lib/db';

interface Props {
  card: Card;
  userCard?: UserCard;       // provided → edit mode, absent → add mode
  open: boolean;
  onClose: () => void;
  onAfterSave?: () => void;  // e.g. navigate to /app from catalog
  onAfterDelete?: () => void;
}

const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

export function CardFormDialog({ card, userCard, open, onClose, onAfterSave, onAfterDelete }: Props) {
  const isEdit = !!userCard;

  const [last4, setLast4] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [statementDate, setStatementDate] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [dueDateOverridden, setDueDateOverridden] = useState(false);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Populate form when opening in edit mode or when card changes
  useEffect(() => {
    if (isEdit && userCard) {
      setLast4(userCard.last4 ?? '');
      setCreditLimit(userCard.creditLimit?.toString() ?? '');
      setStatementDate(userCard.statementDate?.toString() ?? '');
      setPaymentDueDate(userCard.paymentDueDate?.toString() ?? '');
      setDueDateOverridden(!!userCard.paymentDueDate);
      setNote(userCard.note ?? '');
    } else {
      setLast4('');
      setCreditLimit('');
      setStatementDate('');
      setPaymentDueDate('');
      setDueDateOverridden(false);
      setNote('');
    }
  }, [open, card.id, userCard?.id]);

  // Auto-calc payment due date from statement date + interest_free_days
  useEffect(() => {
    if (dueDateOverridden || !statementDate || !card.interest_free_days) return;
    const raw = (parseInt(statementDate) + card.interest_free_days) % 30;
    setPaymentDueDate(String(raw === 0 ? 30 : raw));
  }, [statementDate, card.interest_free_days, dueDateOverridden]);

  async function handleSave() {
    setSaving(true);
    try {
      const data = {
        catalogId: card.id,
        last4: last4 || undefined,
        creditLimit: creditLimit ? parseInt(creditLimit) : undefined,
        statementDate: statementDate ? parseInt(statementDate) : undefined,
        paymentDueDate: paymentDueDate ? parseInt(paymentDueDate) : undefined,
        note: note || undefined,
      };
      if (isEdit && userCard) {
        await updateCard(userCard.id!, data);
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
    if (!userCard || !window.confirm('Xóa thẻ này khỏi ví?')) return;
    setDeleting(true);
    try {
      await removeCard(userCard.id!);
      onClose();
      onAfterDelete?.();
    } finally {
      setDeleting(false);
    }
  }

  const showCreditFields =
    card.card_type.includes('credit') || card.card_type.includes('2in1');

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
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
              <img
                src={getCardImageUrl(card)}
                alt={card.name}
                className="w-full h-full object-contain"
              />
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

            {/* Last 4 digits */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">4 số cuối thẻ</label>
              <input
                type="number"
                value={last4}
                onChange={(e) => setLast4(e.target.value.slice(0, 4))}
                placeholder="1234"
                className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm"
              />
            </div>

            {/* Credit limit — credit/2in1 only */}
            {showCreditFields && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Hạn mức tín dụng (VND)
                </label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  placeholder="50.000.000"
                  className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm"
                />
              </div>
            )}

            {/* Statement date */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ngày sao kê</label>
              <select
                value={statementDate}
                onChange={(e) => { setStatementDate(e.target.value); setDueDateOverridden(false); }}
                className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm bg-white text-slate-900 focus:outline-none focus:border-brand-blue text-sm"
              >
                <option value="">— chọn ngày —</option>
                {dayOptions.map((d) => (
                  <option key={d} value={String(d)}>Ngày {d}</option>
                ))}
              </select>
            </div>

            {/* Payment due date */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Ngày đến hạn thanh toán
              </label>
              {!dueDateOverridden && statementDate && card.interest_free_days && (
                <p className="text-xs text-slate-400 mb-1">
                  Tự tính: ngày {statementDate} + {card.interest_free_days} ngày miễn lãi
                </p>
              )}
              <select
                value={paymentDueDate}
                onChange={(e) => { setPaymentDueDate(e.target.value); setDueDateOverridden(true); }}
                className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm bg-white text-slate-900 focus:outline-none focus:border-brand-blue text-sm"
              >
                <option value="">— chọn ngày —</option>
                {dayOptions.map((d) => (
                  <option key={d} value={String(d)}>Ngày {d}</option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ghi chú</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Thẻ chính, thẻ công ty..."
                rows={2}
                className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm resize-none"
              />
            </div>
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
