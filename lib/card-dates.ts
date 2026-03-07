/**
 * Returns the effective statement day for a wallet card.
 * Priority: user override (walletStatementDate) → catalog default (catalogStatementDate).
 */
export function resolveStatementDay(
  walletStatementDate: number | undefined | null,
  catalogStatementDate: number | undefined,
): number | null {
  // Guard against NaN (e.g. parseInt('') = NaN)
  if (walletStatementDate != null && !isNaN(walletStatementDate)) return walletStatementDate;
  if (catalogStatementDate != null) return catalogStatementDate;
  return null;
}

/**
 * Returns true if there is enough data to compute the payment due date.
 */
export function canCalcDueDate(
  walletStatementDate: number | undefined | null,
  catalogStatementDate: number | undefined,
  interestFreeDays: number | undefined,
): boolean {
  return resolveStatementDay(walletStatementDate, catalogStatementDate) != null
    && interestFreeDays != null;
}

/**
 * Returns the close date of the active billing cycle — the earliest statement close date
 * whose due date (closeDate + interestFreeDays) has not yet passed.
 *
 * Algorithm:
 *   1. Start from the most-recent close candidate (today >= statementDay → this month, else last month).
 *   2. Walk backward one month at a time while the previous cycle's due date is still >= today.
 *   3. Return the earliest (oldest) close whose due date is still in the future.
 *
 * Verified traces (today = March 7):
 *
 *   statementDay=25, interestFree=45
 *     candidate: Feb 25 → due Apr 11 ✓ future
 *     prev:      Jan 25 → due Mar 11 ✓ future and closer  ← step back
 *     prev:      Dec 25 → due Feb  8 ✗ past               ← stop
 *     → use Jan 25, due = Mar 11
 *
 *   statementDay=5, interestFree=45
 *     candidate: Mar  5 → due Apr 19 ✓ future
 *     prev:      Feb  5 → due Mar 22 ✓ future and closer  ← step back
 *     prev:      Jan  5 → due Feb 19 ✗ past               ← stop
 *     → use Feb 5, due = Mar 22
 *
 *   statementDay=10, interestFree=55
 *     candidate: Feb 10 → due Apr  6 ✓ future
 *     prev:      Jan 10 → due Mar  6 ✗ past (Mar 6 < Mar 7) ← stop
 *     → use Feb 10, due = Apr 6
 *
 * NOTE: interestFreeDays is required here because it determines whether a given cycle's
 * due date has passed. This function is intentionally internal (only called by calcDueDate).
 */
export function getLastCloseDate(
  walletStatementDate: number | undefined | null,
  catalogStatementDate: number | undefined,
  interestFreeDays: number,
  today?: Date,
): Date | null {
  const statementDay = resolveStatementDay(walletStatementDate, catalogStatementDate);
  if (statementDay == null) return null;

  const t = today ?? new Date();
  const todayMidnight = new Date(t.getFullYear(), t.getMonth(), t.getDate());

  // Initial candidate: most-recent calendar close
  let candidate: Date = t.getDate() >= statementDay
    ? new Date(t.getFullYear(), t.getMonth(), statementDay)
    : new Date(t.getFullYear(), t.getMonth() - 1, statementDay);

  // Walk backward while the previous cycle's due date hasn't expired yet.
  // Cap at 24 iterations to guard against pathological inputs.
  for (let i = 0; i < 24; i++) {
    const prev = new Date(candidate.getFullYear(), candidate.getMonth() - 1, statementDay);
    const prevDue = new Date(prev.getTime());
    prevDue.setDate(prevDue.getDate() + interestFreeDays);
    if (prevDue < todayMidnight) break; // previous cycle is past due — candidate is correct
    candidate = prev;
  }

  return candidate;
}

/**
 * Returns the date of the next upcoming statement close relative to `today`.
 *
 *   today.date < statementDay  →  this month's statementDay
 *   today.date >= statementDay →  next month's statementDay
 */
export function getNextCloseDate(
  walletStatementDate: number | undefined | null,
  catalogStatementDate: number | undefined,
  today?: Date,
): Date | null {
  const statementDay = resolveStatementDay(walletStatementDate, catalogStatementDate);
  if (statementDay == null) return null;
  const t = today ?? new Date();
  if (t.getDate() < statementDay) {
    return new Date(t.getFullYear(), t.getMonth(), statementDay);
  }
  return new Date(t.getFullYear(), t.getMonth() + 1, statementDay);
}

/**
 * Computes the payment due date using real calendar arithmetic.
 *
 *   dueDate = getLastCloseDate(...) + interestFreeDays calendar days
 *
 * "Last close" is the earliest statement close whose resulting due date hasn't passed yet
 * (see getLastCloseDate). JavaScript's Date handles month/year overflow (e.g. Jan 31 + 3 = Feb 3).
 *
 * Returns null if the statement day or interestFreeDays cannot be resolved.
 */
export function calcDueDate(
  walletStatementDate: number | undefined | null,
  catalogStatementDate: number | undefined,
  interestFreeDays: number | undefined,
  today?: Date,
): Date | null {
  if (interestFreeDays == null) return null;
  const lastClose = getLastCloseDate(walletStatementDate, catalogStatementDate, interestFreeDays, today);
  if (lastClose == null) return null;
  const d = new Date(lastClose.getTime());
  d.setDate(d.getDate() + interestFreeDays + 1);
  return d;
}

/**
 * Returns the date on which to fire a statement-close reminder.
 *
 *   statementFireDate = getNextCloseDate(...) − daysBefore calendar days
 *
 * Returns null if the statement day cannot be resolved.
 */
export function calcStatementFireDate(
  walletStatementDate: number | undefined | null,
  catalogStatementDate: number | undefined,
  daysBefore: number,
  today?: Date,
): Date | null {
  const nextClose = getNextCloseDate(walletStatementDate, catalogStatementDate, today);
  if (nextClose == null) return null;
  const d = new Date(nextClose.getTime());
  d.setDate(d.getDate() - daysBefore);
  return d;
}

/** Returns the day-of-month (1–31) from a computed due Date. */
export function dueDateDay(date: Date): number {
  return date.getDate();
}

/** Formats a Date as a Vietnamese display string, e.g. "ngày 01/04". */
export function formatDueDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `ngày ${day}/${month}`;
}
