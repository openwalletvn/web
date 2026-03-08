import type { WalletCard } from '@/lib/db';
import type { Card } from '@/lib/api';
import { resolveStatementDay, getTimelineForCard, type TimelineResult } from '@/lib/card-dates';

export interface CardWithMilestones {
  walletCard: WalletCard;
  catalogCard: Card | undefined;
  /** Null when statement day or interest-free days are unavailable. */
  timeline: TimelineResult | null;
}

/**
 * Wraps a wallet card with its computed billing timeline.
 * Returns timeline: null when the card lacks the data needed for calendar-based computation
 * (missing statement day, missing interest-free days, or custom due-date override).
 */
export function toCardWithMilestones(
  walletCard: WalletCard,
  catalogCard: Card | undefined,
  today: Date,
): CardWithMilestones {
  if (walletCard.paymentDueDateSource === 'custom') {
    return { walletCard, catalogCard, timeline: null };
  }
  const statementDay = resolveStatementDay(walletCard.statementDate, catalogCard?.statement_date);
  const interestFreeDays = catalogCard?.interest_free_days;
  if (statementDay == null || interestFreeDays == null) {
    return { walletCard, catalogCard, timeline: null };
  }
  return {
    walletCard,
    catalogCard,
    timeline: getTimelineForCard(statementDay, interestFreeDays, today),
  };
}

/**
 * Sorts cards by billing urgency.
 *
 * Score = min(daysToNextClose, daysToNextDue); 'due' wins over 'close' on equal days.
 * Tiebreaker: earliest statement day (day of month), then card name alphabetically.
 * Cards with no upcoming 'close' or 'due' sink to bottom.
 */
export function sortCardsByMilestones(cards: CardWithMilestones[]): CardWithMilestones[] {
  return [...cards].sort((a, b) => {
    const ka = _sortData(a);
    const kb = _sortData(b);
    if (ka.hasData !== kb.hasData) return ka.hasData ? -1 : 1;
    if (ka.days     !== kb.days)   return ka.days - kb.days;
    if (ka.typeRank !== kb.typeRank) return ka.typeRank - kb.typeRank;
    if (ka.statementDay !== kb.statementDay) return ka.statementDay - kb.statementDay;
    return ka.cardName.localeCompare(kb.cardName);
  });
}

interface SortData {
  hasData:      boolean;
  days:         number;  // days to the scoring milestone (Infinity when no data)
  typeRank:     0 | 1;   // 0=due, 1=close (due wins ties)
  statementDay: number;  // day of month (1–31), or 32 when unknown
  cardName:     string;
}

function _sortData(card: CardWithMilestones): SortData {
  const milestones = card.timeline?.milestones ?? [];
  const today      = milestones.find((m) => m.type === 'today')?.date;

  const nextDue   = milestones.find((m) => m.type === 'due'   && m.isUpcoming);
  const nextClose = milestones.find((m) => m.type === 'close' && m.isUpcoming);

  const statementDay = card.timeline
    ? (card.walletCard.statementDate ?? card.catalogCard?.statement_date ?? 32)
    : 32;
  const cardName = card.catalogCard?.name ?? '';

  if (!nextDue && !nextClose) {
    return { hasData: false, days: Infinity, typeRank: 1, statementDay, cardName };
  }

  const ms        = today?.getTime() ?? Date.now();
  const dueDays   = nextDue   ? (nextDue.date.getTime()   - ms) / 86_400_000 : Infinity;
  const closeDays = nextClose ? (nextClose.date.getTime() - ms) / 86_400_000 : Infinity;

  if (dueDays <= closeDays) {
    return { hasData: true, days: dueDays,   typeRank: 0, statementDay, cardName };
  }
  return   { hasData: true, days: closeDays, typeRank: 1, statementDay, cardName };
}
