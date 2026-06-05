import Dexie, { type EntityTable } from 'dexie';

export type CardStatus = 'active' | 'locked' | 'expired' | 'canceled';

export interface CreditAccount {
  id: string;
  bankId: string;
  creditLimit: number;
}

export interface CardNotificationConfig {
  enabled: boolean;
  daysBefore: number;
  adapter: string;
}

export interface WalletCard {
  id: string;
  cardId: string;           // references catalog card
  bankId: string;           // denormalized for quick lookup
  cardType: string;         // 'credit' | 'hybrid' | 'debit' | 'prepaid'
  nickname?: string;
  creditAccountId?: string; // set for credit/hybrid cards
  isSupplementary?: boolean;
  last4?: string;
  issueDate?: string;       // MM/YY
  validThru?: string;       // MM/YY
  statementDate?: number;
  /**
   * Stored only when the user explicitly overrides the due date (paymentDueDateSource === 'custom').
   * For all other cases the due date is computed on-the-fly via calcDueDate() from lib/card-dates.ts
   * using statementDate + catalogCard.interest_free_days — do NOT read this field for display or
   * scheduling logic unless you have confirmed paymentDueDateSource === 'custom'.
   */
  paymentDueDate?: number;
  paymentDueDateSource?: 'calculated' | 'custom';
  status?: CardStatus;
  statusNote?: string;
  note?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  notifications?: {
    statementDate?: CardNotificationConfig;
    paymentDueDate?: CardNotificationConfig;
  };
}

export interface WalletConfig {
  key: string;
  value: string;
}

export class WalletDb extends Dexie {
  walletCards!: EntityTable<WalletCard, 'id'>;
  creditAccounts!: EntityTable<CreditAccount, 'id'>;
  config!: EntityTable<WalletConfig, 'key'>;

  constructor(walletId: string) {
    super(`openwallet-wallet-${walletId}`);
    this.version(1).stores({
      walletCards: 'id, bankId, creditAccountId, order, status',
      creditAccounts: 'id, bankId',
      config: 'key',
    });
    this.version(2).stores({}).upgrade(tx =>
      tx.table('walletCards').toCollection().modify(card => {
        if (card.cardType === '2in1') card.cardType = 'hybrid';
      })
    );
  }
}
