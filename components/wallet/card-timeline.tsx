import React from 'react';
import {cn} from '@/lib/utils';
import type {Milestone, TimelineResult} from '@/lib/card-dates';

/** Formats a date as "D/M" (e.g. "20/2", "6/3"). */
function formatDM(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}`;
}

export function CardTimeline({timeline}: { timeline: TimelineResult }) {
    const {milestones, summary} = timeline;

    const firstUpcomingType = milestones.find((m) => m.isUpcoming)?.type ?? null;
    const todayIsDue = milestones.some((m) => m.isToday && m.type === 'due');

    return (
        <div>
            {/* Horizontal milestone track */}
            <div className="overflow-x-auto">
                <div className="flex items-start">
                    {milestones.map((m, i) => {
                        const isThisToday    = m.isToday;
                        const isThisPast     = m.isPast;

                        const prevMs = i > 0 ? milestones[i - 1] : null;
                        const lineIsPast = prevMs?.isPast === true;

                        return (
                            <React.Fragment key={i}>
                                {i > 0 && (
                                    <div className={cn(
                                        'h-px w-6 shrink-0 mt-2',
                                        lineIsPast ? 'bg-slate-200' : 'bg-brand-blue/30',
                                    )}/>
                                )}
                                <div className="flex flex-col items-center text-center w-[52px] shrink-0">
                                    {/* Dot */}
                                    <div className={cn(
                                        'w-4 h-4 rounded-full shrink-0',
                                        isThisToday ? 'bg-brand-blue ring-2 ring-brand-blue/20' :
                                            isThisPast  ? 'bg-slate-200' :
                                                          'border-2 border-brand-blue bg-white',
                                    )}/>

                                    {/* Date */}
                                    <p className={cn(
                                        'text-[10px] font-medium mt-0.5 leading-tight',
                                        isThisToday ? 'text-brand-blue' :
                                            isThisPast  ? 'text-slate-400' : 'text-slate-700',
                                    )}>
                                        {formatDM(m.date)}
                                    </p>

                                    {/* Message label */}
                                    <p className={cn(
                                        'text-[10px] leading-tight',
                                        isThisToday ? 'text-brand-blue font-semibold' :
                                            isThisPast  ? 'text-slate-400' : 'text-slate-600',
                                    )}>
                                        {m.message}
                                    </p>

                                    {/* Cycle range */}
                                    {m.statement && (
                                        <p className="text-[9px] text-slate-400 leading-tight mt-0.5">
                                            {`kỳ ${formatDM(m.statement.start)}`}
                                            <br/>
                                            {`-${formatDM(m.statement.close)}`}
                                        </p>
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Summary line */}
            {summary && (
                <p className={cn(
                    'text-xs mt-1.5',
                    firstUpcomingType === 'due' || todayIsDue ? 'text-amber-600' : 'text-slate-500',
                )}>
                    {summary}
                </p>
            )}
        </div>
    );
}
