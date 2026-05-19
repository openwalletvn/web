import Link from 'next/link';
import { IconError404 } from '@tabler/icons-react';
import { SoSanh404Redirect } from '@/components/layout/so-sanh-404-redirect';
import { Logo } from '@/components/layout/logo';

export default function NotFound() {
  return (
    <div className="ow-not-found flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <SoSanh404Redirect />
      <Logo className="mb-10 h-12 w-12" />
      <div className="mb-8">
        <IconError404 className="size-12 text-[var(--color-text-muted)]" stroke={1.5} />
      </div>

      <h2 className="text-display-md mb-3">
        Trang không tồn tại
      </h2>
      <p className="text-body-sm mb-10 max-w-sm text-[var(--color-text-muted)]">
        Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên, hoặc không tồn tại.
      </p>

      <Link
        href="/"
        className="text-ui inline-flex items-center rounded-[48px] bg-black px-6 py-4 text-white transition-opacity hover:opacity-80"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
