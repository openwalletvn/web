import type {Metadata} from "next";
import localFont from "next/font/local";
import {Inter_Tight} from "next/font/google";
import {SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL} from '@/lib/page-meta/title';
import {GoogleAnalytics} from '@next/third-parties/google';
import {BodyClass} from '@/components/layout/body-class';
import {OverlayScrollbarsBody} from '@/components/layout/overlay-scrollbars-body';
import {PreviewBanner} from '@/components/layout/preview-banner';
import {cn} from '@/lib/utils';
import {TooltipProvider} from '@/components/ui/tooltip';
import {OwOwieFab} from '@/components/owui/ow-owie-fab';
import {ChatProvider} from '@/components/chat/chat-provider';
import {ChatPanel} from '@/components/chat/chat-panel';
import {HashScroll} from '@/components/layout/hash-scroll';
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
    metadataBase: new URL(SITE_URL),
    ...(isPreview && { robots: { index: false, follow: false } }),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    alternates: {
      canonical: '/',
      languages: {
        vi: '/',
        'x-default': '/',
      },
    },
    openGraph: {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: 'vi_VN',
      type: 'website',
      images: [{ url: '/og.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
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
    <html lang="vi" className={cn(calSans.variable, interTight.variable)} data-overlayscrollbars-initialize>
      <body className="antialiased">
        <TooltipProvider>
          <ChatProvider>
            <BodyClass />
            <OverlayScrollbarsBody />
            <HashScroll />
            {children}
            <OwOwieFab/>
            <ChatPanel/>
            <PreviewBanner />
          </ChatProvider>
        </TooltipProvider>
        <GoogleAnalytics gaId="G-0PTTBZY0RM" />
      </body>
    </html>
  );
}
