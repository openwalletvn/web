type ReminderType = 'statementDate' | 'paymentDueDate';

const TYPE_LABELS: Record<ReminderType, string> = {
  statementDate: 'sao kê',
  paymentDueDate: 'đến hạn thanh toán',
};

export function buildReminderMessage(
  bankName: string,
  cardName: string,
  type: ReminderType,
  daysBefore: number,
): string {
  const typeLabel = TYPE_LABELS[type];
  const timeLabel =
    daysBefore === 0
      ? 'hôm nay'
      : daysBefore === 1
        ? 'ngày mai'
        : `trong ${daysBefore} ngày`;

  return `💳 ${bankName} ${cardName} — ${typeLabel} ${timeLabel}`;
}
