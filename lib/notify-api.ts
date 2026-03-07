const baseUrl = process.env.NEXT_PUBLIC_USER_API_URL ?? 'https://user.openwallet.vn';
const apiKey = process.env.NEXT_PUBLIC_USER_API_KEY ?? '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-OpenWallet-Key': apiKey,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function testAdapter(
  adapter: string,
  credential: string,
): Promise<{ success: boolean; error?: string }> {
  return request('/test', {
    method: 'POST',
    body: JSON.stringify({ adapter, credential }),
  });
}

export interface CreateReminderPayload {
  wallet_id: string;
  adapter: string;
  credential: string;
  /** Day-of-month the statement closes (1–31). The Worker uses this + interest_free_days to compute the real fire date each month. */
  statement_day: number;
  /** 0 for statement reminders; the card's interest_free_days for due-date reminders. */
  interest_free_days: number;
  days_before: number;
  message: string;
}

export function createReminder(payload: CreateReminderPayload): Promise<{ id: string }> {
  return request('/reminders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateReminder(
  id: string,
  payload: { statement_day?: number; interest_free_days?: number; days_before?: number; message?: string },
): Promise<void> {
  return request(`/reminders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteReminder(id: string): Promise<void> {
  return request(`/reminders/${id}`, { method: 'DELETE' });
}

export function getLimit(credentialHash: string): Promise<{ count: number; max: number }> {
  return request(`/limits?credential_hash=${encodeURIComponent(credentialHash)}`, {
    method: 'GET',
  });
}
