import { useEffect, useState } from 'react';
import type { EvalResult, RunSummary } from '../types';
import { fetchRunDetail } from '../github';

interface Props {
  runs: RunSummary[];
}

export function PromptCompare({ runs }: Props) {
  const [runAId, setRunAId] = useState('');
  const [runBId, setRunBId] = useState('');
  const [resultsA, setResultsA] = useState<EvalResult[]>([]);
  const [resultsB, setResultsB] = useState<EvalResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runA = runs.find((r) => r.run_id === runAId);
  const runB = runs.find((r) => r.run_id === runBId);

  useEffect(() => {
    if (!runA || !runB) return;
    setLoading(true);
    setError('');
    Promise.all([fetchRunDetail(runA.download_url), fetchRunDetail(runB.download_url)])
      .then(([a, b]) => { setResultsA(a); setResultsB(b); })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [runA?.download_url, runB?.download_url]);

  const testIds = [...new Set([...resultsA.map((r) => r.test_id), ...resultsB.map((r) => r.test_id)])].sort();

  return (
    <div>
      <h3>Compare Runs</h3>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
        <div>
          <label>Run A: </label>
          <select value={runAId} onChange={(e) => setRunAId(e.target.value)}>
            <option value="">— select —</option>
            {runs.map((r) => <option key={r.run_id} value={r.run_id}>{r.run_id.slice(0, 20)} ({r.date})</option>)}
          </select>
        </div>
        <div>
          <label>Run B: </label>
          <select value={runBId} onChange={(e) => setRunBId(e.target.value)}>
            <option value="">— select —</option>
            {runs.map((r) => <option key={r.run_id} value={r.run_id}>{r.run_id.slice(0, 20)} ({r.date})</option>)}
          </select>
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && runA && runB && testIds.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={th}>Test</th>
              <th style={th}>Score A</th>
              <th style={th}>Score B</th>
              <th style={th}>Delta</th>
              <th style={th}>Pass A</th>
              <th style={th}>Pass B</th>
            </tr>
          </thead>
          <tbody>
            {testIds.map((id) => {
              const a = resultsA.find((r) => r.test_id === id);
              const b = resultsB.find((r) => r.test_id === id);
              const scoreA = a?.score ?? 0;
              const scoreB = b?.score ?? 0;
              const delta = scoreB - scoreA;
              return (
                <tr key={id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={td}>{id}</td>
                  <td style={td}>{scoreA}</td>
                  <td style={td}>{scoreB}</td>
                  <td style={{ ...td, color: delta > 0 ? 'green' : delta < 0 ? 'red' : '#999', fontWeight: 'bold' }}>
                    {delta > 0 ? '+' : ''}{delta}
                  </td>
                  <td style={{ ...td, color: a?.pass ? 'green' : 'red' }}>{a?.pass ? 'PASS' : 'FAIL'}</td>
                  <td style={{ ...td, color: b?.pass ? 'green' : 'red' }}>{b?.pass ? 'PASS' : 'FAIL'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' };
const td: React.CSSProperties = { padding: '0.5rem' };
