'use client';

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconBrandDiscord, IconDeviceFloppy, IconCheck, IconSend, IconLock } from '@tabler/icons-react';
import { appDb, type NotificationAdapter } from '@/lib/app-db';
import { testAdapter } from '@/lib/notify-api';
import posthog from 'posthog-js';

export default function NotificationsSettingsPage() {
  const discordAdapter = useLiveQuery(
    () => appDb.notificationAdapters.get('discord'),
    [],
  );
  const [webhookUrl, setWebhookUrl] = useState('');
  const [adapterSaved, setAdapterSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'ok' | 'failed'>('idle');

  useEffect(() => {
    if (discordAdapter?.config?.webhook_url) {
      setWebhookUrl(discordAdapter.config.webhook_url);
    }
  }, [discordAdapter]);

  async function handleSaveAdapter() {
    if (!webhookUrl.trim()) return;
    const adapter: NotificationAdapter = {
      id: 'discord',
      config: { webhook_url: webhookUrl.trim() },
      enabled: true,
      lastStatus: discordAdapter?.lastStatus,
      lastCheckedAt: discordAdapter?.lastCheckedAt,
    };
    await appDb.notificationAdapters.put(adapter);
    setAdapterSaved(true);
    posthog.capture('adapter_saved', { adapter: 'discord' });
    setTimeout(() => setAdapterSaved(false), 2000);
  }

  async function handleTestAdapter() {
    if (!webhookUrl.trim()) return;
    setTestStatus('loading');
    try {
      await testAdapter('discord', webhookUrl.trim());
      setTestStatus('ok');
      await appDb.notificationAdapters.update('discord', {
        lastStatus: 'ok',
        lastCheckedAt: new Date().toISOString(),
      });
      posthog.capture('adapter_tested', { adapter: 'discord', result: 'ok' });
    } catch {
      setTestStatus('failed');
      await appDb.notificationAdapters.update('discord', {
        lastStatus: 'failed',
        lastCheckedAt: new Date().toISOString(),
      });
      posthog.capture('adapter_tested', { adapter: 'discord', result: 'failed' });
    }
    setTimeout(() => setTestStatus('idle'), 3000);
  }

  function formatTime(iso: string) {
    const d = new Date(iso);
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    const MM = (d.getMonth() + 1).toString().padStart(2, '0');
    return `${hh}:${mm} ${dd}/${MM}`;
  }

  return (
    <>
      {/* Discord */}
      <div className="p-4 border border-dashed border-slate-200 rounded-sm mb-3">
        <div className="flex items-center gap-2 mb-3">
          <IconBrandDiscord size={18} className="text-[#5865F2] shrink-0" />
          <span className="text-sm font-medium text-slate-800">Discord</span>
        </div>
        <input
          type="url"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://discord.com/api/webhooks/..."
          className="w-full px-3 py-2 border border-dashed border-slate-300 rounded-sm text-slate-900 focus:outline-none focus:border-brand-blue text-sm mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={handleTestAdapter}
            disabled={!webhookUrl.trim() || testStatus === 'loading'}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 rounded-sm text-sm text-slate-700 hover:border-slate-500 transition-colors disabled:opacity-40"
          >
            <IconSend size={14} />
            {testStatus === 'loading' ? 'Đang gửi...' : testStatus === 'ok' ? 'Thành công!' : testStatus === 'failed' ? 'Thất bại' : 'Test'}
          </button>
          <button
            onClick={handleSaveAdapter}
            disabled={!webhookUrl.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 rounded-sm text-sm text-slate-700 hover:border-slate-500 transition-colors disabled:opacity-40"
          >
            {adapterSaved ? <IconCheck size={14} className="text-green-500" /> : <IconDeviceFloppy size={14} />}
            {adapterSaved ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
        {discordAdapter?.lastCheckedAt && (
          <p className="text-xs mt-3">
            {discordAdapter.lastStatus === 'ok' ? (
              <span className="text-green-600">Gửi thành công lúc {formatTime(discordAdapter.lastCheckedAt)}</span>
            ) : (
              <span className="text-amber-600">Gửi thất bại lúc {formatTime(discordAdapter.lastCheckedAt)}</span>
            )}
          </p>
        )}
      </div>

      {/* Coming soon */}
      {(['Telegram', 'Zalo'] as const).map((name) => (
        <div key={name} className="flex items-center gap-3 p-4 border border-dashed border-slate-100 rounded-sm mb-2 opacity-50">
          <IconLock size={16} className="text-slate-300 shrink-0" />
          <span className="text-sm text-slate-400">{name}</span>
          <span className="ml-auto text-xs text-slate-300">Sắp ra mắt</span>
        </div>
      ))}
    </>
  );
}
