import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
    images: [{ url: "/ogp.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "バク売れLPテンプレ",
    description:
      "「なぜか売れない」を終わらせる。実際に成果が出たLPを分析して、即使えるデザインテンプレ化。最短ルートで成果を出したい方へ。",
    images: ["/ogp.jpg"],
  },
};

function AnalyticsSlots() {
  const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID; // 例: G-XXXXXXXXXX
  const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID; // 例: 1234567890
  const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID; // 例: abcdefghij

  return (
    <>
      {/* =========================
          GA4（必要になったら env を入れるだけで有効化）
         ========================= */}
      {GA4_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}');
          `}</Script>
        </>
      ) : null}

      {/* =========================
          Meta Pixel（必要になったら env を入れるだけで有効化）
         ========================= */}
      {META_PIXEL_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
      ) : null}

      {/* =========================
          Microsoft Clarity（必要になったら env を入れるだけで有効化）
         ========================= */}
      {CLARITY_ID ? (
        <Script id="clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `}</Script>
      ) : null}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AnalyticsSlots />
        {children}
      </body>
    </html>
  );
}
