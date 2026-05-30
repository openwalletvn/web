'use client';

import Link from 'next/link';
import { IconAlertTriangle } from '@tabler/icons-react';
import { OwLogo } from '@/components/ow-ui/ow-logo';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="ow-error-page flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <OwLogo className="mb-10 h-12 w-12" />
      <div className="mb-8">
        <IconAlertTriangle className="size-12 text-[var(--color-text-muted)]" stroke={1.5} />
      </div>

      <h2 className="heading-3 mb-3">
        Đã xảy ra lỗi
      </h2>
      <p className="text-body-sm mb-10 max-w-sm text-[var(--color-text-muted)]">
        Đã có lỗi xảy ra khi tải trang này. Vui lòng thử lại hoặc quay về trang chủ.
      </p>

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
