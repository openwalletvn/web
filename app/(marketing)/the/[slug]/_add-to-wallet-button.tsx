'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconWallet } from '@tabler/icons-react';
import { CardFormDialog } from '@/components/wallet/card-form-dialog';
import { WalletDbProvider } from '@/providers/wallet-db-provider';
import type { Card } from '@/lib/api';
import posthog from 'posthog-js';

interface Props {
  card: Card;
}

export function AddToWalletButton({ card }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          posthog.capture('catalog_card_added_to_wallet', {
            card_id: card.id,
            card_name: card.name,
            card_network: card.card_network,
            card_type: card.card_type,
            bank_id: card.bank_id,
          });
        }}
        className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-brand-blue text-brand-blue font-medium rounded-sm hover:bg-blue-50/60 transition-colors text-sm w-full"
      >
        <IconWallet size={16} />
        Thêm vào ví
      </button>

      <WalletDbProvider>
        <CardFormDialog
          card={card}
          open={open}
          onClose={() => setOpen(false)}
          onAfterSave={() => router.push('/app')}
        />
      </WalletDbProvider>
    </>
  );
}
