'use client';

import { useState, useEffect } from 'react';
import { getBanks, getCard, type Bank, type Card } from '@/lib/api';
import type { WalletCard } from '@/lib/db';

export function useWalletCatalog(walletCards: WalletCard[] | undefined) {
    const [banks, setBanks] = useState<Record<string, Bank>>({});
    const [catalogCards, setCatalogCards] = useState<Record<string, Card>>({});

    useEffect(() => {
        getBanks().then((list) =>
            setBanks(Object.fromEntries(list.map((b) => [b.id, b]))),
        );
    }, []);

    useEffect(() => {
        const missing = (walletCards ?? []).map((c) => c.cardId).filter((id) => !catalogCards[id]);
        if (!missing.length) return;
        const unique = [...new Set(missing)];
        Promise.all(
            unique.map((id) =>
                getCard(id).then((card) => [id, card] as const).catch(() => null),
            ),
        ).then((results) => {
            const entries = Object.fromEntries(
                results.filter((r): r is [string, Card] => r !== null),
            );
            setCatalogCards((prev) => ({ ...prev, ...entries }));
        });
    }, [walletCards]);

    return { banks, catalogCards };
}
