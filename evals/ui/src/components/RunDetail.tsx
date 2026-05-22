import { useEffect, useState } from 'react';
import type { EvalResult, RunSummary } from '../types';
import { fetchRunDetail } from '../github';

interface Props {
  run: RunSummary;
}

export function RunDetail({ run }: Props) {
  const [results, setResults] = useState<EvalResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchRunDetail(run.download_url)
      .then(setResults)
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [run.download_url]);

  if (loading) return <p>Loading run details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h3>Run: <code>{run.run_id}</code></h3>
      <p style={{ color: '#666', marginTop: 0 }}>
        {new Date(run.timestamp).toLocaleString()} | {run.model} | prompt <code>{run.prompt_version.slice(0, 7)}</code>
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={th}>Test</th>
            <th style={th}>Score</th>
            <th style={th}>Pass</th>
            <th style={th}>Input</th>
            <th style={th}>Response</th>
            <th style={th}>Reasoning</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.test_id} style={{ borderBottom: '1px solid #eee', background: r.pass ? '#f0fff4' : '#fff5f5' }}>
              <td style={td}>{r.test_id}</td>
              <td style={{ ...td, color: r.score >= 60 ? 'green' : 'red', fontWeight: 'bold' }}>{r.score}</td>
              <td style={{ ...td, color: r.pass ? 'green' : 'red' }}>{r.pass ? 'PASS' : 'FAIL'}</td>
              <td style={td} title={r.input}>{r.input.slice(0, 50)}…</td>
              <td style={td} title={r.response}>{r.response.slice(0, 80)}…</td>
              <td style={td}>{r.judge_reasoning.slice(0, 80)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' };
const td: React.CSSProperties = { padding: '0.5rem', verticalAlign: 'top' };
