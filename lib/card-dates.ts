// TODO: extract to @openwallet/statement-calendar

// ─── Standalone helpers ───────────────────────────────────────────────────────

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

/** Returns the next upcoming payment due Date for a card, or null if data is missing. */
export function getNextDueDate(
  statementDate: number | null | undefined,
  interestFreeDays: number | null | undefined,
  today: Date = new Date(),
): Date | null {
  if (statementDate == null || interestFreeDays == null) return null;
  const tod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return getRelatedStatements(tod, statementDate, interestFreeDays).find((s) => s.due >= tod)?.due ?? null;
}

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single billing cycle with its open, close, and payment due date. */
export interface Statement {
    /** First day of the cycle: statementDay+1 of the month before close. */
    start: Date;
    /** Last day of the cycle (statement close date). */
    close: Date;
    /** Payment due date: start + interestFreeDays. */
    due: Date;
}

export interface Milestone {
    date: Date;
    type: 'start' | 'close' | 'due' | 'today';
    /** Short Vietnamese label for this milestone. */
    message: string;
    /** The billing statement this milestone belongs to; null for 'today'. */
    statement: Statement | null;
    isPast: boolean;
    isToday: boolean;
    isUpcoming: boolean;
}

const MILESTONE_MESSAGES: Record<Milestone['type'], string> = {
    start:  'Kỳ sao kê mới',
    close:  'Chốt sao kê',
    due:    'Hạn thanh toán',
    today:  'Hôm nay',
};

// ─── Core pure functions ──────────────────────────────────────────────────────

/**
 * Returns the billing statement for the month at offset `refMonth` from `date`.
 *
 * - resultMonth = date.month + refMonth  (wraps across year boundaries)
 * - close = statementDay / resultMonth
 * - start = (statementDay+1) / (resultMonth − 1)
 * - due   = start + interestFreeDays days
 *
 * Example (statementDay=20, interestFreeDays=45):
 *   getStatementObject(new Date('2026-03-07'), 0, 20, 45)
 *   → { start: 2026-02-21, close: 2026-03-20, due: 2026-04-07 }
 */
export function getStatementObject(
    date: Date,
    refMonth: number,
    statementDay: number,
    interestFreeDays: number,
): Statement {
    const baseYear = date.getFullYear();

    // Compute close month, normalising over- and underflow
    let closeMonthIdx = date.getMonth() + refMonth;
    const closeYear = baseYear + Math.floor(closeMonthIdx / 12);
    closeMonthIdx = ((closeMonthIdx % 12) + 12) % 12;

    const close = new Date(closeYear, closeMonthIdx, statementDay);

    // start = statementDay+1 of the month before close
    let startMonthIdx = closeMonthIdx - 1;
    let startYear = closeYear;
    if (startMonthIdx < 0) {
        startMonthIdx = 11;
        startYear--;
    }
    const start = new Date(startYear, startMonthIdx, statementDay + 1);

    const due = new Date(start);
    due.setDate(due.getDate() + interestFreeDays);

    return {start, close, due};
}

/**
 * Returns [A, B, C]: the billing statements for today's month −1, 0, +1.
 *
 * Example (statementDay=20, interestFreeDays=45, today=2026-03-07):
 *   A → { start: 2026-01-21, close: 2026-02-20, due: 2026-03-07 }
 *   B → { start: 2026-02-21, close: 2026-03-20, due: 2026-04-07 }
 *   C → { start: 2026-03-21, close: 2026-04-20, due: 2026-05-05 }
 */
export function getRelatedStatements(
    today: Date,
    statementDay: number,
    interestFreeDays: number,
): [Statement, Statement, Statement] {
    return [
        getStatementObject(today, -1, statementDay, interestFreeDays),
        getStatementObject(today, 0, statementDay, interestFreeDays),
        getStatementObject(today, +1, statementDay, interestFreeDays),
    ];
}

/**
 * Flattens all start/close/due dates from the given statements into a single
 * chronologically sorted array of Milestones, with a 'today' marker inserted
 * only when no real milestone already falls on today's date.
 *
 * When a real milestone coincides with today its `isToday` flag is set to true
 * and it serves as the timeline anchor — no separate 'today' node is added.
 */
