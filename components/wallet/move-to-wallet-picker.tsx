'use client';

import { useState } from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { getMoveCardInfo, moveCardToWallet } from '@/lib/wallet';
import type { WalletCard } from '@/lib/db';
import type { AppWallet } from '@/lib/app-db';
import { useWalletDb } from '@/providers/wallet-db-provider';
import posthog from 'posthog-js';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | { kind: 'list' }
  | { kind: 'confirm'; destination: AppWallet; siblingCount: number; totalCount: number }
  | { kind: 'moving' };

interface Props {
  walletCard: WalletCard;
  /** Destination wallets (active wallet already excluded). */
  otherWallets: AppWallet[];
  onMoved: () => void;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MoveToWalletPicker({ walletCard, otherWallets, onMoved, onClose }: Props) {
  const db = useWalletDb();
  const [phase, setPhase] = useState<Phase>({ kind: 'list' });

  async function handleSelectWallet(destination: AppWallet) {
    const { siblingCount, cardsToMove } = await getMoveCardInfo(db, walletCard.id);
    if (siblingCount > 0) {
      setPhase({ kind: 'confirm', destination, siblingCount, totalCount: cardsToMove.length });
    } else {
      await execute(destination.id);
    }
  }

  async function execute(destinationWalletId: string) {
    setPhase({ kind: 'moving' });
    try {
      await moveCardToWallet(db, walletCard.id, destinationWalletId);
      posthog.capture('card_moved_to_wallet', {
        card_id: walletCard.cardId,
        bank_id: walletCard.bankId,
        destination_wallet_id: destinationWalletId,
      });
      onMoved();
    } catch {
      // On failure, reset to list so user can retry.
      setPhase({ kind: 'list' });
    }
  }

  // ── Moving spinner ──
  if (phase.kind === 'moving') {
    return (
      <div className="ow-move-to-wallet-picker flex items-center gap-2 px-3 py-2 text-slate-500 text-sm">
        <IconLoader2 size={14} className="animate-spin shrink-0" />
        Đang chuyển...
      </div>
    );
  }

  // ── Confirmation step ──
  if (phase.kind === 'confirm') {
    const { destination, siblingCount, totalCount } = phase;
    return (
      <div className="ow-move-to-wallet-picker p-3 space-y-3">
        <p className="text-sm text-amber-700 bg-amber-50 border border-dashed border-amber-300 rounded px-2.5 py-2 leading-snug">
          Thẻ này thông với {siblingCount} thẻ khác (cùng hạn mức tín dụng).
          Tất cả {totalCount} thẻ sẽ được chuyển cùng nhau sang{' '}
          <span className="font-medium">"{destination.name}"</span>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => execute(destination.id)}
            className="flex-1 py-1.5 border border-dashed border-brand-blue text-brand-blue text-sm rounded hover:bg-blue-50/60 transition-colors font-medium"
          >
            Xác nhận
          </button>
          <button
            onClick={() => setPhase({ kind: 'list' })}
            className="px-3 py-1.5 border border-dashed border-slate-300 text-slate-500 text-sm rounded hover:border-slate-400 transition-colors"
          >
            Huỷ
          </button>
        </div>
      </div>
    );
  }

  // ── Wallet list ──
  return (
    <div className="ow-move-to-wallet-picker py-1">
      <p className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
        Chuyển sang
      </p>
      {otherWallets.map((wallet) => (
        <button
          key={wallet.id}
          onClick={() => handleSelectWallet(wallet)}
          className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {wallet.name}
        </button>
      ))}
    </div>
  );
}
