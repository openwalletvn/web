import { useEffect, useRef, useState } from 'react';

interface CaseDef { id: string; name: string; tags: string[]; }
type Status = 'idle' | 'running' | 'done' | 'error';

interface Props {
  onTriggered: () => void;
  failingCaseIds?: string[];
}

function parseProgress(line: string, setCurrentCase: (s: string) => void, setProgress: React.Dispatch<React.SetStateAction<{ current: number; total: number }>>) {
  const totalMatch = line.match(/Running (\d+) eval cases/);
  if (totalMatch) {
    setProgress((p) => ({ ...p, total: parseInt(totalMatch[1]) }));
  }
  if (line.match(/^\s+\[.+\] \.\.\. $/) || line.match(/^\s+\[.+\] \.\.\.\s*$/)) {
    const m = line.match(/^\s+\[(.+?)\]/);
    if (m) {
      setCurrentCase(m[1]);
      setProgress((p) => ({ ...p, current: Math.min(p.current + 1, p.total) }));
    }
  }
}

export function TriggerButton({ onTriggered, failingCaseIds }: Props) {
  const [cases, setCases] = useState<CaseDef[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [pushToGithub, setPushToGithub] = useState(true);
  const [status, setStatus] = useState<Status>('idle');
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentCase, setCurrentCase] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const logRef = useRef<HTMLPreElement>(null);
  const esRef = useRef<EventSource | null>(null);

  if (window.location.hostname !== 'localhost') return null;

  useEffect(() => {
    fetch('/server/api/evals/cases')
      .then((r) => r.json() as Promise<CaseDef[]>)
      .then(setCases)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => () => { esRef.current?.close(); }, []);

  async function trigger(overrideCaseIds?: string[]) {
    setStatus('running');
    setLogs([]);
    setExitCode(null);
    setCurrentCase('');
    setProgress({ current: 0, total: 0 });

    const caseIds = overrideCaseIds ?? (selectedCaseId ? [selectedCaseId] : undefined);

    try {
      const res = await fetch('/server/api/evals/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'ui', caseIds, pushToGithub }),
      });
      const json = await res.json() as { runId?: string };
      if (!json.runId) {
        setStatus('error');
        setLogs(['Error: server did not return a runId']);
        return;
      }

      const es = new EventSource(`/server/api/evals/stream/${json.runId}`);
      esRef.current = es;

      es.addEventListener('log', (e) => {
        const text = JSON.parse(e.data) as string;
        parseProgress(text, setCurrentCase, setProgress);
        setLogs((prev) => {
          const lines = text.split('\n').filter((l) => l !== '');
          return [...prev, ...lines];
        });
      });

      es.addEventListener('done', (e) => {
        const { code } = JSON.parse(e.data) as { code: number };
        setExitCode(code);
        setStatus(code === 0 ? 'done' : 'error');
        setCurrentCase('');
        es.close();
        if (pushToGithub) onTriggered();
      });

      es.addEventListener('error', () => {
        setStatus('error');
        setLogs((prev) => [...prev, '[stream error — check server console]']);
        es.close();
      });
    } catch (err) {
      setStatus('error');
      setLogs([`Error: ${String(err)}`]);
    }
  }

  const isRunning = status === 'running';
  const selectedCase = cases.find((c) => c.id === selectedCaseId);
  const runLabel = selectedCase
    ? `"${selectedCase.name}"`
    : `all ${cases.length > 0 ? cases.length : '?'} cases`;

  // Group cases by first tag for optgroup
  const tagGroups: Record<string, CaseDef[]> = {};
  for (const c of cases) {
    const tag = c.tags[0] ?? 'other';
    if (!tagGroups[tag]) tagGroups[tag] = [];
    tagGroups[tag].push(c);
  }

  const btn: React.CSSProperties = {
    padding: '0.45rem 1rem',
    border: 'none',
    borderRadius: '6px',
    fontFamily: 'var(--mono)',
    fontSize: '0.82rem',
    cursor: isRunning ? 'not-allowed' : 'pointer',
    letterSpacing: '0.02em',
    fontWeight: 600,
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => trigger()}
          disabled={isRunning}
          title={`Run ${runLabel} against localhost:3000/api/chat`}
          style={{
            ...btn,
            background: isRunning ? '#e5e7eb' : '#111',
            color: isRunning ? 'var(--muted)' : '#fff',
          }}
        >
          {isRunning ? '⏳ Running...' : '▶ Run Evals'}
        </button>

        <select
          value={selectedCaseId}
          onChange={(e) => setSelectedCaseId(e.target.value)}
          disabled={isRunning}
          title="Choose which test cases to run. 'All cases' runs the full suite."
          style={{
            padding: '0.4rem 0.6rem',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontFamily: 'var(--mono)',
            background: '#fff',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            color: '#111',
            maxWidth: '220px',
          }}
        >
          <option value="">All cases ({cases.length})</option>
          {Object.entries(tagGroups).map(([tag, tagCases]) => (
            <optgroup key={tag} label={tag}>
              {tagCases.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
          ))}
        </select>

        {failingCaseIds && failingCaseIds.length > 0 && (
          <button
            onClick={() => trigger(failingCaseIds)}
            disabled={isRunning}
            title={`Re-run the ${failingCaseIds.length} failing case(s) from the selected run`}
            style={{
              ...btn,
              background: '#fef2f2',
              color: 'var(--fail)',
              border: '1px solid #fecaca',
            }}
          >
            ↺ Re-run {failingCaseIds.length} failure{failingCaseIds.length !== 1 ? 's' : ''}
          </button>
        )}

        <label
          title="Uncheck to run locally without saving results to the openwalletvn/evals GitHub repo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '0.8rem',
            color: 'var(--muted)',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={pushToGithub}
            onChange={(e) => setPushToGithub(e.target.checked)}
            disabled={isRunning}
            style={{ cursor: isRunning ? 'not-allowed' : 'pointer' }}
          />
          Push to GitHub
        </label>
      </div>

      {/* Describe what will happen */}
      <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>
        {isRunning ? (
          <span>
            {currentCase
              ? <>Running: <strong style={{ color: '#111' }}>{currentCase}</strong>{progress.total > 0 && ` (${progress.current}/${progress.total})`}</>
              : 'Starting...'}
          </span>
        ) : status === 'done' ? (
          <span style={{ color: 'var(--pass)' }}>
            ✓ Completed{pushToGithub ? ' — results saved to GitHub, list will refresh' : ' — results not saved (push was off)'}
          </span>
        ) : status === 'error' ? (
          <span style={{ color: 'var(--fail)' }}>
            ✗ Run failed (exit {exitCode ?? '?'}) — check terminal output below
          </span>
        ) : (
          <span>
            Will run <strong>{runLabel}</strong> against <code style={{ fontFamily: 'var(--mono)' }}>localhost:3000/api/chat</code>
            {pushToGithub ? ' and save results to GitHub' : ' without saving to GitHub'}
          </span>
        )}
      </div>

      {/* Live terminal output */}
      {logs.length > 0 && (
        <pre
          ref={logRef}
          style={{
            marginTop: '0.75rem',
            background: '#0d1117',
            color: '#c9d1d9',
            fontFamily: 'var(--mono)',
            fontSize: '0.75rem',
            lineHeight: '1.5',
            padding: '0.875rem 1rem',
            borderRadius: '6px',
            maxHeight: '260px',
            overflowY: 'auto',
            margin: '0.75rem 0 0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {logs.join('\n')}
        </pre>
      )}
    </div>
  );
}
