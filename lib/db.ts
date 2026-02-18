import Dexie, { type EntityTable } from 'dexie';

export type CardStatus = 'active' | 'locked' | 'expired' | 'canceled';

export interface CreditAccount {
  id: string;
  bankId: string;
  creditLimit: number;
}

export interface WalletCard {
  id: string;
  cardId: string;           // references catalog card
  bankId: string;           // denormalized for quick lookup
  cardType: string;         // 'credit' | '2in1' | 'debit' | 'prepaid'
  nickname?: string;
  creditAccountId?: string; // set for credit/2in1 cards
  isSupplementary?: boolean;
  last4?: string;
  issueDate?: string;       // MM/YY
  validThru?: string;       // MM/YY
  statementDate?: number;
  paymentDueDate?: number;
  status?: CardStatus;
  statusNote?: string;
  note?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
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
  }
}
