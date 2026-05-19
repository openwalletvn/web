'use client';

import Link from 'next/link';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function ErrorPage({
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 return (
 <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
 <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-sm border border-dashed border-slate-200">
 <IconAlertTriangle className="size-10 text-slate-400" stroke={1.5} />
 </div>

 <h1 className="font-heading mb-2">
 Đã xảy ra lỗi
 </h1>
 <p className="mb-8 max-w-sm text-sm text-slate-400">
 Đã có lỗi xảy ra khi tải trang này. Vui lòng thử lại hoặc quay về trang chủ.
 </p>

 <div className="flex items-center gap-4">
 <button
 onClick={reset}
 className="rounded-sm border border-dashed border-brand-blue px-6 py-2.5 text-sm font-medium text-brand-blue transition-colors hover:bg-blue-50/60"
 >
 Thử lại
 </button>
 <Link
 href="/"
 className="text-sm text-slate-400 transition-colors hover:text-slate-600"
 >
 Về trang chủ
 </Link>
 </div>
 </div>
 );
}
