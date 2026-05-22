import { useEffect, useState } from 'react';
import type { RunSummary } from '../types';
import { fetchAvailableDates, fetchRunsForDate } from '../github';

interface Props {
  onSelectRun: (run: RunSummary) => void;
  selectedRunId?: string;
  refreshKey: number;
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

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Date: </label>
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          {dates.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      {loading && <p>Loading runs...</p>}
      {!loading && runs.length === 0 && <p>No runs found for {selectedDate}.</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={th}>Run ID</th>
            <th style={th}>Time</th>
            <th style={th}>Model</th>
            <th style={th}>Prompt</th>
            <th style={th}>Pass %</th>
            <th style={th}>Avg Score</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr
              key={run.run_id}
              onClick={() => onSelectRun(run)}
              style={{
                cursor: 'pointer',
                background: run.run_id === selectedRunId ? '#e8f0fe' : 'white',
                borderBottom: '1px solid #eee',
              }}
            >
              <td style={td}><code>{run.run_id.slice(0, 20)}</code></td>
              <td style={td}>{new Date(run.timestamp).toLocaleTimeString()}</td>
              <td style={td}>{run.model}</td>
              <td style={td}><code>{run.prompt_version.slice(0, 7)}</code></td>
              <td style={{ ...td, color: run.pass_rate >= 80 ? 'green' : 'red' }}>{run.pass_rate}%</td>
              <td style={td}>{run.avg_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' };
const td: React.CSSProperties = { padding: '0.5rem' };
