import { useEffect, useRef, useState } from 'react';
import type { EvalResult, RunSummary } from '../types';
import { fetchRunDetail } from '../github';

interface Props {
  run: RunSummary;
  onFailingCasesChange: (caseIds: string[]) => void;
}

const REPO_URL = 'https://github.com/openwalletvn/web';

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'var(--pass)' : score >= 60 ? 'var(--warn)' : 'var(--fail)';
  return (
    <span title={`LLM judge score: ${score}/100`} style={{
      background: color,
      color: '#fff',
      borderRadius: '4px',
      padding: '1px 6px',
      fontSize: '0.75rem',
      fontWeight: 700,
      fontFamily: 'var(--mono)',
      cursor: 'default',
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
    <span title="Rule check and LLM judge disagree — investigate this case. Rule may be too strict or judge rubric may be off." style={{
      background: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '4px',
      padding: '1px 6px',
      fontSize: '0.7rem',
      color: '#92400e',
      cursor: 'help',
    }}>
      ⚠ rule/judge disagree
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  }
  return (
    <button
      onClick={copy}
      title="Copy AI response to clipboard"
      style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        fontSize: '0.7rem',
        color: copied ? 'var(--pass)' : 'var(--muted)',
        cursor: 'pointer',
        padding: '1px 6px',
        fontFamily: 'var(--mono)',
      }}
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  );
}

function RerunCaseButton({ caseId, caseName }: { caseId: string; caseName: string }) {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');

  async function rerun() {
    setStatus('running');
    try {
      const res = await fetch('/server/api/evals/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'ui', caseIds: [caseId], pushToGithub: true }),
      });
      const { runId } = await res.json() as { runId?: string };
      if (!runId) { setStatus('error'); return; }

      const es = new EventSource(`/server/api/evals/stream/${runId}`);
      es.addEventListener('done', (e) => {
        const { code } = JSON.parse(e.data) as { code: number };
        setStatus(code === 0 ? 'done' : 'error');
        es.close();
        setTimeout(() => setStatus('idle'), 3000);
      });
      es.addEventListener('error', () => { setStatus('error'); es.close(); });
    } catch {
      setStatus('error');
    }
  }

  if (window.location.hostname !== 'localhost') return null;

  return (
    <button
      onClick={rerun}
      disabled={status === 'running'}
      title={`Re-run only "${caseName}" and save result to GitHub`}
      style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        fontSize: '0.7rem',
        color: status === 'done' ? 'var(--pass)' : status === 'error' ? 'var(--fail)' : 'var(--muted)',
        cursor: status === 'running' ? 'wait' : 'pointer',
        padding: '1px 6px',
        fontFamily: 'var(--mono)',
      }}
    >
      {status === 'idle' ? '↺ re-run' : status === 'running' ? '⏳' : status === 'done' ? '✓ done' : '✗ failed'}
    </button>
  );
}

function TestCaseCard({ r }: { r: EvalResult }) {
  const responseRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{
      border: '1px solid',
      borderColor: r.pass ? '#d1fae5' : '#fee2e2',
      borderLeft: `3px solid ${r.pass ? 'var(--pass)' : 'var(--fail)'}`,
      borderRadius: '8px',
      padding: '0.875rem',
      background: r.pass ? '#f0fdf4' : '#fff5f5',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        <code style={{ fontSize: '0.78rem', color: '#111', fontWeight: 600 }}>{r.test_id}</code>
        <PassFail pass={r.pass} />
        <ScoreBadge score={r.score} />
        <PassFail pass={r.rule_pass} label={`rule: ${r.rule_pass ? 'ok' : 'fail'}`} />
        <DisagreementFlag r={r} />
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span title="Time to get AI response" style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--mono)', cursor: 'default' }}>
            {(r.latency_ms / 1000).toFixed(1)}s
          </span>
          <RerunCaseButton caseId={r.test_id} caseName={r.test_name ?? r.test_id} />
        </span>
        {(r.tags ?? []).map((t) => (
          <span key={t} style={{
            background: '#f3f4f6',
            color: 'var(--muted)',
            borderRadius: '4px',
            padding: '1px 5px',
            fontSize: '0.68rem',
            fontFamily: 'var(--mono)',
          }}>
            {t}
          </span>
        ))}
      </div>

      {/* User input */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 700, marginBottom: '3px', letterSpacing: '0.04em' }}>
          USER INPUT
        </div>
        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '0.45rem 0.7rem',
          fontSize: '0.85rem',
          lineHeight: '1.5',
        }}>
          {r.input}
        </div>
      </div>

      {/* AI response */}
      <details open={!r.pass} style={{ marginBottom: '0.5rem' }}>
        <summary style={{
          fontSize: '0.68rem',
          color: 'var(--muted)',
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: '4px',
          userSelect: 'none',
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span>AI RESPONSE {r.response.length > 0 ? `(${r.response.length} chars)` : '(empty)'}</span>
          {r.response.length > 0 && <CopyButton text={r.response} />}
        </summary>
        <div
          ref={responseRef}
          style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '0.5rem 0.75rem',
            fontSize: '0.85rem',
            lineHeight: '1.65',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '420px',
            overflowY: 'auto',
          }}
        >
          {r.response || <em style={{ color: 'var(--muted)' }}>empty response</em>}
        </div>
      </details>

      {/* Judge reasoning */}
      <div style={{ fontSize: '0.78rem', color: r.score >= 60 ? '#166534' : '#991b1b', lineHeight: 1.4 }}>
        <span style={{ fontWeight: 700 }}>Judge: </span>{r.judge_reasoning}
      </div>
    </div>
  );
}

