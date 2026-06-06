# Local-First Wallet (Dexie.js / IndexedDB)

## What "Local-First" Means

The wallet app (`app/app/`) stores all user data **in the browser** using IndexedDB - a built-in browser database. There is no server, no account, no login. Data lives only on the user's device.

Benefits:
- No privacy concerns (data never leaves the device)
- Works offline
- No backend to build or maintain
- Free to run

Tradeoff:
- Data is lost if the user clears browser storage
- No sync across devices (unless you add export/import)

## What Is IndexedDB?

IndexedDB is a low-level key-value store built into every browser. It can store large amounts of structured data (unlike localStorage which is limited to ~5 MB strings).

Dexie.js is a wrapper that makes IndexedDB much easier to use - it gives you a clean API with TypeScript support.

## How It's Used Here

The database schema is defined in `lib/db.ts`:

```ts
import Dexie from 'dexie';

class WalletDatabase extends Dexie {
  cards!: Table<WalletCard>;
  // ...other tables

  constructor() {
    super('openwallet');
    this.version(1).stores({
      cards: '++id, card_id, bank_id',
    });
  }
}

export const db = new WalletDatabase();
```

Usage in a component:
```tsx
// Add a card
await db.cards.add({ card_id: 'vib-cashback', bank_id: 'vib', ... });

// Query cards
const myCards = await db.cards.toArray();
```

## Important: Client Components Only

Because IndexedDB is a browser API, all Dexie usage must be in **Client Components** (`'use client'`). It cannot run during static export (build time runs in Node.js, which has no browser APIs).

## The Two Halves of the App

| Section | Type | Data source |
|---|---|---|
| `app/(marketing)/` | Static pages | API fetched at build time |
| `app/app/` | Client-side wallet app | Dexie / IndexedDB in browser |
