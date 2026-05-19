import type { Metadata } from "next";
import { Cal_Sans, Inter_Tight } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
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

export async function generateMetadata(): Promise<Metadata> {
  const [tm, tog] = await Promise.all([
    getTranslations('metadata'),
    getTranslations('og'),
  ]);

  return {
    metadataBase: new URL('https://openwallet.vn'),
    title: tm('title'),
    description: tm('description'),
    alternates: {
      canonical: '/',
      languages: {
        vi: '/',
        'x-default': '/',
      },
    },
    openGraph: {
      title: tm('title'),
      description: tog('description'),
      url: 'https://openwallet.vn',
      siteName: tm('siteName'),
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tm('title'),
      description: tog('description'),
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
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
