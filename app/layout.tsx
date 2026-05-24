import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter_Tight } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { BodyClass } from '@/components/layout/body-class';
import { PreviewBanner } from '@/components/layout/preview-banner';
import "./globals.css";

const calSans = localFont({
  src: [
    { path: "../public/fonts/cal-sans-latin.woff2", unicodeRange: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" },
    { path: "../public/fonts/cal-sans-latin-ext.woff2", unicodeRange: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" },
    { path: "../public/fonts/cal-sans-vietnamese.woff2", unicodeRange: "U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB" },
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
    <html lang="vi" className={`${calSans.variable} ${interTight.variable}`}>
      <body className="antialiased">
        <BodyClass />
        {children}
        <PreviewBanner />
        <GoogleAnalytics gaId="G-0PTTBZY0RM" />
      </body>
    </html>
  );
}
