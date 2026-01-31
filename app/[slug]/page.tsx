import React from 'react';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { getLps, getGlobalSettings, LpData, TrackingConfig } from '../cms/actions';
import PasswordProtect from './_components/PasswordProtect';
import { CountdownHeader, FadeInImage } from './_components/LpClient';
import { Metadata } from 'next';

// 型定義を Next.js 15/16 仕様に合わせて Promise に変更
type Props = {
  params: Promise<{ slug: string }>;
};

// サーバーサイドでのデータ取得ヘルパー
async function getData(slug: string) {
  const [lps, globalSettings] = await Promise.all([getLps(), getGlobalSettings()]);
  const lp = lps.find(item => item.slug === slug);
  return { lp, globalSettings };
}

// メタデータ生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ★ ここで await する
  const { slug } = await params;
  
  const { lp, globalSettings } = await getData(slug);
  if (!lp) return { title: 'Not Found' };

  const title = lp.pageTitle || lp.title;
  const description = lp.customMetaDescription || globalSettings.defaultMetaDescription || '';
  const favicon = lp.customFavicon || globalSettings.defaultFavicon || '/favicon.ico';
  const ogpImage = lp.customOgpImage || globalSettings.defaultOgpImage;

  return {
    title: title,
    description: description,
    icons: {
      icon: favicon,
    },
    openGraph: {
      title: title,
      description: description,
      images: ogpImage ? [ogpImage] : [],
    },
  };
}

// メインページコンポーネント
export default async function DynamicLpPage({ params }: Props) {
  // ★ ここでも await する
  const { slug } = await params;

  const { lp, globalSettings } = await getData(slug);

  if (!lp) return notFound();

  // CMSコンテンツ
  const content = <LpContent lp={lp} globalSettings={globalSettings} />;

  if (lp.status === 'private' && lp.password) {
     return <PasswordProtect validPassword={lp.password}>{content}</PasswordProtect>;
  }

  return content;
}

function LpContent({ lp, globalSettings }: { lp: LpData, globalSettings: any }) {
  const tracking: TrackingConfig = lp.tracking.useDefault ? {
    gtm: globalSettings.defaultGtm,
    pixel: globalSettings.defaultPixel,
    meta: '', // 未使用
    useDefault: true
  } : lp.tracking;

  const headCode = lp.customHeadCode || globalSettings.defaultHeadCode || '';

  return (
    <>
      {/* Head内カスタムコード */}
      {headCode && (
         <div dangerouslySetInnerHTML={{ __html: headCode }} style={{display:'none'}} />
      )}

      {/* GTM */}
      {tracking.gtm && (
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${tracking.gtm}');`}
        </Script>
      )}
      {tracking.gtm && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${tracking.gtm}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}

      {/* Meta Pixel */}
      {tracking.pixel && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${tracking.pixel}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      <main className="min-h-screen bg-white">
        {lp.timer.enabled && (
          <>
            <div className="fixed top-0 left-0 w-full z-[999] flex justify-center pointer-events-none">
              <div className="w-full md:max-w-[425px] pointer-events-auto shadow-lg">
                <CountdownHeader periodDays={lp.timer.periodDays} />
              </div>
            </div>
            {/* ヘッダー高さ確保用スペーサー */}
            <div className="w-full md:max-w-[425px] mx-auto h-[53px]" />
          </>
        )}

        <div className="md:max-w-[425px] w-full mx-auto bg-white relative">
          {lp.images.map((img, index) => (
            <section key={index} className="w-full">
              <FadeInImage data={img} index={index} />
            </section>
          ))}
        </div>
      </main>
    </>
  );
}