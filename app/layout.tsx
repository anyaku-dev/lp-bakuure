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
  title: "バク売れLPテンプレ",
  description:
    "「なぜか売れない」を終わらせる。実際に成果が出たLPを分析して、即使えるデザインテンプレ化。最短ルートで成果を出したい方へ。",
  openGraph: {
    title: "バク売れLPテンプレ",
    description:
      "「なぜか売れない」を終わらせる。実際に成果が出たLPを分析して、即使えるデザインテンプレ化。最短ルートで成果を出したい方へ。",
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: "/ogp.jpg",
        width: 1200,
        height: 630,
        alt: "バク売れLPテンプレ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "バク売れLPテンプレ",
    description:
      "「なぜか売れない」を終わらせる。実際に成果が出たLPを分析して、即使えるデザインテンプレ化。最短ルートで成果を出したい方へ。",
    images: ["/ogp.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
