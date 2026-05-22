import { useState } from 'react';
import type { RunSummary } from '../types';
import { RunList } from '../components/RunList';
import { RunDetail } from '../components/RunDetail';
import { PromptCompare } from '../components/PromptCompare';
import { TriggerButton } from '../components/TriggerButton';

type Tab = 'runs' | 'compare';

export function EvalsPage() {
  const [tab, setTab] = useState<Tab>('runs');
  const [selectedRun, setSelectedRun] = useState<RunSummary | null>(null);
  const [allRuns, setAllRuns] = useState<RunSummary[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSelectRun(run: RunSummary) {
    setSelectedRun(run);
    if (!allRuns.find((r) => r.run_id === run.run_id)) {
      setAllRuns((prev) => [...prev, run]);
    }
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    border: 'none',
    borderBottom: active ? '2px solid #0070f3' : '2px solid transparent',
    background: 'none',
    fontWeight: active ? 'bold' : 'normal',
    color: active ? '#0070f3' : '#333',
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Eval Runs</h1>
      <TriggerButton onTriggered={() => setRefreshKey((k) => k + 1)} />
      <div style={{ borderBottom: '1px solid #eee', marginBottom: '1.5rem' }}>
        <button style={tabStyle(tab === 'runs')} onClick={() => setTab('runs')}>Runs</button>
        <button style={tabStyle(tab === 'compare')} onClick={() => setTab('compare')}>Compare</button>
      </div>

      {tab === 'runs' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedRun ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          <RunList
            onSelectRun={handleSelectRun}
            selectedRunId={selectedRun?.run_id}
            refreshKey={refreshKey}
          />
          {selectedRun && <RunDetail run={selectedRun} />}
        </div>
      )}

      {tab === 'compare' && <PromptCompare runs={allRuns} />}
    </div>
  );
}
