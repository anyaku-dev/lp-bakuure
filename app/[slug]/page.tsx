import React from 'react';
import Script from 'next/script';
import { notFound, permanentRedirect } from 'next/navigation';
import { getLps, getGlobalSettings, LpData, TrackingConfig } from '../cms/actions';
import PasswordProtect from './_components/PasswordProtect';
import { CountdownHeader, MenuHeader, FadeInImage, FixedFooterCta, PcBackground, SideImages } from './_components/LpClient';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getData(slug: string) {
  const [lps, globalSettings] = await Promise.all([getLps(), getGlobalSettings()]);
  const lp = lps.find(item => item.slug === slug);
  return { lp, globalSettings };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { lp, globalSettings } = await getData(slug);
  
  if (!lp) return { title: 'Not Found' };

  const title = lp.pageTitle || lp.title;
  const description = lp.customMetaDescription || globalSettings.defaultMetaDescription || '';
  
  const rawFavicon = lp.customFavicon || globalSettings.defaultFavicon;
  let faviconUrl = '/favicon.ico';
  if (rawFavicon) {
    const separator = rawFavicon.includes('?') ? '&' : '?';
    faviconUrl = `${rawFavicon}${separator}v=${Date.now()}`;
  }

  const ogpImage = lp.customOgpImage || globalSettings.defaultOgpImage;

  return {
    title: title,
    description: description,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: title,
      description: description,
      images: ogpImage ? [ogpImage] : [],
    },
  };
}

export default async function DynamicLpPage({ params }: Props) {
  const { slug } = await params;
  const { lp, globalSettings } = await getData(slug);

  if (!lp) return notFound();

  // 301リダイレクト設定がある場合はリダイレクト
  if (lp.redirect?.enabled && lp.redirect?.url) {
    permanentRedirect(lp.redirect.url);
  }

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
    meta: '', 
    useDefault: true
  } : lp.tracking;

  const headCode = lp.customHeadCode || globalSettings.defaultHeadCode || '';
  const bgImage = lp.pcBackgroundImage || globalSettings.pcBackgroundImage || '';
  const pcMaxWidth = globalSettings.pcMaxWidth || 480;

  return (
    <>
      {lp.customCss && (
        <style dangerouslySetInnerHTML={{ __html: lp.customCss }} />
      )}

      {headCode && (
         <div dangerouslySetInnerHTML={{ __html: headCode }} style={{display:'none'}} />
      )}

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

      <PcBackground src={bgImage} />
      <SideImages config={lp.sideImages} pcMaxWidth={pcMaxWidth} />

      <main className="min-h-screen bg-white">
        {lp.header?.type === 'timer' && (
          <>
            <div className="fixed top-0 left-0 w-full z-[999] flex justify-center pointer-events-none">
              <div className="w-full md:max-w-[425px] pointer-events-auto shadow-lg">
                <CountdownHeader periodDays={lp.header.timerPeriodDays} />
              </div>
            </div>
            <div className="w-full md:max-w-[425px] mx-auto h-[53px]" />
          </>
        )}

        {lp.header?.type === 'menu' && (
          <>
            <div className="fixed top-0 left-0 w-full z-[999] flex justify-center pointer-events-none">
              <div className="w-full md:max-w-[425px] pointer-events-auto shadow-sm relative">
                <MenuHeader logoSrc={lp.header.logoSrc} items={lp.header.menuItems} />
              </div>
            </div>
            <div className="w-full md:max-w-[425px] mx-auto h-[60px]" />
          </>
        )}

        {/* コンテンツ */}
        <div className="md:max-w-[425px] w-full mx-auto bg-white relative">
          {lp.images.map((img, index) => (
            <section key={index} className="w-full">
              <FadeInImage data={img} index={index} />
            </section>
          ))}
        </div>

        {lp.footerCta?.enabled && (
           <FixedFooterCta config={lp.footerCta} />
        )}
      </main>
    </>
  );
}