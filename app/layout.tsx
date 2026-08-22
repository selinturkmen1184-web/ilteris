import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ilteris.com.tr"),
  title: "ilteris.com.tr — Üret. Paylaş. Öğren. Anonim Kal.",
  description: "Projelerin, fikirlerin ve merakın için anonim teknoloji topluluğu.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ilteris.com.tr — Üret. Paylaş. Öğren. Anonim Kal.",
    description: "Projelerin, fikirlerin ve merakın için anonim teknoloji topluluğu.",
    url: "https://ilteris.com.tr",
    siteName: "ilteris.com.tr",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "ilteris.com.tr anonim teknoloji topluluğu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ilteris.com.tr — Üret. Paylaş. Öğren. Anonim Kal.",
    description: "Projelerin, fikirlerin ve merakın için anonim teknoloji topluluğu.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
