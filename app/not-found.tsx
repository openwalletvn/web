import Link from 'next/link';
import { IconError404 } from '@tabler/icons-react';
import { SoSanh404Redirect } from '@/components/layout/so-sanh-404-redirect';

export default function NotFound() {
 return (
 <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
 <SoSanh404Redirect />
 <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-sm border border-dashed border-slate-200">
 <IconError404 className="size-10 text-slate-400" stroke={1.5} />
 </div>

 <h1 className="font-heading mb-2">
 Trang không tồn tại
 </h1>
 <p className="mb-8 max-w-sm text-sm text-slate-400">
 Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên, hoặc không tồn tại.
 </p>

 <div className="flex items-center gap-4">
 <Link
 href="/"
 className="rounded-sm border border-dashed border-brand-blue px-6 py-2.5 text-sm font-medium text-brand-blue transition-colors hover:bg-blue-50/60"
 >
 Về trang chủ
 </Link>
 </div>
 </div>
 );
}
