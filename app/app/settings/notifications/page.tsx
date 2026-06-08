'use client';

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconBrandDiscord, IconDeviceFloppy, IconCheck, IconLock } from '@tabler/icons-react';
import { appDb, type NotificationAdapter } from '@/lib/app-db';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import posthog from 'posthog-js';

const DAYS_OPTIONS = [
  { value: 0, label: 'Đúng ngày' },
  { value: 1, label: '1 ngày trước' },
  { value: 2, label: '2 ngày trước' },
  { value: 3, label: '3 ngày trước' },
];

const HOUR_OPTIONS = Array.from({ length: 17 }, (_, i) => {
  const h = i + 6;
  return { value: h, label: `${h.toString().padStart(2, '0')}:00` };
});

export default function NotificationsSettingsPage() {
  const discordAdapter = useLiveQuery(
    () => appDb.notificationAdapters.get('discord'),
    [],
  );
  const [webhookUrl, setWebhookUrl] = useState('');
  const [adapterSaved, setAdapterSaved] = useState(false);

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
      daysBefore: discordAdapter?.daysBefore ?? 1,
      notifyHour: discordAdapter?.notifyHour ?? 8,
    };
    await appDb.notificationAdapters.put(adapter);
    setAdapterSaved(true);
    posthog.capture('adapter_saved', { adapter: 'discord' });
    setTimeout(() => setAdapterSaved(false), 2000);
  }


  async function handleDaysBeforeChange(value: string) {
    await appDb.notificationAdapters.update('discord', { daysBefore: Number(value) });
  }

  async function handleNotifyHourChange(value: string) {
    await appDb.notificationAdapters.update('discord', { notifyHour: Number(value) });
  }

  return (
    <>
      {/* Discord */}
      <div className="p-4 border border-dashed border-slate-200 rounded mb-3">
        <div className="flex items-center gap-2 mb-3">
          <IconBrandDiscord size={18} className="text-[#5865F2] shrink-0" />
          <span className="text-sm font-medium text-slate-800">Discord</span>
        </div>
        <input
          type="url"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://discord.com/api/webhooks/..."
          className="w-full px-3 py-2 border border-dashed border-slate-300 rounded text-slate-900 focus:outline-none focus:border-brand-blue text-sm mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSaveAdapter}
            disabled={!webhookUrl.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 rounded text-sm text-slate-700 hover:border-slate-500 transition-colors disabled:opacity-40"
          >
            {adapterSaved ? <IconCheck size={14} className="text-green-500" /> : <IconDeviceFloppy size={14} />}
            {adapterSaved ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>

      {/* Global reminder preferences */}
      <div className="p-4 border border-dashed border-slate-200 rounded mb-3">
        <p className="text-sm font-medium text-slate-800 mb-3">Tùy chọn nhắc nhở</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-600">Nhắc trước</span>
            <Select
              value={String(discordAdapter?.daysBefore ?? 1)}
              onValueChange={handleDaysBeforeChange}
              disabled={!discordAdapter}
            >
              <SelectTrigger size="sm" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={String(o.value)}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-600">Lúc</span>
            <Select
              value={String(discordAdapter?.notifyHour ?? 8)}
              onValueChange={handleNotifyHourChange}
              disabled={!discordAdapter}
            >
              <SelectTrigger size="sm" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HOUR_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={String(o.value)}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {!discordAdapter && (
          <p className="text-xs text-slate-400 mt-2">Lưu webhook để bật tùy chọn này.</p>
        )}
      </div>

      {/* Coming soon */}
      {(['Telegram', 'Zalo'] as const).map((name) => (
        <div key={name} className="flex items-center gap-3 p-4 border border-dashed border-slate-100 rounded mb-2 opacity-50">
          <IconLock size={16} className="text-slate-300 shrink-0" />
          <span className="text-sm text-slate-400">{name}</span>
          <span className="ml-auto text-sm text-slate-300">Sắp ra mắt</span>
        </div>
      ))}
    </>
  );
}
