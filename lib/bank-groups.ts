import type {Bank} from '@/lib/api-types.generated';

export type BankGroup = Bank['group'];

export const BANK_GROUP_LABELS: Record<BankGroup, string> = {
    big4: 'Big 4',
    commercial: 'Ngân hàng TMCP',
    digital: 'Ngân hàng số',
    foreign: 'Ngân hàng nước ngoài',
};

export const BANK_GROUP_ORDER: BankGroup[] = ['big4', 'commercial', 'digital', 'foreign'];