export function RunDetail({ run, onFailingCasesChange }: Props) {
  const [results, setResults] = useState<EvalResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchRunDetail(run.download_url)
      .then((r) => {
        const sorted = r.sort((a, b) => Number(!a.pass) - Number(!b.pass) || b.score - a.score);
        setResults(sorted);
        const failIds = sorted.filter((x) => !x.pass).map((x) => x.test_id);
        onFailingCasesChange(failIds);
      })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [run.download_url]);

  useEffect(() => () => onFailingCasesChange([]), []);

  if (loading) return <p style={{ color: 'var(--muted)', padding: '1rem 0' }}>Loading run details...</p>;
  if (error) return <p style={{ color: 'var(--fail)' }}>{error}</p>;

  const triggerColors: Record<string, string> = { ui: '#6366f1', cli: '#0891b2', ci: '#7c3aed', unknown: '#9ca3af' };
  const disagreements = results.filter((r) => (r.rule_pass && r.score < 60) || (!r.rule_pass && r.score >= 60));
  const promptBlobUrl = run.prompt_version !== 'unknown'
    ? `${REPO_URL}/blob/${run.prompt_version}/lib/chat/system-prompt.ts`
    : null;

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
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.05em' }}>RUN ID</div>
            <code style={{ fontSize: '0.82rem', fontWeight: 600 }}>{run.run_id}</code>
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
              {run.pass_rate}% — {run.passed}/{run.total} passed
            </span>
            <span title={`Triggered via ${run.triggered_by}`} style={{
              background: triggerColors[run.triggered_by] ?? '#9ca3af',
              color: '#fff',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '0.78rem',
              fontFamily: 'var(--mono)',
              cursor: 'default',
            }}>
              {run.triggered_by}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {([
            ['Time', new Date(run.timestamp).toLocaleString('vi-VN')],
            ['Model', run.model],
            ['Judge model', run.judge_model],
            ['Avg score', String(run.avg_score)],
          ] as [string, string][]).map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.04em' }}>{label.toUpperCase()}</div>
              <div style={{ fontSize: '0.8rem', fontFamily: 'var(--mono)' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Tag breakdown */}
        {Object.keys(run.tags).length > 0 && (
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {Object.entries(run.tags).map(([tag, { total, passed }]) => {
              const rate = Math.round((passed / total) * 100);
              const color = rate === 100 ? 'var(--pass)' : rate === 0 ? 'var(--fail)' : 'var(--warn)';
              return (
                <div key={tag} title={`${tag}: ${passed} passed, ${total - passed} failed`} style={{ cursor: 'default' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 600 }}>{tag}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color, fontFamily: 'var(--mono)' }}>{passed}/{total}</div>
                </div>
              );
            })}
            {disagreements.length > 0 && (
              <div title={`${disagreements.length} case(s) where rule check and LLM judge disagree — worth investigating`} style={{ cursor: 'help' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 600 }}>DISAGREEMENTS</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d97706', fontFamily: 'var(--mono)' }}>⚠ {disagreements.length}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* System prompt */}
      {run.system_prompt && (
        <details style={{ marginBottom: '1rem' }}>
          <summary style={{
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#111',
            padding: '0.4rem 0',
            userSelect: 'none',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span>SYSTEM PROMPT</span>
            <span style={{ fontWeight: 400, color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '0.72rem' }}>
              SHA: {run.prompt_version.slice(0, 7)}
            </span>
            {promptBlobUrl && (
              <a
                href={promptBlobUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="View this exact version of system-prompt.ts on GitHub"
                style={{ fontSize: '0.72rem', color: '#0891b2', textDecoration: 'none', fontWeight: 400 }}
              >
                view on GitHub ↗
              </a>
            )}
          </summary>
          <pre style={{
            background: '#f8f9fa',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '0.875rem 1rem',
            fontSize: '0.78rem',
            fontFamily: 'var(--mono)',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '520px',
            overflowY: 'auto',
            margin: '0.5rem 0 0',
          }}>
            {run.system_prompt}
          </pre>
        </details>
      )}

      {/* Test cases header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111', letterSpacing: '0.05em' }}>
          TEST CASES
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
          {run.failed > 0
            ? <span style={{ color: 'var(--fail)' }}>{run.failed} failed</span>
            : <span style={{ color: 'var(--pass)' }}>all passed</span>}
          {run.failed > 0 && ' — failures shown first'}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {results.map((r) => <TestCaseCard key={r.test_id} r={r} />)}
      </div>
    </div>
  );
}
