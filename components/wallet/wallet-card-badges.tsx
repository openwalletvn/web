import { DashedBadge } from '@/components/ui/dashed-badge';
import { OwFeeAmount } from '@/components/ow-ui/ow-fee-amount';
import type { WalletCard } from '@/lib/db';
import type { Card } from '@/lib/api';
import type { CreditBadge } from './wallet-card-row';

const STATUS_LABELS: Record<string, string> = {
  locked:   'Đã khoá',
  expired:  'Hết hạn',
  canceled: 'Đã huỷ',
};

export function WalletCardBadges({
  walletCard,
  catalogCard,
  creditBadge,
  creditLimit,
}: {
  walletCard: WalletCard;
  catalogCard: Card | undefined;
  creditBadge?: CreditBadge;
  creditLimit?: number;
}) {
  const isInactive = walletCard.status === 'expired' || walletCard.status === 'canceled';

  return (
    <div className="ow-wallet-card-badges flex flex-wrap gap-1 mt-1.5">
      {walletCard.status && walletCard.status !== 'active' && (
        <DashedBadge variant={isInactive ? 'amber' : 'default'}>
          {STATUS_LABELS[walletCard.status]}
        </DashedBadge>
      )}

      {creditBadge === 'supplementary' && (
        <DashedBadge variant="default">Thẻ phụ</DashedBadge>
      )}
      {creditBadge === 'primary_shared' && (
        <DashedBadge variant="blue">Thẻ thông</DashedBadge>
      )}

      {walletCard.last4 && (
        <DashedBadge>•••• {walletCard.last4}</DashedBadge>
      )}

      {walletCard.validThru && (
        <DashedBadge>Đến {walletCard.validThru}</DashedBadge>
      )}

      {catalogCard?.fees?.annual != null && (
        catalogCard.fees.annual.amount === 0 ? (
          <DashedBadge variant="green">Miễn phí thường niên</DashedBadge>
        ) : (
          <DashedBadge>PTN: <OwFeeAmount amount={catalogCard.fees.annual.amount} compact textOnly period="year"/></DashedBadge>
        )
      )}

      {creditLimit !== undefined && creditLimit > 0 && (
        <DashedBadge variant="blue">Hạn mức: {creditLimit.toLocaleString('vi-VN')}đ</DashedBadge>
      )}

      {/*{walletCard.statementDate && (*/}
      {/*  <DashedBadge variant="blue">Sao kê: ngày {walletCard.statementDate}</DashedBadge>*/}
      {/*)}*/}

      {/*{walletCard.paymentDueDate && (*/}
      {/*  <DashedBadge variant="red">Đến hạn: ngày {walletCard.paymentDueDate}</DashedBadge>*/}
      {/*)}*/}
    </div>
  );
}
