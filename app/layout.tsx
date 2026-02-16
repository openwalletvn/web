import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenWallet Vietnam",
  description: "Open-source digital wallet card database for Vietnam",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