export function getMilestones(statements: Statement[], today: Date): Milestone[] {
    const tod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const items: Milestone[] = [];

    for (const stmt of statements) {
        for (const [type, raw] of [
            ['start', stmt.start],
            ['close', stmt.close],
            ['due', stmt.due],
        ] as const) {
            const d = new Date(raw.getFullYear(), raw.getMonth(), raw.getDate());
            items.push({
                date:       d,
                type,
                message:    MILESTONE_MESSAGES[type],
                statement:  stmt,
                isPast:     d < tod,
                isToday:    d.getTime() === tod.getTime(),
                isUpcoming: d > tod,
            });
        }
    }

    // Only add a 'today' marker when no real milestone already lands on today
    const hasRealTodayMilestone = items.some((m) => m.isToday);
    if (!hasRealTodayMilestone) {
        items.push({
            date:       tod,
            type:       'today',
            message:    MILESTONE_MESSAGES.today,
            statement:  null,
            isPast:     false,
            isToday:    true,
            isUpcoming: false,
        });
    }

    // On equal dates: due → close → start → today-marker
    const TYPE_RANK: Record<Milestone['type'], number> = { due: 0, close: 1, start: 2, today: 3 };
    return items.sort((a, b) =>
        a.date.getTime() - b.date.getTime() || TYPE_RANK[a.type] - TYPE_RANK[b.type],
    );
}

/**
 * Returns the display subset of milestones anchored on today.
 *
 * Walk backward from today (newest-first): collect milestones into the backward
 * list until a type already collected would repeat, then stop.
 * Walk forward (oldest-first): same rule.
 *
 * Returns: backward (oldest-first) + today + forward
 *
 * Example (statementDay=20, interestFreeDays=45, today=2026-03-07):
 *   A = { start:21/1, close:20/2, due:7/3 }
 *   B = { start:21/2, close:20/3, due:7/4 }
 *   C = { start:21/3, close:20/4, due:5/5 }
 *
 *   backward (types: close, start) → [20/2(close,A), 21/2(start,B)]
 *   today                          →  7/3
 *   forward  (types: close, start, due) → [20/3(close,B), 21/3(start,C), 7/4(due,B)]
 *
 *   Result: [20/2, 21/2, TODAY, 20/3, 21/3, 7/4]
 */
export function getDisplayMilestones(milestones: Milestone[]): Milestone[] {
    const todayMs = milestones.find((m) => m.isToday);
    if (!todayMs) return [];

    function collect(items: Milestone[]): Milestone[] {
        const seen = new Set<string>();
        const out: Milestone[] = [];
        for (const m of items) {
            if (seen.has(m.type)) break;
            seen.add(m.type);
            out.push(m);
    }
        return out;
    }

    const backward = collect(
        milestones
            .filter((m) => m.isPast)
            .sort((a, b) => b.date.getTime() - a.date.getTime()), // newest-first for collection
    ).reverse(); // restore oldest-first for display

    const forward = collect(
        milestones
            .filter((m) => m.isUpcoming)
            .sort((a, b) => a.date.getTime() - b.date.getTime()),
    );

    return [...backward, todayMs, ...forward];
}

// ─── Convenience ──────────────────────────────────────────────────────────────

export interface TimelineResult {
    milestones: Milestone[];
    /** One-line summary of the next upcoming event, e.g. "⚠ Hạn thanh toán tiếp theo: 7/4 (còn 30 ngày)". Null when nothing is upcoming. */
    summary: string | null;
}

function formatDM(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}`;
}

/**
 * Returns the display-ready timeline and a human-readable summary for a card.
 * Chains: getRelatedStatements → getMilestones → getDisplayMilestones.
 */
export function getTimelineForCard(
    statementDay: number,
    interestFreeDays: number,
    today: Date = new Date(),
): TimelineResult {
    const tod = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const stmts = getRelatedStatements(tod, statementDay, interestFreeDays);
    const milestones = getDisplayMilestones(getMilestones(stmts, tod));

    // A non-'today' milestone coinciding with today takes priority over upcoming ones
    const todayMilestone  = milestones.find((m) => m.isToday && m.type !== 'today') ?? null;
    const firstUpcoming   = milestones.find((m) => m.isUpcoming) ?? null;
    let summary: string | null = null;

    if (todayMilestone) {
        if (todayMilestone.type === 'close') {
            summary = `📅 Hôm nay là ngày chốt sao kê`;
        } else if (todayMilestone.type === 'due') {
            summary = `⚠ Hôm nay là hạn thanh toán`;
        } else {
            summary = `📋 Hôm nay bắt đầu kỳ mới`;
        }
    } else if (firstUpcoming) {
        const daysToNext = Math.round((firstUpcoming.date.getTime() - tod.getTime()) / 86_400_000);
        const dateStr = `${formatDM(firstUpcoming.date)} (còn ${daysToNext} ngày)`;
        if (firstUpcoming.type === 'close') {
            summary = `📅 Ngày chốt sao kê tiếp theo: ${dateStr}`;
        } else if (firstUpcoming.type === 'due') {
            summary = `⚠ Hạn thanh toán tiếp theo: ${dateStr}`;
        } else {
            summary = `📋 Kỳ mới bắt đầu: ${dateStr}`;
        }
    }

    return { milestones, summary };
}
