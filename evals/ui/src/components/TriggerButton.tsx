import { useState } from 'react';

export function TriggerButton({ onTriggered }: { onTriggered: () => void }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (window.location.hostname !== 'localhost') return null;

  async function trigger() {
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/server/api/evals/trigger', { method: 'POST' });
      const json = await res.json() as { message?: string };
      setMsg(json.message ?? 'Started');
      setTimeout(onTriggered, 5000);
    } catch (err) {
      setMsg(`Error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button onClick={trigger} disabled={loading} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        {loading ? 'Running...' : 'Run Evals Now'}
      </button>
      {msg && <span style={{ marginLeft: '1rem', color: '#666' }}>{msg}</span>}
    </div>
  );
}
