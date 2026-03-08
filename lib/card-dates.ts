// TODO: extract to @openwallet/statement-calendar

/**
 * Returns the effective statement day for a wallet card.
 * Priority: user override (walletStatementDate) → catalog default (catalogStatementDate).
 * Guards against NaN (e.g. parseInt('') === NaN).
 */
export function resolveStatementDay(
  walletStatementDate: number | undefined | null,
  catalogStatementDate: number | undefined,
): number | null {
  if (walletStatementDate != null && !isNaN(walletStatementDate)) return walletStatementDate;
  if (catalogStatementDate != null) return catalogStatementDate;
  return null;
}

/** Formats a Date as a Vietnamese display string, e.g. "ngày 01/04". */
export function formatDueDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `ngày ${day}/${month}`;
}

// ─── StatementCalendar ────────────────────────────────────────────────────────

export interface StatementCycle {
  closeDate: Date;
  dueDate: Date;
}

export interface Milestone {
  date: Date;
  type: 'closeDate' | 'dueDate';
  /** The billing cycle this milestone belongs to (e.g. { from: 21/1, to: 20/2 }). */
  cycle: { from: Date; to: Date };
  isPast: boolean;
  isToday: boolean;
  isUpcoming: boolean;
}

export interface StatementContext {
  /** Most recent statement close date on or before today. */
  previousStatementCloseDate: Date | null;
  /** Next upcoming statement close date strictly after today. */
  nextStatementCloseDate: Date | null;
  /**
   * True when no due date from the last 2 billing cycles is >= today,
   * meaning we are waiting for the next statement close to generate one.
   */
  isWaitingForNextStatement: boolean;
  /** True when nextDueDate is non-null. */
  hasUpcomingDue: boolean;
  /** Earliest due date >= today from the last 2 billing cycles. */
  nextDueDate: Date | null;
  /** The closeDate whose cycle produced nextDueDate. */
  nextDueDateSource: Date | null;
}

export class StatementCalendar {
  readonly statementDay: number;
  readonly interestFreeDays: number;

  constructor(statementDay: number, interestFreeDays: number) {
    this.statementDay = statementDay;
    this.interestFreeDays = interestFreeDays;
  }

  /**
   * Returns statement cycles within the given range, ordered most-recent-first.
   *
   * Options:
   *   - `to`   upper bound (inclusive); defaults to today.
   *   - `from` lower bound (inclusive); iteration stops when closeDate < from.
   *   - `n`    maximum number of cycles to return.
   *
   * Provide at least one of `from` or `n` to prevent unbounded iteration.
   *
   * Example:
   *   new StatementCalendar(5, 55).getCloseDates({ to: new Date('2026-03-07'), n: 2 })
   *   → [
   *       { closeDate: 2026-03-05, dueDate: 2026-04-29 },
   *       { closeDate: 2026-02-05, dueDate: 2026-04-01 },
   *     ]
   */
  getCloseDates(options: { from?: Date; to?: Date; n?: number } = {}): StatementCycle[] {
    const ceiling = options.to ?? new Date();
    const floor = options.from;
    const limit = options.n ?? 1200; // safety cap: ~100 years of monthly cycles

    // Normalize ceiling to midnight for consistent day comparisons
    const ceilingDay = new Date(ceiling.getFullYear(), ceiling.getMonth(), ceiling.getDate());

    // Step back to the most recent close on or before ceilingDay
    let year = ceilingDay.getFullYear();
    let month = ceilingDay.getMonth();
    if (ceilingDay.getDate() < this.statementDay) {
      month -= 1;
      if (month < 0) { month = 11; year -= 1; }
    }

    const result: StatementCycle[] = [];

    while (result.length < limit) {
      const closeDate = new Date(year, month, this.statementDay);

      if (floor !== undefined) {
        const floorDay = new Date(floor.getFullYear(), floor.getMonth(), floor.getDate());
        if (closeDate < floorDay) break;
      }

      const dueDate = new Date(closeDate);
      dueDate.setDate(dueDate.getDate() + this.interestFreeDays);

      result.push({ closeDate, dueDate });

      month -= 1;
      if (month < 0) { month = 11; year -= 1; }
    }

    return result;
  }

