'use client';

import Link from 'next/link';
import { IconAlertTriangle, IconWifi } from '@tabler/icons-react';
import { OwLogo } from '@/components/ow-ui/ow-logo';

function isApiConnectionError(error: Error): boolean {
  const msg = error.message.toLowerCase();
  return (
    msg.includes('fetch failed') ||
    msg.includes('econnrefused') ||
    msg.includes('connection refused') ||
    msg.includes('network request failed') ||
    msg.includes('failed to fetch')
  );
}

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === 'development';
  const isApiError = isApiConnectionError(error);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
  const isLocalApi = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');

  const showApiHint = isDev && isApiError;

  return (
    <div className="ow-error-page flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <OwLogo className="mb-10 h-12 w-12" />
      <div className="mb-8">
        {showApiHint ? (
          <IconWifi className="size-12 text-[var(--color-text-muted)]" stroke={1.5} />
        ) : (
          <IconAlertTriangle className="size-12 text-[var(--color-text-muted)]" stroke={1.5} />
        )}
      </div>

      {showApiHint ? (
        <>
          <h2 className="heading-3 mb-3">Không kết nối được API</h2>
          <p className="text-body-sm mb-6 max-w-sm text-[var(--color-text-muted)]">
            {isLocalApi
              ? <>API local (<code className="font-mono text-xs">{apiUrl}</code>) chưa chạy.</>
              : <>Không kết nối được tới <code className="font-mono text-xs">{apiUrl}</code>.</>}
          </p>
          <div className="mb-10 w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4 text-left">
            <p className="text-body-sm mb-3 font-semibold">Khắc phục (dev only):</p>
            <ol className="text-body-sm list-inside list-decimal space-y-2 text-[var(--color-text-muted)]">
              {isLocalApi && (
                <li>
                  Khởi động API local:&nbsp;
                  <code className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 font-mono text-xs">
                    cd ../api && pnpm dev
                  </code>
                </li>
              )}
              <li>
                Hoặc đổi sang API live trong{' '}
                <code className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 font-mono text-xs">.env.local</code>:
                <pre className="mt-1.5 rounded bg-[var(--color-surface)] p-2 font-mono text-xs leading-relaxed">
                  {`NEXT_PUBLIC_API_URL=https://api.openwallet.vn`}
                </pre>
                <span className="text-xs">Sau đó restart dev server.</span>
              </li>
            </ol>
          </div>
        </>
      ) : (
        <>
          <h2 className="heading-3 mb-3">Đã xảy ra lỗi</h2>
          <p className="text-body-sm mb-10 max-w-sm text-[var(--color-text-muted)]">
            Đã có lỗi xảy ra khi tải trang này. Vui lòng thử lại hoặc quay về trang chủ.
          </p>
        </>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="text-body-md inline-flex items-center rounded-[48px] bg-black px-6 py-4 text-white transition-opacity hover:opacity-80"
        >
          Thử lại
        </button>
        <Link
          href="/"
          className="text-body-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
