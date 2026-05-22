import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'running' | 'done' | 'error';

interface Props {
  onTriggered: () => void;
}

export function TriggerButton({ onTriggered }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLPreElement>(null);
  const esRef = useRef<EventSource | null>(null);

  if (window.location.hostname !== 'localhost') return null;

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    return () => { esRef.current?.close(); };
  }, []);

  async function trigger() {
    setStatus('running');
    setLogs([]);
    setExitCode(null);

    try {
      const res = await fetch('/server/api/evals/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'ui' }),
      });
      const json = await res.json() as { runId?: string; ok?: boolean };

      if (!json.runId) {
        setStatus('error');
        setLogs(['Error: no runId returned from server']);
        return;
      }

      const es = new EventSource(`/server/api/evals/stream/${json.runId}`);
      esRef.current = es;

      es.addEventListener('log', (e) => {
        const text = JSON.parse(e.data) as string;
        setLogs((prev) => {
          const lines = text.split('\n');
          return [...prev, ...lines.filter((l) => l !== '')];
        });
      });

      es.addEventListener('done', (e) => {
        const { code } = JSON.parse(e.data) as { code: number };
        setExitCode(code);
        setStatus(code === 0 ? 'done' : 'error');
        es.close();
        onTriggered();
      });

      es.addEventListener('error', () => {
        setStatus('error');
        setLogs((prev) => [...prev, '[stream error — check server logs]']);
        es.close();
      });
    } catch (err) {
      setStatus('error');
      setLogs([`Error: ${String(err)}`]);
    }
  }

  const btnLabel = status === 'running' ? '⏳ Running...' : '▶ Run Evals';
  const statusColor = status === 'done' ? 'var(--pass)' : status === 'error' ? 'var(--fail)' : 'var(--muted)';

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        <button
          onClick={trigger}
          disabled={status === 'running'}
          style={{
            padding: '0.5rem 1.25rem',
            background: status === 'running' ? '#e5e7eb' : '#111',
            color: status === 'running' ? 'var(--muted)' : '#fff',
            border: 'none',
            borderRadius: '6px',
            fontFamily: 'var(--mono)',
            fontSize: '0.85rem',
            cursor: status === 'running' ? 'not-allowed' : 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          {btnLabel}
        </button>

        {status !== 'idle' && (
          <span style={{ fontSize: '0.8rem', color: statusColor, fontFamily: 'var(--mono)' }}>
            {status === 'running' && 'streaming output...'}
            {status === 'done' && `completed (exit 0) — results pushed to GitHub`}
            {status === 'error' && `failed (exit ${exitCode ?? '?'})`}
          </span>
        )}
      </div>

      {logs.length > 0 && (
        <pre
          ref={logRef}
          style={{
            background: '#0d1117',
            color: '#c9d1d9',
            fontFamily: 'var(--mono)',
            fontSize: '0.78rem',
            lineHeight: '1.5',
            padding: '1rem',
            borderRadius: '6px',
            maxHeight: '280px',
            overflowY: 'auto',
            margin: 0,
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
