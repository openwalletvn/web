import { useEffect, useState } from 'react';
import type { RunSummary } from '../types';
import { fetchAvailableDates, fetchRunsForDate } from '../github';

interface Props {
  onSelectRun: (run: RunSummary) => void;
  onDeleteRun: (run: RunSummary) => void;
  selectedRunId?: string;
  refreshKey: number;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

function PassBadge({ rate, total, passed }: { rate: number; total: number; passed: number }) {
  const color = rate >= 80 ? 'var(--pass)' : rate >= 60 ? 'var(--warn)' : 'var(--fail)';
  return (
    <span title={`${passed} passed / ${total - passed} failed`} style={{
      background: color,
      color: '#fff',
      borderRadius: '4px',
      padding: '1px 7px',
      fontSize: '0.75rem',
      fontWeight: 700,
      fontFamily: 'var(--mono)',
      cursor: 'default',
    }}>
      {passed}/{total}
    </span>
  );
}

function TriggerBadge({ source }: { source: string }) {
  const labels: Record<string, string> = {
    ui: 'UI button',
    cli: 'CLI command',
    ci: 'CI/CD pipeline',
    unknown: 'unknown',
  };
  const colors: Record<string, string> = {
    ui: '#6366f1',
    cli: '#0891b2',
    ci: '#7c3aed',
    unknown: '#9ca3af',
  };
  return (
    <span title={`Triggered via ${labels[source] ?? source}`} style={{
      background: colors[source] ?? '#9ca3af',
      color: '#fff',
      borderRadius: '4px',
      padding: '1px 5px',
      fontSize: '0.7rem',
      fontFamily: 'var(--mono)',
      letterSpacing: '0.03em',
      cursor: 'default',
    }}>
      {source}
    </span>
  );
}

function ScoreTrend({ score, prevScore }: { score: number; prevScore?: number }) {
  if (prevScore === undefined) return null;
  const delta = score - prevScore;
  if (delta === 0) return null;
  const color = delta > 0 ? 'var(--pass)' : 'var(--fail)';
  return (
    <span title={`Avg score changed by ${delta > 0 ? '+' : ''}${delta} vs previous run`} style={{
      fontSize: '0.72rem',
      color,
      fontFamily: 'var(--mono)',
      cursor: 'default',
    }}>
      {delta > 0 ? '↑' : '↓'}{Math.abs(delta)}
    </span>
  );
}

function TagSummary({ tags }: { tags: Record<string, { total: number; passed: number }> }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
      {Object.entries(tags).map(([tag, { total, passed }]) => {
        const rate = Math.round((passed / total) * 100);
        const color = rate === 100 ? 'var(--pass)' : rate === 0 ? 'var(--fail)' : 'var(--warn)';
        return (
          <span key={tag} title={`${tag}: ${passed}/${total} passed`} style={{
            fontSize: '0.7rem',
            color,
            fontFamily: 'var(--mono)',
            cursor: 'default',
          }}>
            {tag} {passed}/{total}
          </span>
        );
      })}
    </div>
  );
}

export function RunList({ onSelectRun, onDeleteRun, selectedRunId, refreshKey }: Props) {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    fetchAvailableDates()
      .then((d) => {
        setDates(d);
        if (d.length > 0 && !selectedDate) setSelectedDate(d[0]);
      })
      .catch((e: unknown) => setError(String(e)));
  }, [refreshKey]);

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    setError('');
    fetchRunsForDate(selectedDate)
      .then((r) => setRuns(r.sort((a, b) => b.timestamp.localeCompare(a.timestamp))))
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [selectedDate, refreshKey]);

  async function handleDelete(e: React.MouseEvent, run: RunSummary) {
    e.stopPropagation();
    if (!window.confirm(`Delete run "${run.run_id}" from GitHub?\n\nThis cannot be undone.`)) return;
    setDeletingId(run.run_id);
    try {
      await onDeleteRun(run);
    } finally {
      setDeletingId('');
    }
  }

  if (error) return <p style={{ color: 'var(--fail)', fontSize: '0.85rem' }}>{error}</p>;

  return (
    <div>
      {/* Section label */}
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
        EVAL RUNS
      </div>

      {/* Date pill tabs */}
      <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {dates.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            title={d}
            style={{
              padding: '2px 10px',
              border: '1px solid',
              borderColor: d === selectedDate ? '#111' : 'var(--border)',
              borderRadius: '20px',
              background: d === selectedDate ? '#111' : 'transparent',
              color: d === selectedDate ? '#fff' : 'var(--muted)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontFamily: 'var(--mono)',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: '0.5rem 0' }}>Loading runs...</p>
      )}
      {!loading && runs.length === 0 && selectedDate && (
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: '0.5rem 0' }}>
          No runs found for {selectedDate}.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {runs.map((run, i) => {
          const selected = run.run_id === selectedRunId;
          const deleting = deletingId === run.run_id;
          const prevRun = runs[i + 1];
          const borderColor = run.pass_rate >= 80 ? 'var(--pass)' : run.pass_rate >= 60 ? 'var(--warn)' : 'var(--fail)';

          return (
            <div
              key={run.run_id}
              onClick={() => !deleting && onSelectRun(run)}
              title={selected ? 'Currently inspecting this run' : 'Click to inspect this run'}
              style={{
                padding: '0.7rem 0.875rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selected ? '#111' : 'var(--border)',
                borderLeft: `3px solid ${deleting ? '#9ca3af' : borderColor}`,
                background: deleting ? '#f9fafb' : selected ? '#f8f9ff' : '#fff',
                cursor: deleting ? 'wait' : 'pointer',
                opacity: deleting ? 0.6 : 1,
                transition: 'border-color 0.1s, opacity 0.15s',
                position: 'relative',
              }}
            >
              {/* Top row: id + pass badge + delete */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.4rem' }}>
                <code style={{ fontSize: '0.78rem', color: '#111', flexShrink: 0 }}>
                  {run.run_id.slice(0, 13)}
                </code>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <PassBadge rate={run.pass_rate} total={run.total} passed={run.passed} />
                  <button
                    onClick={(e) => handleDelete(e, run)}
                    disabled={deleting}
                    title="Delete this run from the GitHub evals repo"
                    style={{
                      background: 'transparent',
                      border: '1px solid transparent',
                      borderRadius: '4px',
                      color: '#9ca3af',
                      cursor: deleting ? 'wait' : 'pointer',
                      fontSize: '0.75rem',
                      lineHeight: 1,
                      padding: '1px 4px',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--fail)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--fail)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; }}
                  >
                    {deleting ? '…' : '✕'}
                  </button>
                </div>
              </div>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                <span
                  title={new Date(run.timestamp).toLocaleString('vi-VN')}
                  style={{ fontSize: '0.72rem', color: 'var(--muted)', cursor: 'default' }}
                >
                  {timeAgo(run.timestamp)}
                </span>
                <TriggerBadge source={run.triggered_by} />
                <span title={`Prompt SHA: ${run.prompt_version}`} style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--mono)', cursor: 'default' }}>
                  {run.prompt_version.slice(0, 7)}
                </span>
                <span title="Average judge score (1–100)" style={{ fontSize: '0.72rem', color: 'var(--muted)', cursor: 'default' }}>
                  avg {run.avg_score}
                </span>
                <ScoreTrend score={run.avg_score} prevScore={prevRun?.avg_score} />
              </div>

              {/* Tag summary */}
              {Object.keys(run.tags).length > 0 && <TagSummary tags={run.tags} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
