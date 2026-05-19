import type { Metadata } from "next";
import { Cal_Sans, Inter_Tight } from "next/font/google";
import { BodyClass } from '@/components/layout/body-class';
import "./globals.css";

const calSans = Cal_Sans({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-display",
  adjustFontFallback: false,
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-body",
});

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL('https://openwallet.vn'),
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
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Open Wallet – Tra cứu thẻ. Quản lý thẻ.',
      description: 'Tra cứu thông tin thẻ tín dụng, thẻ ghi nợ Việt Nam. Theo dõi ngày sao kê, quản lý thẻ cá nhân.',
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
      </body>
    </html>
  );
}
