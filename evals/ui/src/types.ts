export interface EvalResult {
  run_id: string;
  prompt_version: string;
  system_prompt: string;
  triggered_by: string;
  model: string;
  judge_model: string;
  test_id: string;
  test_name: string;
  tags: string[];
  input: string;
  response: string;
  rule_pass: boolean;
  score: number;
  pass: boolean;
  judge_reasoning: string;
  latency_ms: number;
  timestamp: string;
}

export interface RunSummary {
  run_id: string;
  date: string;
  filename: string;
  sha: string;
  download_url: string;
  timestamp: string;
  model: string;
  judge_model: string;
  prompt_version: string;
  triggered_by: string;
  system_prompt: string;
  pass_rate: number;
  avg_score: number;
  total: number;
  passed: number;
  failed: number;
  tags: Record<string, { total: number; passed: number }>;
}
