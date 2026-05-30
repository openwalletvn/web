import Link from 'next/link';
import { IconError404 } from '@tabler/icons-react';
import { SoSanh404Redirect } from '@/components/layout/so-sanh-404-redirect';
import { Logo } from '@/components/layout/logo';
import {OwButton} from '@/components/ow-ui/ow-button';

export default function NotFound() {
  return (
    <div className="ow-not-found flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <SoSanh404Redirect />
      <Logo className="mb-10 h-12 w-12" />
      <div className="mb-8">
        <IconError404 className="size-12 text-[var(--color-text-muted)]" stroke={1.5} />
      </div>

      <h2 className="heading-3 mb-3">
        Trang không tồn tại
      </h2>
      <p className="text-body-sm mb-10 max-w-sm text-[var(--color-text-muted)]">
        Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên, hoặc không tồn tại.
      </p>

      <OwButton asChild>
        <Link href="/">Về trang chủ</Link>
      </OwButton>
    </div>
  );
}
