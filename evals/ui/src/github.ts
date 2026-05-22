import type { EvalResult, RunSummary } from './types';

const EVALS_REPO = 'openwalletvn/evals';
const BASE = `https://api.github.com/repos/${EVALS_REPO}`;

const cache = new Map<string, unknown>();

async function ghFetch<T>(url: string): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  const data = await res.json() as T;
  cache.set(url, data);
  return data;
}

interface GhFile {
  name: string;
  sha: string;
  download_url: string;
  type: string;
}

interface GhDir {
  name: string;
  sha: string;
  type: string;
}

export async function fetchRunsForDate(date: string): Promise<RunSummary[]> {
  let files: GhFile[];
  try {
    files = await ghFetch<GhFile[]>(`${BASE}/contents/results/${date}`);
  } catch {
    return [];
  }

  const jsonlFiles = files.filter((f) => f.name.endsWith('.jsonl') && f.type === 'file');

  const summaries = await Promise.all(
    jsonlFiles.map(async (f): Promise<RunSummary | null> => {
      try {
        const text = await fetch(f.download_url).then((r) => r.text());
        const results = text
          .split('\n')
          .filter(Boolean)
          .map((l) => JSON.parse(l) as EvalResult);

        if (results.length === 0) return null;

        const first = results[0];
        const passed = results.filter((r) => r.pass).length;
        const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);

        return {
          run_id: first.run_id,
          date,
          filename: f.name,
          sha: f.sha,
          download_url: f.download_url,
          timestamp: first.timestamp,
          model: first.model,
          prompt_version: first.prompt_version,
          pass_rate: Math.round((passed / results.length) * 100),
          avg_score: avgScore,
          total: results.length,
        };
      } catch {
        return null;
      }
    }),
  );

  return summaries.filter((s): s is RunSummary => s !== null);
}

export async function fetchAvailableDates(): Promise<string[]> {
  try {
    const dirs = await ghFetch<GhDir[]>(`${BASE}/contents/results`);
    return dirs
      .filter((d) => d.type === 'dir')
      .map((d) => d.name)
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export async function fetchRunDetail(downloadUrl: string): Promise<EvalResult[]> {
  const text = await fetch(downloadUrl).then((r) => r.text());
  return text
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l) as EvalResult);
}
