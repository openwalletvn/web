import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter_Tight } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { BodyClass } from '@/components/layout/body-class';
import { PreviewBanner } from '@/components/layout/preview-banner';
import { cn } from '@/lib/utils';
import "./globals.css";

const calSans = localFont({
  src: [
    { path: "../public/fonts/cal-sans-latin.woff2" },
    { path: "../public/fonts/cal-sans-latin-ext.woff2" },
    { path: "../public/fonts/cal-sans-vietnamese.woff2" },
  ],
  variable: "--font-display",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-body",
});

const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL('https://openwallet.vn'),
    ...(isPreview && { robots: { index: false, follow: false } }),
    title: 'Open Wallet – Tra cứu thẻ. Quản lý thẻ.',
    description: 'Tra cứu thông tin thẻ ngân hàng Việt Nam và quản lý ngày sao kê, nhắc hạn thanh toán. Miễn phí, bảo mật, mã nguồn mở.',
    alternates: {
      canonical: '/',
      languages: {
        vi: '/',
        'x-default': '/',
      },
    },
    openGraph: {
      title: 'Open Wallet – Tra cứu thẻ. Quản lý thẻ.',
      description: 'Tra cứu thông tin thẻ tín dụng, thẻ ghi nợ Việt Nam. Theo dõi ngày sao kê, quản lý thẻ cá nhân.',
      url: 'https://openwallet.vn',
      siteName: 'Open Wallet',
      locale: 'vi_VN',
      type: 'website',
      images: [{ url: '/og.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Open Wallet – Tra cứu thẻ. Quản lý thẻ.',
      description: 'Tra cứu thông tin thẻ tín dụng, thẻ ghi nợ Việt Nam. Theo dõi ngày sao kê, quản lý thẻ cá nhân.',
      images: ['/og.png'],
    },
    icons: {
      icon: '/icon.png',
      apple: '/icon.png',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn(calSans.variable, interTight.variable)}>
      <body className="antialiased">
        <BodyClass />
        {children}
        <PreviewBanner />
        <GoogleAnalytics gaId="G-0PTTBZY0RM" />
      </body>
    </html>
  );
}