  /**
   * Main method for UI components. Returns the full billing context relative to today.
   *
   * Internally calls getCloseDates to examine the last 2 billing cycles, then selects
   * the earliest due date that is >= today as the next upcoming payment due date.
   *
   * Example:
   *   new StatementCalendar(5, 55).getContext(new Date('2026-03-07'))
   *   → {
   *       previousStatementCloseDate: 2026-03-05,   // most recent close <= today
   *       nextStatementCloseDate:     2026-04-05,   // next close strictly after today
   *       isWaitingForNextStatement:  false,         // a due date from recent cycles exists
   *       hasUpcomingDue:             true,
   *       nextDueDate:                2026-04-01,   // earliest due >= today (from Feb 5 cycle)
   *       nextDueDateSource:          2026-02-05,   // the closeDate that produced nextDueDate
   *     }
   */
  getContext(today?: Date): StatementContext {
    const t = today ?? new Date();
    const tod = new Date(t.getFullYear(), t.getMonth(), t.getDate());

    // Examine the last 2 statement cycles (both on or before today)
    const pastCycles = this.getCloseDates({ to: tod, n: 2 });

    const previousStatementCloseDate = pastCycles[0]?.closeDate ?? null;
    const nextStatementCloseDate = this._nextCloseAfter(tod);

    // Keep only cycles whose due date has not yet passed
    const upcomingCandidates = pastCycles
      .filter((cycle) => cycle.dueDate >= tod)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    const nearestCycle = upcomingCandidates[0] ?? null;
    const hasUpcomingDue = nearestCycle !== null;
    const nextDueDate = nearestCycle?.dueDate ?? null;
    const nextDueDateSource = nearestCycle?.closeDate ?? null;
    const isWaitingForNextStatement = !hasUpcomingDue;

    return {
      previousStatementCloseDate,
      nextStatementCloseDate,
      isWaitingForNextStatement,
      hasUpcomingDue,
      nextDueDate,
      nextDueDateSource,
    };
  }

  /**
   * Returns the billing timeline spanning from the cycle origin of the most recent past
   * milestone to the nearest upcoming due date, as an ordered list of Milestone objects.
   *
   * A "milestone" is any statement close date or payment due date that falls in that window.
   * The today marker is NOT included — callers insert it between the last past milestone
   * and the first upcoming milestone when rendering.
   *
   * Algorithm:
   *   1. Find prevMilestone: the closest close/due date strictly before today.
   *   2. Find nextMilestone: the closest close/due date strictly after today.
   *   3. timelineStart = closeDate of prevMilestone's billing cycle.
   *   4. timelineEnd   = getContext().nextDueDate (nearest upcoming due date).
   *   5. Return all close/due dates in [timelineStart, timelineEnd], sorted chronologically.
   *
   * Example — statementDay=20, interestFreeDays=45, today=7/3/2026:
   *   prevMilestone  = 6/3  (dueDate of cycle 21/12–20/1)
   *   nextMilestone  = 20/3 (closeDate of cycle 21/2–20/3)
   *   timelineStart  = 20/1 (closeDate of prevMilestone's cycle)
   *   timelineEnd    = 6/4  (getContext().nextDueDate = 20/2 + 45)
   *
   *   Output (chronological):
   *   [
   *     { date: 20/1, type: 'closeDate', cycle: { from: 21/12, to: 20/1 }, isPast: true, ... },
   *     { date: 20/2, type: 'closeDate', cycle: { from: 21/1,  to: 20/2 }, isPast: true, ... },
   *     { date:  6/3, type: 'dueDate',  cycle: { from: 21/12, to: 20/1 }, isPast: true, ... },
   *     { date: 20/3, type: 'closeDate', cycle: { from: 21/2, to: 20/3 }, isUpcoming: true, ... },
   *     { date:  6/4, type: 'dueDate',  cycle: { from: 21/1,  to: 20/2 }, isUpcoming: true, ... },
   *   ]
   */
  getTimeline(today?: Date): Milestone[] {
    const t = today ?? new Date();
    const tod = new Date(t.getFullYear(), t.getMonth(), t.getDate());

    // Need an upcoming due date to anchor the timeline end
    const context = this.getContext(tod);
    const timelineEnd = context.nextDueDate;
    if (timelineEnd === null) return [];

    // Gather recent milestones from 3 past cycles + next upcoming close
    // to locate prevMilestone (the most recent milestone before today)
    const recentPastCycles = this.getCloseDates({ to: tod, n: 3 });

    interface Candidate {
      date: Date;
      type: 'closeDate' | 'dueDate';
      cycleCloseDate: Date; // the closeDate of the billing cycle this milestone belongs to
    }

    const candidates: Candidate[] = [];
    for (const cycle of recentPastCycles) {
      candidates.push({ date: cycle.closeDate, type: 'closeDate', cycleCloseDate: cycle.closeDate });
      candidates.push({ date: cycle.dueDate,   type: 'dueDate',   cycleCloseDate: cycle.closeDate });
    }
    if (context.nextStatementCloseDate !== null) {
      const nextClose = context.nextStatementCloseDate;
      candidates.push({ date: nextClose, type: 'closeDate', cycleCloseDate: nextClose });
    }

    // prevMilestone: most recent candidate strictly before today
    const prevMilestone = candidates
      .filter((c) => c.date < tod)
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0] ?? null;

