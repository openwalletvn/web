import { useEffect, useState } from 'react';
import type { RunSummary } from '../types';
import { fetchAvailableDates, fetchRunsForDate } from '../github';

interface Props {
  onSelectRun: (run: RunSummary) => void;
  selectedRunId?: string;
  refreshKey: number;
}

function PassBadge({ rate }: { rate: number }) {
  const color = rate >= 80 ? 'var(--pass)' : rate >= 60 ? 'var(--warn)' : 'var(--fail)';
  return (
    <span style={{
      background: color,
      color: '#fff',
      borderRadius: '4px',
      padding: '1px 6px',
      fontSize: '0.75rem',
      fontWeight: 700,
      fontFamily: 'var(--mono)',
    }}>
      {rate}%
    </span>
  );
}

function TriggerBadge({ source }: { source: string }) {
  const colors: Record<string, string> = {
    ui: '#6366f1',
    cli: '#0891b2',
    ci: '#7c3aed',
    unknown: '#9ca3af',
  };
  return (
    <span style={{
      background: colors[source] ?? '#9ca3af',
      color: '#fff',
      borderRadius: '4px',
      padding: '1px 5px',
      fontSize: '0.7rem',
      fontFamily: 'var(--mono)',
      letterSpacing: '0.03em',
    }}>
      {source}
    </span>
  );
}

function TagSummary({ tags }: { tags: Record<string, { total: number; passed: number }> }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
      {Object.entries(tags).map(([tag, { total, passed }]) => {
        const rate = Math.round((passed / total) * 100);
        const color = rate === 100 ? 'var(--pass)' : rate === 0 ? 'var(--fail)' : 'var(--warn)';
        return (
          <span key={tag} style={{ fontSize: '0.7rem', color, fontFamily: 'var(--mono)' }}>
            {tag} {passed}/{total}
          </span>
        );
      })}
    </div>
  );
}

export function RunList({ onSelectRun, selectedRunId, refreshKey }: Props) {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  if (error) return <p style={{ color: 'var(--fail)', fontSize: '0.85rem' }}>{error}</p>;

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {dates.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            style={{
              padding: '3px 10px',
              border: '1px solid',
              borderColor: d === selectedDate ? '#111' : 'var(--border)',
              borderRadius: '20px',
              background: d === selectedDate ? '#111' : 'transparent',
              color: d === selectedDate ? '#fff' : 'var(--muted)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              fontFamily: 'var(--mono)',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Loading runs...</p>}
      {!loading && runs.length === 0 && (
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No runs found for {selectedDate}.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {runs.map((run) => {
          const selected = run.run_id === selectedRunId;
          return (
            <div
              key={run.run_id}
              onClick={() => onSelectRun(run)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: selected ? '#111' : 'var(--border)',
                borderLeft: `3px solid ${run.pass_rate >= 80 ? 'var(--pass)' : run.pass_rate >= 60 ? 'var(--warn)' : 'var(--fail)'}`,
                background: selected ? '#f8f9ff' : '#fff',
                cursor: 'pointer',
                transition: 'border-color 0.1s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <code style={{ fontSize: '0.8rem', color: '#111' }}>
                  {run.run_id.slice(0, 13)}
                </code>
                <PassBadge rate={run.pass_rate} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  {new Date(run.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <TriggerBadge source={run.triggered_by} />
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                  prompt:{run.prompt_version.slice(0, 7)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                  {run.passed}/{run.total}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  avg {run.avg_score}
                </span>
              </div>

              {Object.keys(run.tags).length > 0 && <TagSummary tags={run.tags} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
