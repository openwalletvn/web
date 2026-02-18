'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { db } from '@/lib/db';
import { getCardImageUrl, type Card } from '@/lib/api';

interface Props {
  card: Card;
  open: boolean;
  onClose: () => void;
}

export function QuickAddSheet({ card, open, onClose }: Props) {
  const router = useRouter();

  const [last4, setLast4] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [statementDate, setStatementDate] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [dueDateOverridden, setDueDateOverridden] = useState(false);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // Reset form when card changes
  useEffect(() => {
    setLast4('');
    setCreditLimit('');
    setStatementDate('');
    setPaymentDueDate('');
    setDueDateOverridden(false);
    setNote('');
  }, [card.id]);

  // Auto-calc payment due date
  useEffect(() => {
    if (dueDateOverridden || !statementDate || !card.interest_free_days) return;
    const raw = (parseInt(statementDate) + card.interest_free_days) % 30;
    setPaymentDueDate(String(raw === 0 ? 30 : raw));
  }, [statementDate, card, dueDateOverridden]);

  async function handleSave() {
    setSaving(true);
    try {
      await db.userCards.add({
        catalogId: card.id,
        last4: last4 || undefined,
        creditLimit: creditLimit ? parseInt(creditLimit) : undefined,
        statementDate: statementDate ? parseInt(statementDate) : undefined,
        paymentDueDate: paymentDueDate ? parseInt(paymentDueDate) : undefined,
        note: note || undefined,
        order: Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      onClose();
      router.push('/app');
    } finally {
      setSaving(false);
    }
  }

  const showCreditFields =
    card.card_type.includes('credit') || card.card_type.includes('2in1');

  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-sm">
        <SheetHeader className="mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 aspect-[16/10] bg-slate-50 rounded-sm overflow-hidden shrink-0">
              <img
                src={getCardImageUrl(card)}
                alt={card.name}
                className="w-full h-full object-contain"
              />
            </div>
            <SheetTitle className="text-left text-base font-bold text-slate-900 leading-tight">
              {card.name}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="border-t border-dashed border-slate-200 mb-5" />
        <p className="text-xs text-slate-400 mb-5">Tất cả các trường đều không bắt buộc</p>

        <div className="space-y-4">
          {/* Last 4 digits */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">4 số cuối thẻ</label>
            <input
              type="number"
              value={last4}
              onChange={(e) => setLast4(e.target.value.slice(0, 4))}
              placeholder="1234"
              className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm"
            />
          </div>

          {/* Credit limit */}
          {showCreditFields && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Ngày sao kê</label>
            <select
              value={statementDate}
              onChange={(e) => {
                setStatementDate(e.target.value);
                setDueDateOverridden(false);
              }}
              className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm bg-white text-slate-900 focus:outline-none focus:border-brand-blue text-sm"
            >
              <option value="">— chọn ngày —</option>
              {dayOptions.map((d) => (
                <option key={d} value={String(d)}>
                  Ngày {d}
                </option>
              ))}
            </select>
          </div>

          {/* Payment due date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ngày đến hạn thanh toán
            </label>
            {!dueDateOverridden && statementDate && card.interest_free_days && (
              <p className="text-xs text-slate-400 mb-1">
                Tự tính: ngày sao kê + {card.interest_free_days} ngày miễn lãi
              </p>
            )}
            <select
              value={paymentDueDate}
              onChange={(e) => {
                setPaymentDueDate(e.target.value);
                setDueDateOverridden(true);
              }}
              className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm bg-white text-slate-900 focus:outline-none focus:border-brand-blue text-sm"
            >
              <option value="">— chọn ngày —</option>
              {dayOptions.map((d) => (
                <option key={d} value={String(d)}>
                  Ngày {d}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thẻ chính, thẻ công ty..."
              rows={2}
              className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-brand-blue text-sm resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full py-3 border border-dashed border-brand-blue text-brand-blue font-semibold rounded-sm hover:bg-blue-50/60 transition-colors disabled:opacity-50 text-sm"
        >
          {saving ? 'Đang lưu...' : 'Lưu thẻ vào ví'}
        </button>
      </SheetContent>
    </Sheet>
  );
}
