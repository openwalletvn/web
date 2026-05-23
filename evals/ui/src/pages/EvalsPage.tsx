import { useState } from 'react';
import type { RunSummary } from '../types';
import { RunList } from '../components/RunList';
import { RunDetail } from '../components/RunDetail';
import { TriggerButton } from '../components/TriggerButton';
import { clearCacheForDate } from '../github';

export function EvalsPage() {
  const [selectedRun, setSelectedRun] = useState<RunSummary | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [failingCaseIds, setFailingCaseIds] = useState<string[]>([]);

  async function handleDeleteRun(run: RunSummary) {
    const res = await fetch('/server/api/evals/run', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sha: run.sha, filename: run.filename, date: run.date, run_id: run.run_id }),
    });
    const json = await res.json() as { ok: boolean };
    if (json.ok) {
      clearCacheForDate(run.date);
      if (selectedRun?.run_id === run.run_id) setSelectedRun(null);
      setRefreshKey((k) => k + 1);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        background: '#fff',
        padding: '1rem 2rem',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Chat Eval Runs
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              system prompt audit — openwalletvn/evals
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem' }}>
        {/* Trigger section (localhost only) */}
        <TriggerButton
          onTriggered={() => setRefreshKey((k) => k + 1)}
          failingCaseIds={failingCaseIds}
        />

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedRun ? '340px 1fr' : '340px',
          gap: '1.5rem',
          alignItems: 'start',
        }}>
          <RunList
            onSelectRun={setSelectedRun}
            onDeleteRun={handleDeleteRun}
            selectedRunId={selectedRun?.run_id}
            refreshKey={refreshKey}
          />
          {selectedRun && (
            <RunDetail
              run={selectedRun}
              onFailingCasesChange={setFailingCaseIds}
            />
          )}
        </div>

        {!selectedRun && (
          <div style={{
            color: 'var(--muted)',
            fontSize: '0.85rem',
            marginTop: '2rem',
            paddingLeft: '360px',
          }}>
            Select a run to view system prompt and test results.
          </div>
        )}
      </div>
    </div>
  );
}
