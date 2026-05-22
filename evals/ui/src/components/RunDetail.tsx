import { useEffect, useState } from 'react';
import type { EvalResult, RunSummary } from '../types';
import { fetchRunDetail } from '../github';

interface Props {
  run: RunSummary;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'var(--pass)' : score >= 60 ? 'var(--warn)' : 'var(--fail)';
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
      {score}
    </span>
  );
}

function PassFail({ pass, label }: { pass: boolean; label?: string }) {
  return (
    <span style={{
      color: pass ? 'var(--pass)' : 'var(--fail)',
      fontWeight: 700,
      fontFamily: 'var(--mono)',
      fontSize: '0.78rem',
    }}>
      {pass ? '✓' : '✗'} {label ?? (pass ? 'PASS' : 'FAIL')}
    </span>
  );
}

function DisagreementFlag({ r }: { r: EvalResult }) {
  const disagrees = (r.rule_pass && r.score < 60) || (!r.rule_pass && r.score >= 60);
  if (!disagrees) return null;
  return (
    <span title="Rule check and LLM judge disagree — worth investigating" style={{
      background: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '4px',
      padding: '1px 6px',
      fontSize: '0.7rem',
      color: '#92400e',
    }}>
      ⚠ judge/rule disagree
    </span>
  );
}

function TestCaseCard({ r }: { r: EvalResult }) {
  return (
    <div style={{
      border: '1px solid',
      borderColor: r.pass ? '#d1fae5' : '#fee2e2',
      borderLeft: `3px solid ${r.pass ? 'var(--pass)' : 'var(--fail)'}`,
      borderRadius: '8px',
      padding: '1rem',
      background: r.pass ? '#f0fdf4' : '#fff5f5',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <code style={{ fontSize: '0.8rem', color: '#111', fontWeight: 600 }}>{r.test_id}</code>
        <PassFail pass={r.pass} />
        <ScoreBadge score={r.score} />
        <PassFail pass={r.rule_pass} label={`rule: ${r.rule_pass ? 'pass' : 'fail'}`} />
        <DisagreementFlag r={r} />
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
          {(r.latency_ms / 1000).toFixed(1)}s
        </span>
        {(r.tags ?? []).map((t) => (
          <span key={t} style={{
            background: '#f3f4f6',
            color: 'var(--muted)',
            borderRadius: '4px',
            padding: '1px 6px',
            fontSize: '0.7rem',
            fontFamily: 'var(--mono)',
          }}>
            {t}
          </span>
        ))}
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, marginBottom: '2px' }}>USER INPUT</div>
        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '0.5rem 0.75rem',
          fontSize: '0.85rem',
          lineHeight: '1.5',
        }}>
          {r.input}
        </div>
      </div>

      <details open={!r.pass} style={{ marginBottom: '0.5rem' }}>
        <summary style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, cursor: 'pointer', marginBottom: '4px', userSelect: 'none' }}>
          AI RESPONSE {r.response.length > 0 ? `(${r.response.length} chars)` : '(empty)'}
        </summary>
        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '0.5rem 0.75rem',
          fontSize: '0.85rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          {r.response || <em style={{ color: 'var(--muted)' }}>empty response</em>}
        </div>
      </details>

      <div style={{ fontSize: '0.75rem', color: r.score >= 60 ? 'var(--pass)' : 'var(--fail)' }}>
        <strong>Judge:</strong> {r.judge_reasoning}
      </div>
    </div>
  );
}

export function RunDetail({ run }: Props) {
  const [results, setResults] = useState<EvalResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchRunDetail(run.download_url)
      .then((r) => setResults(r.sort((a, b) => Number(b.pass === false) - Number(a.pass === false) || b.score - a.score))
      )
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [run.download_url]);

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading run details...</p>;
  if (error) return <p style={{ color: 'var(--fail)' }}>{error}</p>;

  const triggerColors: Record<string, string> = { ui: '#6366f1', cli: '#0891b2', ci: '#7c3aed', unknown: '#9ca3af' };

  return (
    <div>
      {/* Run header */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '2px' }}>RUN</div>
            <code style={{ fontSize: '0.85rem', fontWeight: 600 }}>{run.run_id}</code>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              background: run.pass_rate >= 80 ? 'var(--pass)' : run.pass_rate >= 60 ? 'var(--warn)' : 'var(--fail)',
              color: '#fff',
              borderRadius: '6px',
              padding: '3px 10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              fontFamily: 'var(--mono)',
            }}>
              {run.pass_rate}% ({run.passed}/{run.total})
            </span>
            <span style={{
              background: triggerColors[run.triggered_by] ?? '#9ca3af',
              color: '#fff',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '0.78rem',
              fontFamily: 'var(--mono)',
            }}>
              {run.triggered_by}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {[
            ['Time', new Date(run.timestamp).toLocaleString('vi-VN')],
            ['Model', run.model],
            ['Judge', run.judge_model],
            ['Avg score', String(run.avg_score)],
            ['Prompt SHA', run.prompt_version.slice(0, 7)],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '0.8rem', fontFamily: 'var(--mono)' }}>{value}</div>
            </div>
          ))}
        </div>

        {Object.keys(run.tags).length > 0 && (
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {Object.entries(run.tags).map(([tag, { total, passed }]) => {
              const rate = Math.round((passed / total) * 100);
              const color = rate === 100 ? 'var(--pass)' : rate === 0 ? 'var(--fail)' : 'var(--warn)';
              return (
                <div key={tag} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{tag}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color }}>{passed}/{total}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* System prompt */}
      {run.system_prompt && (
        <details style={{ marginBottom: '1rem' }}>
          <summary style={{
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#111',
            padding: '0.5rem 0',
            userSelect: 'none',
            letterSpacing: '0.05em',
          }}>
            SYSTEM PROMPT — prompt:{run.prompt_version.slice(0, 7)}
          </summary>
          <pre style={{
            background: '#f8f9fa',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '1rem',
            fontSize: '0.78rem',
            fontFamily: 'var(--mono)',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '500px',
            overflowY: 'auto',
            margin: '0.5rem 0 0',
          }}>
            {run.system_prompt}
          </pre>
        </details>
      )}

      {/* Test cases */}
      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
        TEST CASES — {run.failed > 0 ? `${run.failed} failed first` : 'all passed'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {results.map((r) => <TestCaseCard key={r.test_id} r={r} />)}
      </div>
    </div>
  );
}
