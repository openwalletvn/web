import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import "./globals.css";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
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
      icon: '/icon.jpg',
      apple: '/icon.jpg',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={leagueSpartan.variable}>
      <body className="antialiased">
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
