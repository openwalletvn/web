export interface EvalResult {
  run_id: string;
  prompt_version: string;
  model: string;
  judge_model: string;
  test_id: string;
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
  prompt_version: string;
  pass_rate: number;
  avg_score: number;
  total: number;
}