    // Timeline starts at the closeDate of prevMilestone's cycle.
    // If prevMilestone is a dueDate, cycleCloseDate is its cycle's earlier closeDate.
    const timelineStart = prevMilestone?.cycleCloseDate ?? tod;

    // Get all cycles whose closeDate falls in [timelineStart, timelineEnd]
    const cyclesInRange = this.getCloseDates({ from: timelineStart, to: timelineEnd });

    // Emit milestones for each cycle, filtering to [timelineStart, timelineEnd]
    const result: Milestone[] = [];
    for (const cycle of cyclesInRange) {
      const cyclePeriod = this._cyclePeriod(cycle.closeDate);

      if (cycle.closeDate >= timelineStart && cycle.closeDate <= timelineEnd) {
        result.push({
          date: cycle.closeDate,
          type: 'closeDate',
          cycle: cyclePeriod,
          isPast:     cycle.closeDate < tod,
          isToday:    cycle.closeDate.getTime() === tod.getTime(),
          isUpcoming: cycle.closeDate > tod,
        });
      }

      if (cycle.dueDate >= timelineStart && cycle.dueDate <= timelineEnd) {
        result.push({
          date: cycle.dueDate,
          type: 'dueDate',
          cycle: cyclePeriod,
          isPast:     cycle.dueDate < tod,
          isToday:    cycle.dueDate.getTime() === tod.getTime(),
          isUpcoming: cycle.dueDate > tod,
        });
      }
    }

    return result.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Returns all statement cycles between two dates (both inclusive), ordered oldest-first.
   * Reserved for future card lifetime statistics (e.g. total cycles between issue date and expiry).
   *
   * Example:
   *   new StatementCalendar(5, 55).getAllCloseDates(new Date('2023-01-01'), new Date('2027-12-31'))
   *   → [...all monthly cycles where closeDate falls in [2023-01-01, 2027-12-31], oldest first...]
   */
  getAllCloseDates(from: Date, to: Date): StatementCycle[] {
    const cycles = this.getCloseDates({ from, to });
    return cycles.reverse();
  }

  /**
   * Returns the billing period { from, to } for a given closeDate.
   * The cycle opens on the day after the previous closeDate (i.e. statementDay+1 of the
   * previous month) and closes on statementDay of the current month.
   *
   * Example: closeDate=20/2 → { from: 21/1, to: 20/2 }
   */
  private _cyclePeriod(closeDate: Date): { from: Date; to: Date } {
    const from = new Date(closeDate.getFullYear(), closeDate.getMonth() - 1, this.statementDay + 1);
    return { from, to: new Date(closeDate) };
  }

  /** Returns the next statement close date strictly after today. */
  private _nextCloseAfter(today: Date): Date {
    let year = today.getFullYear();
    let month = today.getMonth();
    if (today.getDate() >= this.statementDay) {
      month += 1;
      if (month > 11) { month = 0; year += 1; }
    }
    return new Date(year, month, this.statementDay);
  }
}
